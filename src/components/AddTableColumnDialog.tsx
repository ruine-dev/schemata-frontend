import {
  AddTableColumnSchema,
  AddTableColumnSchemaType,
  useAddTableColumn,
} from '@/flow-hooks/useAddTableColumn';
import { TableColumnTypeEnum, TableWithIdProps } from '@/schemas/table';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BaseDialog } from './BaseDialog';
import { Button } from './Button';
import { Checkbox } from './Checkbox';
import { Select } from './Select';
import { Textbox } from './Textbox';

interface AddTableColumnDialogProps {
  tableId: TableWithIdProps['id'];
  trigger: ReactNode;
}

export function AddTableColumnDialog({ tableId, trigger }: AddTableColumnDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const addTableColumn = useAddTableColumn();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<AddTableColumnSchemaType>({
    resolver: zodResolver(AddTableColumnSchema),
    defaultValues: {
      tableId,
    },
  });

  const onSubmit = handleSubmit((data) => {
    addTableColumn(data);
    reset();
    setIsOpen(false);
  });

  return (
    <BaseDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Add Field"
      trigger={trigger}
      onClose={() => reset()}
    >
      <form onSubmit={onSubmit} className="mt-3 flex flex-col gap-y-3">
        <Textbox
          {...register('name')}
          label="Name"
          placeholder="Enter name"
          disabled={isSubmitting}
          required
          className="min-w-[16rem]"
        />
        <Select
          {...register('type')}
          label="Type"
          options={TableColumnTypeEnum.options.map((type) => ({
            label: type,
            value: type,
          }))}
          placeholder="Choose type"
          disabled={isSubmitting}
          required
        />
        <Checkbox {...register('isPrimaryKey')} label="Primary key" />
        <Button type="submit" loading={isSubmitting} disabled={!isDirty} className="ml-auto">
          Add
        </Button>
      </form>
    </BaseDialog>
  );
}
