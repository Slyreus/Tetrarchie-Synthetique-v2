'use client';

import { useEffect, useMemo, useRef } from 'react';
import { PERSONAS } from '@/data/personas';
import { MessageBubble } from '@/components/debate/message-bubble';
import { useDebateStore } from '@/store/debate-store';

export function DebateStream() {
  const { messages } = useDebateStore();
  const endRef = useRef<HTMLDivElement | null>(null);

  const personasMap = useMemo(
    () => Object.fromEntries(PERSONAS.map((p) => [p.id, p])),
    []
  );

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className="panel h-[58vh] overflow-y-auto p-4 md:h-[72vh]">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          persona={message.speakerId !== 'human' ? personasMap[message.speakerId] : undefined}
        />
      ))}
      <div ref={endRef} />
    </div>
  );
}
