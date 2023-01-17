import { clsx } from '@/utils/clsx';
import { ReactNode } from 'react';

type EditorPanelContainerProps = {
  children: ReactNode;
  className?: string;
};

export function EditorPanelContainer({ children, className }: EditorPanelContainerProps) {
  return (
    <div
      className={clsx(
        'h-12 rounded-lg border border-slate-200 bg-white/80 py-2.5 px-3 shadow-sm',
        className,
      )}
    >
      {children}
    </div>
  );
}
