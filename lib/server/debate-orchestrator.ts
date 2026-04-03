import { PERSONA_LABELS, PERSONA_SYSTEM_PROMPTS, DEBATE_CONSTITUTION } from '@/lib/ai/persona-prompts';
import {
  MAX_DEBATE_MESSAGES,
  buildAiMessage,
  createHumanInsertMessage,
  deriveMeta,
  getPhaseForMessage,
  pickNextSpeaker
} from '@/lib/debate-engine';
import { OPENAI_MODEL, getOpenAIClient } from '@/lib/server/openai-client';
import { AIId, DebateMessage, DebateTurnRequest, DebateTurnResponse } from '@/lib/types';

const HISTORY_LIMIT = 6;
const SUMMARY_INTERVAL = 5;

function buildIntermediateSummary(messages: DebateMessage[]): string {
  const lastChunk = messages.slice(-SUMMARY_INTERVAL);
  if (!lastChunk.length) return '';
  const synthesis = lastChunk
    .map((message) => `- ${message.speakerName}: ${message.content.slice(0, 90)}`)
    .join('\n');
  return `Résumé automatique (messages ${Math.max(1, messages.length - SUMMARY_INTERVAL + 1)}-${messages.length}) :\n${synthesis}`;
}

function toConversationContext(messages: DebateMessage[]) {
  const recent = messages.slice(-HISTORY_LIMIT).map((m) => `${m.speakerName}: ${m.content}`).join('\n');
  const summaries: string[] = [];
  for (let i = SUMMARY_INTERVAL; i <= messages.length; i += SUMMARY_INTERVAL) {
    summaries.push(buildIntermediateSummary(messages.slice(0, i)));
  }
  return `${summaries.slice(-2).join('\n\n')}\n\nÉchanges récents:\n${recent}`.trim();
}

async function generatePersonaMessage(
  speakerId: AIId,
  request: DebateTurnRequest,
  messages: DebateMessage[],
  nextMessageIndex: number
): Promise<string> {
  const client = getOpenAIClient();
  const conversation = toConversationContext(messages);
  const phase = getPhaseForMessage(nextMessageIndex);
  const convergenceMode = nextMessageIndex >= 20;
  const finalDecisionMode = nextMessageIndex >= MAX_DEBATE_MESSAGES;
  const prompt = `Sujet: ${request.config.topic}
Niveau de tension: ${request.config.tension}
Durée: ${request.config.duration}
Mode utilisateur: ${request.config.userMode}
Angle dominant: ${request.config.angle}
Intervention humaine en attente: ${request.handRaised ? 'oui' : 'non'}
Phase obligatoire: ${phase}
Message #${nextMessageIndex}/${MAX_DEBATE_MESSAGES}
Convergence obligatoire: ${convergenceMode ? 'oui' : 'non'}
Décision finale obligatoire: ${finalDecisionMode ? 'oui' : 'non'}

Contexte récent:
${conversation || 'Début du débat.'}

Consignes:
- Évite les redites.
- Donne une réponse actionnable et concise.
- À partir du message 20, réduis explicitement les divergences et propose un compromis.
- Au message 30, formule une décision finale claire avec justification rationnelle (2-3 phrases max).

Génère la prochaine prise de parole de ${PERSONA_LABELS[speakerId]}.`;

  const completion = await client.chat.completions.create({
    model: OPENAI_MODEL,
    temperature: 0.85,
    max_tokens: 90,
    messages: [
      { role: 'system', content: DEBATE_CONSTITUTION },
      { role: 'system', content: PERSONA_SYSTEM_PROMPTS[speakerId] },
      { role: 'user', content: prompt }
    ]
  });

  return completion.choices[0]?.message?.content?.trim() || 'Point valide, mais incomplet.';
}

export async function generateDebateTurn(request: DebateTurnRequest): Promise<DebateTurnResponse> {
  let workingMessages = [...request.messages];
  const generated: DebateMessage[] = [];
  let latestSummary: string | null = null;

  if (workingMessages.length >= MAX_DEBATE_MESSAGES) {
    const lastAi = [...workingMessages].reverse().find((m) => m.speakerId !== 'human');
    return {
      generated,
      meta: deriveMeta(workingMessages, request.config.topic, buildIntermediateSummary(workingMessages)),
      activeSpeaker: (lastAi?.speakerId ?? 'equinox') as AIId
    };
  }

  if (request.bootstrap) {
    const openingOrder = (['seren', 'aegis', 'nexus', 'equinox'] as AIId[]).sort(() => Math.random() - 0.5);
    for (const speakerId of openingOrder) {
      if (workingMessages.length >= MAX_DEBATE_MESSAGES) break;
      const content = await generatePersonaMessage(speakerId, request, workingMessages, workingMessages.length + 1);
      const msg = buildAiMessage(speakerId, content);
      workingMessages.push(msg);
      generated.push(msg);
    }
  } else {
    if (request.handRaised && workingMessages.length > 0 && workingMessages.length % 4 === 0 && workingMessages.length < MAX_DEBATE_MESSAGES) {
      const humanMsg = createHumanInsertMessage(request.config.topic);
      workingMessages.push(humanMsg);
      generated.push(humanMsg);
    }

    const nextMessageIndex = workingMessages.length + 1;
    const nextSpeaker = nextMessageIndex >= MAX_DEBATE_MESSAGES ? 'equinox' : pickNextSpeaker(workingMessages, request.handRaised);
    const content = await generatePersonaMessage(nextSpeaker, request, workingMessages, nextMessageIndex);
    const nextMsg = buildAiMessage(nextSpeaker, content);
    workingMessages.push(nextMsg);
    generated.push(nextMsg);
  }

  if (workingMessages.length > 0 && workingMessages.length % SUMMARY_INTERVAL === 0) {
    latestSummary = buildIntermediateSummary(workingMessages);
  }

  const lastAi = [...workingMessages].reverse().find((m) => m.speakerId !== 'human')!;

  return {
    generated,
    meta: deriveMeta(workingMessages, request.config.topic, latestSummary),
    activeSpeaker: lastAi.speakerId as AIId
  };
}
