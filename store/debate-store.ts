'use client';

import { create } from 'zustand';
import { MAX_DEBATE_MESSAGES } from '@/lib/debate-engine';
import { DebateConfig, DebateMessage, DebateMeta, DebateTurnResponse } from '@/lib/types';

interface DebateState {
  config: DebateConfig | null;
  messages: DebateMessage[];
  meta: DebateMeta | null;
  statuses: Record<string, string>;
  handRaised: boolean;
  paused: boolean;
  loading: boolean;
  error: string | null;
  initializeDebate: (config: DebateConfig) => Promise<boolean>;
  advanceDebate: () => Promise<void>;
  raiseHand: () => void;
  clearHand: () => void;
  togglePause: () => void;
  resetDebate: () => void;
}

const defaultStatuses = {
  seren: 'attend',
  aegis: 'attend',
  nexus: 'attend',
  equinox: 'attend'
};

function deriveStatuses(messages: DebateMessage[], handRaised: boolean) {
  const last = messages[messages.length - 1];
  const statuses = { ...defaultStatuses } as Record<string, string>;
  if (last?.speakerId && last.speakerId !== 'human') {
    statuses[last.speakerId] = last.speakerId === 'equinox' ? 'synthétise' : last.tone === 'push' ? 'contredit' : 'répond';
  }
  if (handRaised) statuses.equinox = 'intervention humaine détectée';
  return statuses;
}

async function postTurn(payload: {
  config: DebateConfig;
  messages: DebateMessage[];
  handRaised: boolean;
  bootstrap?: boolean;
}) {
  const response = await fetch('/api/debate/turn', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.error || 'Failed to generate debate turn.');
  }
  return (await response.json()) as DebateTurnResponse;
}

export const useDebateStore = create<DebateState>((set, get) => ({
  config: null,
  messages: [],
  meta: null,
  statuses: defaultStatuses,
  handRaised: false,
  paused: false,
  loading: false,
  error: null,

  initializeDebate: async (config) => {
    set({ config, messages: [], loading: true, error: null, handRaised: false, paused: false, statuses: defaultStatuses });
    try {
      const result = await postTurn({ config, messages: [], handRaised: false, bootstrap: true });
      set({
        messages: result.generated,
        meta: result.meta,
        loading: false,
        statuses: deriveStatuses(result.generated, false)
      });
      return true;
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : 'Unknown error' });
      return false;
    }
  },

  advanceDebate: async () => {
    const state = get();
    if (!state.config || state.paused || state.loading || state.messages.length >= MAX_DEBATE_MESSAGES) return;

    set({ loading: true, error: null });
    try {
      const result = await postTurn({
        config: state.config,
        messages: state.messages,
        handRaised: state.handRaised
      });

      const nextMessages = [...state.messages, ...result.generated];
      const hasHumanMessage = result.generated.some((m) => m.speakerId === 'human');

      set({
        loading: false,
        messages: nextMessages,
        meta: result.meta,
        handRaised: hasHumanMessage ? false : state.handRaised,
        statuses: deriveStatuses(nextMessages, hasHumanMessage ? false : state.handRaised)
      });
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  },

  raiseHand: () => set({ handRaised: true }),
  clearHand: () => set({ handRaised: false }),
  togglePause: () => set((s) => ({ paused: !s.paused })),
  resetDebate: () =>
    set({ messages: [], meta: null, handRaised: false, paused: false, statuses: defaultStatuses, error: null, loading: false })
}));
