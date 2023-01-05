import * as RadixContextMenu from '@radix-ui/react-context-menu';
import { MouseEvent, ReactNode } from 'react';

interface ContextMenuProps {
  menu: {
    label: string;
    onClick?: (event: MouseEvent) => void;
    disabled?: boolean;
    'data-test'?: string;
  }[];
  children: ReactNode;
  label?: string;
  disabled?: boolean;
}

export function ContextMenu({ menu, children, label, disabled }: ContextMenuProps) {
  return (
    <RadixContextMenu.Root>
      <RadixContextMenu.Trigger disabled={disabled} asChild>
        {children}
      </RadixContextMenu.Trigger>

      <RadixContextMenu.Portal>
        <RadixContextMenu.Content asChild>
          <div
            onKeyDown={(e) => e.stopPropagation()}
            className="w-52 overflow-hidden rounded-xl border border-slate-300/70 bg-white/70 shadow backdrop-blur-lg"
          >
            {label && <RadixContextMenu.Label>{label}</RadixContextMenu.Label>}
            {menu.map((item, index) => (
              <RadixContextMenu.Item key={index} onClick={item.onClick} disabled={disabled} asChild>
                <div
                  data-test={item['data-test']}
                  className="w-full cursor-default py-2 px-3 text-left text-slate-700 backdrop-blur-xl hover:bg-slate-100/70"
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
