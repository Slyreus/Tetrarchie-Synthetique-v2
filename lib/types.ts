export type AIId = 'seren' | 'aegis' | 'nexus' | 'equinox';

export type AIState =
  | 'attend'
  | 'réfléchit'
  | 'répond'
  | 'contredit'
  | 'synthétise'
  | 'intervention humaine détectée';

export type TensionLevel = 'Modéré' | 'Offensif' | 'Critique' | 'Crise';
export type DebateDuration = 'Court' | 'Standard' | 'Approfondi';
export type UserMode = 'Observateur' | 'Intervention ponctuelle' | 'Modérateur actif';
export type DominantAngle = 'Social' | 'Sécuritaire' | 'Économique' | 'Équilibré' | 'Libre';

export interface Persona {
  id: AIId;
  name: string;
  role: string;
  absoluteGoal: string;
  personality: string;
  style: string;
  color: string;
  accent: string;
  glow: string;
}

export interface DebateMessage {
  id: string;
  speakerId: AIId | 'human';
  speakerName: string;
  content: string;
  timestamp: number;
  tone: 'push' | 'support' | 'neutral' | 'arbitrate';
}

export interface DebateConfig {
  topic: string;
  tension: TensionLevel;
  duration: DebateDuration;
  userMode: UserMode;
  angle: DominantAngle;
  animationPace: 'Lent' | 'Normal' | 'Nerveux';
  spectacleMode: boolean;
}

export interface DebateMeta {
  temperature: number;
  consensus: string[];
  frictions: string[];
  dominantAxis: DominantAngle;
  polarization: number;
  activeSpeaker: AIId | null;
  activeTopic: string;
  emergingSubthemes: string[];
  globalState: 'En cadence' | 'Pic de tension' | 'Arbitrage actif' | 'Pause';
}

export interface DebateTurnRequest {
  config: DebateConfig;
  messages: DebateMessage[];
  handRaised: boolean;
  bootstrap?: boolean;
}

export interface DebateTurnResponse {
  generated: DebateMessage[];
  meta: DebateMeta;
  activeSpeaker: AIId;
}
