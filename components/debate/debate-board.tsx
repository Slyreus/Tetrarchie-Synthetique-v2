'use client';

import { useEffect } from 'react';
import { PERSONAS } from '@/data/personas';
import { AICard } from '@/components/debate/ai-card';
import { DebateControls } from '@/components/debate/debate-controls';
import { DebateMetrics } from '@/components/debate/debate-metrics';
import { DebateStream } from '@/components/debate/debate-stream';
import { useDebateStore } from '@/store/debate-store';

export function DebateBoard() {
  const { config, statuses, meta, advanceDebate, paused, messages, loading } = useDebateStore();

  useEffect(() => {
    if (!config || paused) return;
    if (messages.length >= 30) return;

    const paceMultiplier = {
      Lent: 1.2,
      Normal: 1,
      Nerveux: 0.85
    } as const;
    const baseDelay = Math.max(3000, Math.min(6000, meta?.recommendedDelayMs ?? 3200));
    const nextDelay = Math.round(baseDelay * paceMultiplier[config.animationPace]);

    const timer = setTimeout(() => {
      void advanceDebate();
    }, nextDelay);

    return () => clearTimeout(timer);
  }, [advanceDebate, config, paused, meta?.recommendedDelayMs, messages.length]);

  return (
    <div className="grid gap-4 lg:grid-cols-[310px,1fr,330px]">
      <aside className="flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
        {PERSONAS.map((persona) => (
          <div key={persona.id} className="min-w-[220px] lg:min-w-0">
            <AICard
              persona={persona}
              state={statuses[persona.id] ?? 'attend'}
              intensity={30 + Math.round(Math.random() * 60)}
              active={meta?.activeSpeaker === persona.id}
            />
          </div>
        ))}
      </aside>

      <main className="space-y-3">
        <div className="panel flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Sujet</p>
            <h2 className="text-lg font-semibold text-slate-100">{config?.topic ?? 'Salon non initialisé'}</h2>
          </div>
          <span className="badge">{loading ? 'Génération...' : `${messages.length}/30 interventions`}</span>
        </div>
        <DebateStream />
      </main>

      <aside className="space-y-3">
        <DebateControls />
        <DebateMetrics meta={meta} />
      </aside>
    </div>
  );
}
