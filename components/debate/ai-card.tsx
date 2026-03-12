'use client';

import { motion } from 'framer-motion';
import { Persona } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AICardProps {
  persona: Persona;
  state: string;
  intensity: number;
  active: boolean;
}

export function AICard({ persona, state, intensity, active }: AICardProps) {
  return (
    <motion.div
      animate={{ scale: active ? 1.01 : 1, opacity: active ? 1 : 0.88 }}
      className={cn('panel p-4', active && 'shadow-glow')}
      style={{ boxShadow: active ? `0 0 30px ${persona.glow}` : undefined }}
    >
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-base font-semibold" style={{ color: persona.color }}>
            {persona.name}
          </p>
          <p className="text-xs text-slate-300">{persona.role}</p>
        </div>
        <span className="badge">{state}</span>
      </div>
      <p className="mb-2 text-xs text-slate-400">Objectif: {persona.absoluteGoal}</p>
      <div className="h-2 rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          initial={false}
          animate={{ width: `${intensity}%` }}
          style={{ background: `linear-gradient(90deg, ${persona.color}, ${persona.accent})` }}
        />
      </div>
    </motion.div>
  );
}
