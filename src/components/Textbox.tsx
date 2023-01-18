import { clsx } from '@/utils/clsx';
import { cva } from 'class-variance-authority';
import { forwardRef, InputHTMLAttributes, Ref } from 'react';

const textboxClass = cva(
  [
    'form-input w-full rounded-md border-slate-300 shadow-sm h-10 px-3',
    'disabled:cursor-not-allowed disabled:bg-slate-100',
  ],
  {
    variants: {
      validationState: {
        undetermined: 'focus:border-sky-400 focus:ring-sky-400',
        invalid: 'focus:border-red-400 focus:ring-red-400',
      },
    },
  },
);

type TextboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'size'> & {
  name: string;
  label: string;
  srOnlyLabel?: boolean;
  invalid?: boolean;
};

function TextboxComponent(
  { name, label, srOnlyLabel, invalid, id, className, ...props }: TextboxProps,
  ref: Ref<HTMLInputElement>,
) {
  const elementId = id ?? name;

  return (
    <div className={clsx('flex flex-col gap-y-1', className)}>
      <label
        htmlFor={elementId}
        className={clsx('text-sm font-medium text-slate-500', { 'sr-only': srOnlyLabel })}
      >
        {label}
      </label>
      <input
        ref={ref}
        type="text"
        name={name}
        id={elementId}
        className={textboxClass({ validationState: invalid ? 'invalid' : 'undetermined' })}
        {...props}
      />
    </div>
  );
}

export const Textbox = forwardRef(TextboxComponent);
