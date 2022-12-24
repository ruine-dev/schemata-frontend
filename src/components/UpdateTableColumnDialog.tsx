import {
  UpdateTableColumnSchema,
  UpdateTableColumnSchemaType,
  useUpdateTableColumn,
} from '@/flow-hooks/useUpdateTableColumn';
import { TableColumnTypeEnum, TableWithIdProps } from '@/schemas/table';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReactNode, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { BaseDialog } from './BaseDialog';
import { Button } from './Button';
import { Checkbox } from './Checkbox';
import { Select } from './Select';
import { Textbox } from './Textbox';

interface UpdateTableColumnDialogProps {
  tableId: TableWithIdProps['id'];
  column: TableWithIdProps['columns'][number];
  trigger: ReactNode;
}

export function UpdateTableColumnDialog({
  tableId,
  column,
  trigger,
}: UpdateTableColumnDialogProps) {
  const updateTableColumn = useUpdateTableColumn();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<UpdateTableColumnSchemaType>({
    resolver: zodResolver(UpdateTableColumnSchema),
    defaultValues: { ...column, tableId },
  });

  const onSubmit = handleSubmit((data) => {
    updateTableColumn(data);
    reset();
  });

  useEffect(() => {
    reset({ ...column, tableId });
  }, [reset, column]);

  return (
    <BaseDialog title={`Edit Field ${column.name}`} trigger={trigger} onClose={() => reset()}>
      <form onSubmit={onSubmit} autoComplete="off" className="mt-3 flex flex-col gap-y-3">
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
        <Checkbox
          {...register('isPrimaryKey')}
          defaultChecked={column.isPrimaryKey}
          label="Primary key"
        />
        <Button type="submit" loading={isSubmitting} disabled={!isDirty} className="ml-auto">
          Update
        </Button>
      </form>
    </BaseDialog>
  );
}
