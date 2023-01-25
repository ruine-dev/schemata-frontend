import { clsx } from '@/utils/clsx';
import { ReactNode } from 'react';

type KbdProps = {
  children: ReactNode;
  className?: string;
};

export function Kbd({ children, className }: KbdProps) {
  return (
    <kbd
      className={clsx(
        'rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-sans text-xs text-slate-900',
        className,
      )}
    >
      {children}
    </kbd>
  );
}
