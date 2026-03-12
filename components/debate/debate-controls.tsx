'use client';

import { Hand, Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDebateStore } from '@/store/debate-store';

export function DebateControls() {
  const { handRaised, raiseHand, paused, togglePause, resetDebate, advanceDebate, loading, error } = useDebateStore();

  return (
    <div className="panel flex flex-col gap-3 p-4">
      <Button onClick={raiseHand} disabled={handRaised || loading} className="w-full">
        <Hand className="mr-2 inline h-4 w-4" />
        {handRaised ? 'Intervention en attente' : 'Lever la main'}
      </Button>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="ghost" onClick={togglePause} disabled={loading}>
          {paused ? <Play className="mr-2 inline h-4 w-4" /> : <Pause className="mr-2 inline h-4 w-4" />}
          {paused ? 'Reprendre' : 'Pause'}
        </Button>
        <Button variant="ghost" onClick={() => void advanceDebate()} disabled={loading}>
          {loading ? 'En cours...' : 'Tour suivant'}
        </Button>
      </div>
      <Button variant="danger" onClick={resetDebate} disabled={loading}>
        <RotateCcw className="mr-2 inline h-4 w-4" />
        Réinitialiser
      </Button>
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}
