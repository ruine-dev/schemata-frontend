import { clsx } from '@/utils/clsx';
import { forwardRef, InputHTMLAttributes, Ref } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'type'> {
  name: string;
  label: string;
  srOnlyLabel?: boolean;
}

function CheckboxComponent(
  { name, label, srOnlyLabel, id, className, ...props }: CheckboxProps,
  ref: Ref<HTMLInputElement>,
) {
  const elementId = id ?? name;

  return (
    <div className={clsx('flex items-center gap-x-2.5', className)}>
      <label
        htmlFor={elementId}
        className={clsx('order-1 text-sm text-slate-600', { 'sr-only': srOnlyLabel })}
      >
        {label}
      </label>
      <input
        ref={ref}
        type="checkbox"
        name={name}
        id={elementId}
        className="form-checkbox h-5 w-5 rounded border-gray-300 text-sky-500 focus:outline focus:outline-2 focus:outline-sky-500 focus:ring-0 focus:ring-offset-0"
        {...props}
      />
    </div>
  );
}

export const Checkbox = forwardRef(CheckboxComponent);
