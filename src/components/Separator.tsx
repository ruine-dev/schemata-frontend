import { clsx } from '@/utils/clsx';
import * as RadixSeparator from '@radix-ui/react-separator';

type SeparatorProps = {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
};

export function Separator({ orientation, className }: SeparatorProps) {
  return (
    <RadixSeparator.Root
      orientation={orientation}
      className={clsx([
        'bg-gray-200',
        'rdx-orientation-horizontal:h-px rdx-orientation-horizontal:w-full',
        'rdx-orientation-vertical:h-full rdx-orientation-vertical:w-px',
        className,
      ])}
    />
  );
}
