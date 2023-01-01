import * as RadixTooltip from '@radix-ui/react-tooltip';
import { ReactNode } from 'react';

interface TooltipProps {
  text: string;
  children: ReactNode;
  allowOpen?: boolean;
}

export function Tooltip({ text, children, allowOpen }: TooltipProps) {
  const isAllowOpen =
    allowOpen !== undefined ? (allowOpen === true ? undefined : false) : undefined;

  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root delayDuration={0} disableHoverableContent open={isAllowOpen}>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content className="rounded-md bg-black/70 py-1 px-2 text-sm text-white backdrop-blur-lg">
            {text}
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
