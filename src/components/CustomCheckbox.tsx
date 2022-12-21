import * as Checkbox from '@radix-ui/react-checkbox';
import { ButtonHTMLAttributes, forwardRef, ReactNode, Ref, useRef, useState } from 'react';

type CustomCheckboxProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onChange'> & {
  name: string;
  checkedElement: ReactNode;
  uncheckedElement: ReactNode;
  indeterminateElement?: ReactNode;
  checked?: boolean;
  onChange?: (checked: 'indeterminate' | boolean) => void;
};

function CustomCheckboxComponent(
  {
    name,
    checkedElement,
    uncheckedElement,
    indeterminateElement,
    checked,
    onChange,
    id,
    ...props
  }: CustomCheckboxProps,
  ref: Ref<HTMLButtonElement>,
) {
  const elementId = id ?? name;

  const [checkboxState, setCheckboxState] = useState<'indeterminate' | boolean>(
    checked ?? 'indeterminate',
  );

  return (
    <Checkbox.Root
      ref={ref}
      id={elementId}
      name={name}
      checked={checkboxState}
      onCheckedChange={(checked) => {
        setCheckboxState(checked);
        onChange?.(checked);
      }}
      {...props}
      className="rounded-xl p-2 outline-none ring-sky-500 focus:ring-2"
    >
      <Checkbox.Indicator>
        {checkboxState === 'indeterminate' && (indeterminateElement || uncheckedElement)}
        {checkboxState === true && checkedElement}
      </Checkbox.Indicator>
      {checkboxState === false && uncheckedElement}
    </Checkbox.Root>
  );
}

export const CustomCheckbox = forwardRef(CustomCheckboxComponent);
