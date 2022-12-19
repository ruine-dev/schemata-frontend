import { clsx } from '@/utils/clsx';
import { cva, VariantProps } from 'class-variance-authority';
import { forwardRef, Ref, SelectHTMLAttributes } from 'react';

const selectClass = cva(
  [
    'form-select w-full rounded-xl border-slate-400 shadow-sm',
    'focus:border-sky-500 focus:ring-sky-500',
    'disabled:cursor-not-allowed disabled:bg-slate-100',
  ],
  {
    variants: {
      size: {
        small: 'px-1.5 py-1',
        default: '',
      },
    },
  },
);

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'name' | 'size'> {
  name: string;
  label: string;
  options: {
    label: string;
    value: string;
  }[];
  placeholder?: string;
  srOnlyLabel?: boolean;
  size?: VariantProps<typeof selectClass>['size'];
}

function SelectComponent(
  {
    name,
    label,
    options,
    placeholder,
    srOnlyLabel,
    size = 'default',
    id,
    className,
    ...props
  }: SelectProps,
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
        className={selectClass({ size })}
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
