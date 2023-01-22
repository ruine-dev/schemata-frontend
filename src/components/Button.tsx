import { clsx } from '@/utils/clsx';
import { cva, VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, forwardRef, ReactNode, Ref } from 'react';

const buttonClass = cva(
  ['rounded h-7 px-3.5 outline-offset-4 outline-sky-400 border font-medium', 'disabled:opacity-50'],
  {
    variants: {
      variant: {
        default: ['bg-white border-transparent text-slate-600', 'enabled:hover:bg-gray-100'],
        outline: [
          'bg-white border-slate-200 shadow-sm text-slate-600',
          'enabled:hover:bg-gray-100',
        ],
        primary: ['border-sky-600 bg-sky-600 text-white', 'enabled:hover:bg-sky-700'],
      },
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  loading?: boolean;
  variant?: VariantProps<typeof buttonClass>['variant'];
};

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
