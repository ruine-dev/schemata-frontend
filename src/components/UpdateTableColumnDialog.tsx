import { useUpdateColumn } from '@/flow-hooks/useUpdateColumn';
import { ColumnType, ColumnTypeEnum } from '@/schemas/column';
import { TableType } from '@/schemas/table';
import { UpdateColumnType, UpdateColumnSchema } from '@/schemas/update-column';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReactNode, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { BaseDialog } from './BaseDialog';
import { Button } from './Button';
import { Select } from './Select';
import { Textbox } from './Textbox';

type UpdateTableColumnDialogProps = {
  tableId: TableType['id'];
  column: ColumnType;
  trigger: ReactNode;
};

export function UpdateTableColumnDialog({
  tableId,
  column,
  trigger,
}: UpdateTableColumnDialogProps) {
  const updateTableColumn = useUpdateColumn();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<UpdateColumnType>({
    resolver: zodResolver(UpdateColumnSchema),
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
          options={ColumnTypeEnum.options.map((type) => ({
            label: type,
            value: type,
          }))}
          placeholder="Choose type"
          disabled={isSubmitting}
          required
        />
        <Button type="submit" loading={isSubmitting} disabled={!isDirty} className="ml-auto">
          Update
        </Button>
      </form>
    </BaseDialog>
  );
}
