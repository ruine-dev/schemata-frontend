import { clsx } from '@/utils/clsx';
import { ButtonHTMLAttributes, forwardRef, ReactNode, Ref } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
}

function ButtonComponent(
  { children, loading, className, disabled, ...props }: ButtonProps,
  ref: Ref<HTMLButtonElement>,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={clsx(
        'rounded-xl bg-sky-500 px-4 py-1.5 text-white shadow-sm outline-none ring-sky-500 ring-offset-2',
        'hover:bg-sky-600',
        'focus:ring-2',
        'disabled:bg-slate-100 disabled:text-slate-500',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export const Button = forwardRef(ButtonComponent);
