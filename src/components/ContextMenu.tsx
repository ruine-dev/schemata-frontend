import * as RadixContextMenu from '@radix-ui/react-context-menu';
import { ReactNode } from 'react';

interface ContextMenuProps {
  menu: {
    label: string;
    onClick?: () => void;
  }[];
  children: ReactNode;
  label?: string;
}

export function ContextMenu({ menu, children, label }: ContextMenuProps) {
  return (
    <RadixContextMenu.Root>
      <RadixContextMenu.Trigger asChild>{children}</RadixContextMenu.Trigger>

      <RadixContextMenu.Portal>
        <RadixContextMenu.Content asChild>
          <div className="min-w-[12rem] overflow-hidden rounded-xl border border-slate-300 bg-white/80 shadow backdrop-blur-xl">
            {label && <RadixContextMenu.Label>{label}</RadixContextMenu.Label>}
            {menu.map((item) => (
              <RadixContextMenu.Item asChild>
                <div
                  onClick={item.onClick}
                  className="cursor-default px-3 py-2 text-slate-800 hover:bg-slate-100/80"
                >
                  {item.label}
                </div>
              </RadixContextMenu.Item>
            ))}
          </div>
        </RadixContextMenu.Content>
      </RadixContextMenu.Portal>
    </RadixContextMenu.Root>
  );
}
