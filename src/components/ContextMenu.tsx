import { clsx } from '@/utils/clsx';
import * as RadixContextMenu from '@radix-ui/react-context-menu';
import { ElementType, MouseEvent, ReactNode } from 'react';

interface ContextMenuProps {
  menu: {
    label: string;
    icon?: ElementType;
    onClick?: (event: MouseEvent) => void;
    disabled?: boolean;
    kbd?: string;
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
            className="min-w-[14rem] overflow-hidden rounded-lg border border-gray-300/50 bg-white/30 shadow-xl backdrop-blur"
          >
            {label && <RadixContextMenu.Label>{label}</RadixContextMenu.Label>}
            {menu.map(({ icon: Icon, ...item }, index) => (
              <RadixContextMenu.Item key={index} onClick={item.onClick} disabled={disabled} asChild>
                <div
                  data-test={item['data-test']}
                  className="flex w-full cursor-default items-center py-2 px-2.5 text-left backdrop-blur-xl hover:bg-slate-100/70"
                >
                  {!!Icon && <Icon aria-hidden className="h-5 w-5 text-slate-400" />}
                  <span
                    className={clsx('text-sm text-slate-900', { 'ml-2': !!Icon, 'ml-7': !Icon })}
                  >
                    {item.label}
                  </span>
                  {item.kbd && (
                    <kbd className="ml-auto rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-sans text-xs text-slate-900">
                      {item.kbd}
                    </kbd>
                  )}
                </div>
              </RadixContextMenu.Item>
            ))}
          </div>
        </RadixContextMenu.Content>
      </RadixContextMenu.Portal>
    </RadixContextMenu.Root>
  );
}
