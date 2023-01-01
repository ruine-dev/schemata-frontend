import {
  ElementType,
  forwardRef,
  Ref,
  ButtonHTMLAttributes,
  ComponentPropsWithoutRef,
} from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { Tooltip } from './Tooltip';
import { clsx } from '@/utils/clsx';

const iconButtonIconClass = cva(null, {
  variants: {
    size: {
      small: 'w-4 h-4',
      medium: 'w-5 h-5',
    },
  },
});

const iconButtonClass = cva(['p-2 rounded-xl outline-none focus:ring-2'], {
  variants: {
    filled: {
      true: [
        'bg-white',
        'enabled:hover:bg-slate-100',
        'focus:bg-slate-100',
        'enabled:active:bg-slate-100',
      ],
    },
    severity: {
      normal: [
        'text-slate-500 ring-sky-500',
        'hover:text-slate-600',
        'enabled:active:text-slate-600',
        'focus:text-slate-600',
        'disabled:text-slate-400',
      ],
      dark: [
        'text-white ring-white',
        'hover:text-opacity-90',
        'enabled:active:text-opacity-90',
        'focus:text-opacity-90',
        'disabled:text-opacity-75',
      ],
      primary: [
        'text-sky-500 ring-sky-500',
        'hover:text-sky-600',
        'enabled:active:text-sky-600',
        'focus:text-sky-600',
      ],
      danger: [
        'text-red-500 ring-red-500',
        'hover:text-red-600',
        'enabled:active:text-red-600',
        'focus:text-red-600',
      ],
    },
    loading: {
      true: ['cursor-progress'],
      false: ['disabled:cursor-not-allowed'],
    },
  },
});

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'color'> & {
  label: string;
  icon: ElementType;
  iconProps?: ComponentPropsWithoutRef<ElementType>;
  darkMode?: boolean;
  loading?: boolean;
  filled?: boolean;
  size?: VariantProps<typeof iconButtonIconClass>['size'];
  severity?: VariantProps<typeof iconButtonClass>['severity'];
};

function IconButtonComponent(
  {
    label,
    icon: Icon,
    className,
    iconProps,
    darkMode,
    loading = false,
    filled = false,
    size = 'medium',
    severity = 'normal',
    ...props
  }: IconButtonProps,
  ref: Ref<HTMLButtonElement>,
) {
  return (
    <Tooltip text={label}>
      <button
        ref={ref}
        className={clsx(iconButtonClass({ filled, severity, loading }), className)}
        {...props}
      >
        <Icon aria-hidden {...iconProps} className={iconButtonIconClass({ size })} />
        <span className="sr-only">{label}</span>
      </button>
    </Tooltip>
  );
}

export const IconButton = forwardRef(IconButtonComponent);
