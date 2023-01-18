import { clsx } from '@/utils/clsx';
import { forwardRef, Ref } from 'react';
import CreatableSelect from 'react-select/creatable';
import {
  components,
  ControlProps,
  GroupBase,
  InputProps,
  OptionProps,
  Props,
  SelectInstance,
} from 'react-select';

type ComboboxOption = {
  label: string;
  value: string;
};

function Option<
  Option extends ComboboxOption,
  isMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({ data, ...props }: OptionProps<Option, isMulti, Group> & { 'data-test'?: string }) {
  return (
    <components.Option
      {...props}
      innerProps={{
        ...props.innerProps,
        // @ts-ignore
        'data-test': `${props.selectProps['data-test']}-${data.value}`,
      }}
    />
  );
}

function Control<
  Option extends ComboboxOption,
  isMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: ControlProps<Option, isMulti, Group> & { 'data-test'?: string }) {
  return (
    <components.Control
      {...props}
      // @ts-ignore
      innerProps={{ ...props.innerProps, 'data-test': props.selectProps['data-test'] }}
    />
  );
}

function Input<
  Option extends ComboboxOption,
  isMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: InputProps<Option, isMulti, Group> & { 'data-test'?: string }) {
  return (
    <components.Input
      {...props}
      // @ts-ignore
      data-test={`${props.selectProps['data-test']}-input`}
    />
  );
}

type CreatableComboboxProps<
  Option extends ComboboxOption,
  isMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> = Props<Option, isMulti, Group> & {
  name: string;
  label: string;
  srOnlyLabel?: boolean;
};

function CreatableComboboxComponent<
  Option extends ComboboxOption,
  isMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  {
    name,
    label,
    srOnlyLabel,
    id,
    className,
    ...props
  }: CreatableComboboxProps<Option, isMulti, Group>,
  ref: Ref<SelectInstance<Option, isMulti, Group>>,
) {
  const elementId = id || name;

  return (
    <div className={clsx('flex flex-col gap-y-1', className)}>
      <label
        htmlFor={elementId}
        className={clsx('text-sm font-medium text-slate-500', { 'sr-only': srOnlyLabel })}
      >
        {label}
      </label>
      <CreatableSelect
        ref={ref}
        components={{ Control, Option, Input }}
        name={name}
        inputId={elementId}
        menuPortalTarget={document.body}
        className={clsx('react-select-container')}
        classNamePrefix="react-select"
        {...props}
      />
    </div>
  );
}

export const CreatableCombobox = forwardRef(CreatableComboboxComponent);
