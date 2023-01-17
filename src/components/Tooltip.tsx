import { clsx } from '@/utils/clsx';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { ReactNode } from 'react';

type TooltipProps = {
  text: string;
  children: ReactNode;
  allowOpen?: boolean;
};

export function Tooltip({ text, children, allowOpen }: TooltipProps) {
  const isAllowOpen =
    allowOpen !== undefined ? (allowOpen === true ? undefined : false) : undefined;

  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root delayDuration={0} disableHoverableContent open={isAllowOpen}>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            className={clsx(
              'rounded border border-gray-700 bg-gray-900 py-2.5 px-3 text-xs text-white shadow-sm duration-500',
              'rdx-state-delayed-open:animate-in rdx-state-delayed-open:zoom-in-95',
            )}
          >
            {text}
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
