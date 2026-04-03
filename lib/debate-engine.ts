import { PERSONAS } from '@/data/personas';
import { AIId, DebateMessage, DebateMeta, DebatePhase } from '@/lib/types';

export const MAX_DEBATE_MESSAGES = 30;

export function getPhaseForMessage(messageCount: number): DebatePhase {
  if (messageCount <= 8) return 'Analyse du problème';
  if (messageCount <= 16) return 'Proposition de solutions';
  if (messageCount <= 24) return 'Confrontation / critique';
  return 'Synthèse finale';
}

export function computeDynamicDelayMs(message: DebateMessage | undefined): number {
  if (!message) return 3200;
  const lengthScore = Math.min(1, message.content.length / 280);
  const complexityWords = ['cependant', 'néanmoins', 'compromis', 'hypothèse', 'risque', 'trade-off'];
  const complexityHits = complexityWords.filter((word) => message.content.toLowerCase().includes(word)).length;
  const complexityScore = Math.min(1, complexityHits / 3);
  const delay = 3000 + Math.round((lengthScore * 0.65 + complexityScore * 0.35) * 3000);
  return Math.min(6000, Math.max(3000, delay));
}

export const pickNextSpeaker = (messages: DebateMessage[], humanQueued: boolean): AIId => {
  if (humanQueued && messages.length > 2) return 'equinox';

  const last = messages[messages.length - 1];
  const ids: AIId[] = ['seren', 'aegis', 'nexus', 'equinox'];
  const filtered = ids.filter((id) => id !== last?.speakerId);

  if (last?.speakerId === 'aegis') return 'seren';
  if (last?.speakerId === 'seren') return Math.random() > 0.5 ? 'aegis' : 'nexus';
  if (last?.speakerId === 'nexus') return Math.random() > 0.4 ? 'aegis' : 'equinox';

  return filtered[Math.floor(Math.random() * filtered.length)];
};

export const createHumanInsertMessage = (topic: string): DebateMessage => ({
  id: `human-${Date.now()}`,
  speakerId: 'human',
  speakerName: 'Vous',
  content: `Je prends la parole: sur “${topic}”, quel compromis est acceptable dès maintenant ?`,
  timestamp: Date.now(),
  tone: 'neutral'
});

export const buildAiMessage = (speakerId: AIId, content: string): DebateMessage => {
  const persona = PERSONAS.find((p) => p.id === speakerId)!;
  return {
    id: `${speakerId}-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
    speakerId,
    speakerName: persona.name,
    content,
    timestamp: Date.now(),
    tone: speakerId === 'equinox' ? 'arbitrate' : Math.random() > 0.45 ? 'push' : 'support'
  };
};

export const deriveMeta = (messages: DebateMessage[], topic: string, latestSummary: string | null = null): DebateMeta => {
  const last = messages[messages.length - 1];
  const total = Math.max(messages.length, 1);
  const disagreements = messages.filter((m) => m.content.includes('Non') || m.content.includes('incomplet')).length;
  const synths = messages.filter((m) => m.speakerId === 'equinox').length;
  const phase = getPhaseForMessage(total);

  const temperature = Math.min(100, Math.round((disagreements / total) * 100 + Math.random() * 15));
  const polarization = Math.min(100, Math.round((disagreements / total) * 90));

  return {
    temperature,
    consensus: ['Besoin de cadre clair', 'Nécessité d’anticiper les effets sociaux'].slice(0, Math.max(1, synths)),
    frictions: ['Niveau de contrainte', 'Priorité court terme vs long terme'],
    dominantAxis: ['Social', 'Sécuritaire', 'Économique', 'Équilibré'][Math.floor(Math.random() * 4)] as DebateMeta['dominantAxis'],
    polarization,
    activeSpeaker: last?.speakerId && last.speakerId !== 'human' ? last.speakerId : null,
    activeTopic: topic,
    emergingSubthemes: ['Confiance citoyenne', 'Traçabilité', 'Compétitivité'],
    globalState: temperature > 70 ? 'Pic de tension' : synths > 2 ? 'Arbitrage actif' : 'En cadence',
    phase,
    remainingMessages: Math.max(0, MAX_DEBATE_MESSAGES - messages.length),
    recommendedDelayMs: computeDynamicDelayMs(last),
    latestSummary
  };
};
