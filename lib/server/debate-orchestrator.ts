import { PERSONA_LABELS, PERSONA_SYSTEM_PROMPTS, DEBATE_CONSTITUTION } from '@/lib/ai/persona-prompts';
import { buildAiMessage, createHumanInsertMessage, deriveMeta, pickNextSpeaker } from '@/lib/debate-engine';
import { OPENAI_MODEL, getOpenAIClient } from '@/lib/server/openai-client';
import { AIId, DebateMessage, DebateTurnRequest, DebateTurnResponse } from '@/lib/types';

const HISTORY_LIMIT = 8;

function toConversationContext(messages: DebateMessage[]) {
  return messages.slice(-HISTORY_LIMIT).map((m) => `${m.speakerName}: ${m.content}`).join('\n');
}

async function generatePersonaMessage(
  speakerId: AIId,
  request: DebateTurnRequest,
  messages: DebateMessage[]
): Promise<string> {
  const client = getOpenAIClient();
  const conversation = toConversationContext(messages);
  const prompt = `Sujet: ${request.config.topic}
Niveau de tension: ${request.config.tension}
Durée: ${request.config.duration}
Mode utilisateur: ${request.config.userMode}
Angle dominant: ${request.config.angle}
Intervention humaine en attente: ${request.handRaised ? 'oui' : 'non'}

Contexte récent:
${conversation || 'Début du débat.'}

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

  if (request.bootstrap) {
    const openingOrder: AIId[] = ['seren', 'aegis', 'nexus', 'equinox'].sort(() => Math.random() - 0.5);
    for (const speakerId of openingOrder) {
      const content = await generatePersonaMessage(speakerId, request, workingMessages);
      const msg = buildAiMessage(speakerId, content);
      workingMessages.push(msg);
      generated.push(msg);
    }
  } else {
    if (request.handRaised && workingMessages.length > 0 && workingMessages.length % 4 === 0) {
      const humanMsg = createHumanInsertMessage(request.config.topic);
      workingMessages.push(humanMsg);
      generated.push(humanMsg);
    }

    const nextSpeaker = pickNextSpeaker(workingMessages, request.handRaised);
    const content = await generatePersonaMessage(nextSpeaker, request, workingMessages);
    const nextMsg = buildAiMessage(nextSpeaker, content);
    workingMessages.push(nextMsg);
    generated.push(nextMsg);
  }

  const lastAi = [...workingMessages].reverse().find((m) => m.speakerId !== 'human')!;

  return {
    generated,
    meta: deriveMeta(workingMessages, request.config.topic),
    activeSpeaker: lastAi.speakerId as AIId
  };
}
