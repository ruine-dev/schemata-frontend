import { clsx } from '@/utils/clsx';
import { forwardRef, Ref } from 'react';
import ReactSelect, { GroupBase, Props, SelectInstance } from 'react-select';

type ComboboxOption = {
  label: string;
  value: string;
};

type ComboboxProps<
  Option extends ComboboxOption,
  isMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> = Props<Option, isMulti, Group> & {
  name: string;
  label: string;
  srOnlyLabel?: boolean;
};

function ComboboxComponent<
  Option extends ComboboxOption,
  isMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  { name, label, srOnlyLabel, id, className, ...props }: ComboboxProps<Option, isMulti, Group>,
  ref: Ref<SelectInstance<Option, isMulti, Group>>,
) {
  const elementId = id || name;

  return (
    <div className={clsx('flex flex-col gap-y-1', className)}>
      <label htmlFor={elementId} className={clsx('text-slate-700', { 'sr-only': srOnlyLabel })}>
        {label}
      </label>
      <ReactSelect
        ref={ref}
        name={name}
        id={elementId}
        menuPortalTarget={document.body}
        className={clsx('react-select-container', {
          'mt-2': !srOnlyLabel,
        })}
        classNamePrefix="react-select"
        {...props}
      />
    </div>
  );
}

export const Combobox = forwardRef(ComboboxComponent);
