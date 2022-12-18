import { clsx } from '@/utils/clsx';
import { forwardRef, InputHTMLAttributes, Ref } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'type'> {
  name: string;
  label: string;
  srOnlyLabel?: boolean;
}

function CheckboxComponent(
  { name, label, srOnlyLabel, id, ...props }: CheckboxProps,
  ref: Ref<HTMLInputElement>,
) {
  const elementId = id ?? name;

  return (
    <div className="flex items-center gap-x-2">
      <label
        htmlFor={elementId}
        className={clsx('order-1 text-slate-700', { 'sr-only': srOnlyLabel })}
      >
        {label}
      </label>
      <input
        ref={ref}
        type="checkbox"
        name={name}
        id={elementId}
        className="form-checkbox h-5 w-5 rounded-md text-sky-500 focus:ring-sky-500"
        {...props}
      />
    </div>
  );
}

export const Checkbox = forwardRef(CheckboxComponent);
