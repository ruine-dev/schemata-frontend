import { clsx } from '@/utils/clsx';
import { forwardRef, InputHTMLAttributes, Ref, SelectHTMLAttributes } from 'react';

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'name'> {
  name: string;
  label: string;
  options: {
    label: string;
    value: string;
  }[];
  placeholder?: string;
  srOnlyLabel?: boolean;
}

function SelectComponent(
  { name, label, options, placeholder, srOnlyLabel, id, className, ...props }: SelectProps,
  ref: Ref<HTMLSelectElement>,
) {
  const elementId = id ?? name;

  return (
    <div className={clsx('flex flex-col gap-y-1', className)}>
      <label htmlFor={elementId} className={clsx('text-slate-700', { 'sr-only': srOnlyLabel })}>
        {label}
      </label>
      <select
        name={name}
        id={elementId}
        className={clsx(
          'form-select w-full rounded-xl border-slate-400 shadow-sm',
          'focus:border-sky-500 focus:ring-sky-500',
          'disabled:cursor-not-allowed disabled:bg-slate-100',
        )}
        defaultValue=""
        {...props}
        ref={ref}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export const Select = forwardRef(SelectComponent);
