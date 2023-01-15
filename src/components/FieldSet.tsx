import { clsx } from '@/utils/clsx';
import { ReactNode } from 'react';

type FieldSetProps = {
  label: ReactNode;
  children: ReactNode;
  className?: string;
};

export function FieldSet({ label, children, className }: FieldSetProps) {
  return (
    <fieldset className={clsx('rounded border border-gray-200 px-4 pt-2 pb-4', className)}>
      <legend className="text-sm font-medium uppercase tracking-wider text-slate-400">
        {label}
      </legend>
      {children}
    </fieldset>
  );
}
