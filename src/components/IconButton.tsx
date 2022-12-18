import { ElementType, forwardRef, Ref, ButtonHTMLAttributes } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { Tooltip } from './Tooltip';
import { clsx } from '@/utils/clsx';

const iconButtonIconClass = cva(null, {
  variants: {
    size: {
      normal: 'w-4 h-4',
      large: 'w-5 h-5',
    },
  },
});

const iconButtonClass = cva(['p-2 rounded-xl outline-none focus:ring-2'], {
  variants: {
    filled: {
      true: ['bg-white enabled:hover:bg-slate-100 enabled:active:bg-slate-200'],
    },
    severity: {
      normal: ['text-slate-500 ring-sky-500', 'hover:text-slate-600', 'disabled:text-slate-400'],
      dark: ['text-white ring-sky-500', 'hover:text-opacity-90', 'disabled:text-opacity-75'],
      primary: ['text-sky-500 ring-sky-500', 'hover:text-sky-600'],
      danger: ['text-red-500 ring-red-500', 'hover:text-red-600'],
    },
    loading: {
      true: ['cursor-progress'],
      false: ['disabled:cursor-not-allowed'],
    },
  },
});

interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'color'> {
  label: string;
  icon: ElementType;
  loading?: boolean;
  darkMode?: boolean;
  filled?: boolean;
  size?: VariantProps<typeof iconButtonIconClass>['size'];
  severity?: VariantProps<typeof iconButtonClass>['severity'];
}

function IconButtonComponent(
  {
    label,
    icon: Icon,
    className,
    loading,
    darkMode,
    filled = false,
    size = 'normal',
    severity = 'normal',
    ...props
  }: IconButtonProps,
  ref: Ref<HTMLButtonElement>,
) {
  return (
    <Tooltip text={label}>
      <div>
        <button
          ref={ref}
          className={clsx(iconButtonClass({ filled, severity, loading }), className)}
          {...props}
        >
          <Icon aria-hidden className={iconButtonIconClass({ size })} />
          <span className="sr-only">{label}</span>
        </button>
      </div>
    </Tooltip>
  );
}

export const IconButton = forwardRef(IconButtonComponent);
