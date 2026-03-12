import { ReactNode } from 'react';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[1600px] px-4 pb-8 pt-4 md:px-6 lg:px-8">{children}</div>
  );
}
