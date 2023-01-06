import { clsx } from '@/utils/clsx';
import { cva, VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, forwardRef, ReactNode, Ref } from 'react';

const buttonClass = cva(
  [
    'rounded bg-white h-7 px-3.5 text-slate-600 outline-offset-2 outline-sky-400',
    'enabled:hover:bg-gray-100',
    'disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: [''],
        outline: ['border-slate-200 shadow-sm'],
      },
    },
  },
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  variant?: VariantProps<typeof buttonClass>['variant'];
}

function ButtonComponent(
  { children, loading, variant = 'default', className, disabled, ...props }: ButtonProps,
  ref: Ref<HTMLButtonElement>,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={clsx(buttonClass({ variant }), className)}
      {...props}
    >
      {children}
    </button>
  );
}

export const Button = forwardRef(ButtonComponent);
