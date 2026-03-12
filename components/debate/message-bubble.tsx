import { DebateMessage, Persona } from '@/lib/types';

interface MessageBubbleProps {
  message: DebateMessage;
  persona?: Persona;
}

export function MessageBubble({ message, persona }: MessageBubbleProps) {
  const isHuman = message.speakerId === 'human';
  return (
    <div className="mb-3 flex w-full">
      <div
        className="max-w-[92%] rounded-2xl border px-4 py-3 md:max-w-[80%]"
        style={{
          borderColor: isHuman ? 'rgba(255,255,255,0.3)' : `${persona?.accent ?? '#94a3b8'}66`,
          background: isHuman
            ? 'rgba(255,255,255,0.08)'
            : `linear-gradient(145deg, ${persona?.glow ?? 'rgba(148,163,184,0.2)'}, rgba(8,11,18,0.75))`
        }}
      >
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-300">{message.speakerName}</p>
        <p className="text-sm leading-relaxed text-slate-50">{message.content}</p>
      </div>
    </div>
  );
}
