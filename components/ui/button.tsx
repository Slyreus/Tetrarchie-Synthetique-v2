import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
}

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-xl px-4 py-2 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' && 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:scale-[1.01]',
        variant === 'ghost' && 'border border-white/20 bg-white/5 text-slate-100 hover:bg-white/10',
        variant === 'danger' && 'bg-rose-500/80 text-white hover:bg-rose-500',
        className
      )}
      {...props}
    />
  );
}
