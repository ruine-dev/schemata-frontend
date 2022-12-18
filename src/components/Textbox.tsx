import { clsx } from '@/utils/clsx';
import { forwardRef, InputHTMLAttributes, Ref } from 'react';

interface TextboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> {
  name: string;
  label: string;
  srOnlyLabel?: boolean;
}

function TextboxComponent(
  { name, label, srOnlyLabel, id, className, ...props }: TextboxProps,
  ref: Ref<HTMLInputElement>,
) {
  const elementId = id ?? name;

  return (
    <div className={clsx('flex flex-col gap-y-1', className)}>
      <label htmlFor={elementId} className={clsx('text-slate-700', { 'sr-only': srOnlyLabel })}>
        {label}
      </label>
      <input
        type="text"
        name={name}
        id={elementId}
        className={clsx(
          'form-input w-full rounded-xl border-slate-400 shadow-sm',
          'focus:border-sky-500 focus:ring-sky-500',
          'disabled:cursor-not-allowed disabled:bg-slate-100',
        )}
        {...props}
        ref={ref}
      />
    </div>
  );
}

export const Textbox = forwardRef(TextboxComponent);
