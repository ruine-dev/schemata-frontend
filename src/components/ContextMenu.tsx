import { clsx } from '@/utils/clsx';
import * as RadixContextMenu from '@radix-ui/react-context-menu';
import { ElementType, MouseEvent, ReactNode } from 'react';
import { Kbd } from './Kbd';
import { Menu } from './Menu';

type ContextMenuProps = {
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
};

export function ContextMenu({ menu, children, label, disabled }: ContextMenuProps) {
  return (
    <RadixContextMenu.Root>
      <RadixContextMenu.Trigger disabled={disabled} asChild>
        {children}
      </RadixContextMenu.Trigger>

      <RadixContextMenu.Portal>
        <RadixContextMenu.Content asChild>
          <Menu.Content onKeyDown={(e) => e.stopPropagation()}>
            {label && <RadixContextMenu.Label>{label}</RadixContextMenu.Label>}
            {menu.map((item, index) => (
              <RadixContextMenu.Item key={index} onClick={item.onClick} disabled={disabled} asChild>
                <Menu.Item icon={item.icon} kbd={item.kbd} data-test={item['data-test']}>
                  {item.label}
                </Menu.Item>
              </RadixContextMenu.Item>
            ))}
          </Menu.Content>
        </RadixContextMenu.Content>
      </RadixContextMenu.Portal>
    </RadixContextMenu.Root>
  );
}
