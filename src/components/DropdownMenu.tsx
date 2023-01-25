import { ElementType, ReactNode } from 'react';
import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu';
import { Menu } from './Menu';

type DropdownMenuProps = {
  trigger: ReactNode;
  items: { label: ReactNode; icon?: ElementType; kbd?: string; onClick?: () => void }[];
};

export function DropdownMenu({ trigger, items }: DropdownMenuProps) {
  return (
    <RadixDropdownMenu.Root>
      <RadixDropdownMenu.Trigger asChild>{trigger}</RadixDropdownMenu.Trigger>
      <RadixDropdownMenu.Portal>
        <RadixDropdownMenu.Content asChild>
          <Menu.Content>
            {items.map((item, index) => (
              <RadixDropdownMenu.Item key={index} asChild>
                <Menu.Item icon={item.icon} kbd={item.kbd} onClick={item.onClick}>
                  {item.label}
                </Menu.Item>
              </RadixDropdownMenu.Item>
            ))}
          </Menu.Content>
        </RadixDropdownMenu.Content>
      </RadixDropdownMenu.Portal>
    </RadixDropdownMenu.Root>
  );
}
