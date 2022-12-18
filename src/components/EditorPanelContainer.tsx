import { ReactNode } from 'react';

interface EditorPanelContainerProps {
  children: ReactNode;
}

export function EditorPanelContainer({ children }: EditorPanelContainerProps) {
  return (
    <div className="flex items-center rounded-xl border border-slate-300 bg-white/80 py-1 px-3 shadow backdrop-blur-lg">
      {children}
    </div>
  );
}
