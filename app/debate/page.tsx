'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { DebateBoard } from '@/components/debate/debate-board';
import { useDebateStore } from '@/store/debate-store';

export default function DebatePage() {
  const router = useRouter();
  const { config, loading, messages, error } = useDebateStore();

  useEffect(() => {
    if (!config) router.replace('/create');
  }, [config, router]);

  if (!config) {
    return (
      <AppShell>
        <div className="panel p-6 text-center">
          <p className="text-slate-300">Salon non initialisé.</p>
          <Link href="/create" className="mt-3 inline-block rounded-lg border border-white/20 px-3 py-2 text-sm">
            Créer un salon
          </Link>
        </div>
      </AppShell>
    );
  }

  if (loading && messages.length === 0) {
    return (
      <AppShell>
        <div className="panel p-6 text-center text-slate-300">Initialisation des 4 IA via OpenAI...</div>
      </AppShell>
    );
  }

  if (error && messages.length === 0) {
    return (
      <AppShell>
        <div className="panel p-6 text-center">
          <p className="text-rose-300">{error}</p>
          <p className="mt-2 text-xs text-slate-400">Vérifiez OPENAI_API_KEY dans les variables d’environnement privées GitHub.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <DebateBoard />
    </AppShell>
  );
}
