import { clsx } from '@/utils/clsx';
import { cva, VariantProps } from 'class-variance-authority';
import { forwardRef, InputHTMLAttributes, Ref } from 'react';

const textboxClass = cva(
  [
    'form-input w-full rounded-xl border-slate-400 shadow-sm',
    'focus:border-sky-500 focus:ring-sky-500',
    'disabled:cursor-not-allowed disabled:bg-slate-100',
  ],
  {
    variants: {
      size: {
        small: 'px-1.5 py-1 text-sm',
        default: '',
      },
    },
  },
);

interface TextboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'size'> {
  name: string;
  label: string;
  srOnlyLabel?: boolean;
  size?: VariantProps<typeof textboxClass>['size'];
}

function TextboxComponent(
  { name, label, srOnlyLabel, size = 'default', id, className, ...props }: TextboxProps,
  ref: Ref<HTMLInputElement>,
) {
  const elementId = id ?? name;

  return (
    <div className={clsx('flex flex-col gap-y-1', className)}>
      <label htmlFor={elementId} className={clsx('text-slate-700', { 'sr-only': srOnlyLabel })}>
        {label}
      </label>
      <input
        ref={ref}
        type="text"
        name={name}
        id={elementId}
        className={textboxClass({ size })}
        {...props}
      />
    </div>
  );
}

export const Textbox = forwardRef(TextboxComponent);
