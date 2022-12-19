import { Key, Pencil, Trash } from 'phosphor-react';
import { IconButton } from './IconButton';
import { TableColumnProps, TableColumnTypeEnum } from '@/schemas/table';
import { clsx } from '@/utils/clsx';
import { useEffect, useState } from 'react';
import { Textbox } from './Textbox';
import {
  UpdateTableColumnSchema,
  UpdateTableColumnSchemaType,
  useUpdateTableColumn,
} from '@/flow-hooks/useUpdateTableColumn';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select } from './Select';
import { useValidateUniqueTableColumn } from '@/flow-hooks/useValidateUniqueTableColumn';
import { useDeleteTableColumn } from '@/flow-hooks/useDeleteTableColumn';
import FocusTrap from 'focus-trap-react';

type TableColumnFinalProps = { column: TableColumnProps } & {
  tableId: string;
  className?: string;
};

export function TableColumn({ column, tableId, className }: TableColumnFinalProps) {
  const isForeignKey = false;

  const [isEditing, setIsEditing] = useState(false);

  const updateTableColumn = useUpdateTableColumn();
  const deleteTableColumn = useDeleteTableColumn();
  const validateUniqueTableColumn = useValidateUniqueTableColumn();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<UpdateTableColumnSchemaType>({
    resolver: zodResolver(UpdateTableColumnSchema),
    defaultValues: { ...column, tableId },
  });

  const onSubmit = handleSubmit((data) => {
    let name = data.name;

    if (column.name === '' && name === '') {
      name = 'untitled';
    } else if (column.name !== '' && name === '') {
      name = column.name;
    }

    updateTableColumn({ ...data, name });
    setIsEditing(false);
  });

  useEffect(() => {
    // Automatically focus after creation
    if (column.name === '') {
      setIsEditing(true);
    }
  }, []);

  useEffect(() => {
    reset({ ...column, tableId });
  }, [reset, column, tableId]);

  return (
    <div
      tabIndex={0}
      onKeyDown={(e) => {
        if (!isEditing) {
          if (e.key === 'e') {
            e.preventDefault();
            e.stopPropagation();
            setIsEditing(true);
          } else if (e.key === 'Delete') {
            e.preventDefault();
            e.stopPropagation();
            deleteTableColumn({
              id: column.id,
              tableId,
            });
          }
        }
      }}
      className={clsx(
        'group flex items-center gap-x-2 py-0.5 pl-3 pr-1.5 outline-none ring-sky-500',
        'hover:bg-slate-100',
        'focus:ring-2',
        className,
      )}
    >
      {isEditing ? (
        <FocusTrap>
          <form onSubmit={onSubmit} className="flex items-center gap-x-2">
            <Textbox
              label="Name"
              {...register('name', {
                validate: {
                  unique: (value) => {
                    return (
                      validateUniqueTableColumn({ name: value, tableId }) || 'should be unique'
                    );
                  },
                },
              })}
              srOnlyLabel
              size="small"
              disabled={isSubmitting}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.preventDefault();
                  e.stopPropagation();
                  onSubmit();
                }
              }}
              autoFocus
              required
              className="w-32"
            />
            <Select
              label="Type"
              {...register('type')}
              options={TableColumnTypeEnum.options.map((type) => ({ label: type, value: type }))}
              srOnlyLabel
              size="small"
              disabled={isSubmitting}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.preventDefault();
                  e.stopPropagation();
                  onSubmit();
                }
              }}
              required
              className="w-32"
            />
            <button type="submit" className="invisible">
              Save
            </button>
          </form>
        </FocusTrap>
      ) : (
        <>
          <span className="h-4 w-4">
            {(column.isPrimaryKey || isForeignKey) && (
              <Key
                weight="fill"
                className={clsx('h-4 w-4', {
                  'text-yellow-400': column.isPrimaryKey,
                  'text-slate-400': isForeignKey,
                })}
              />
            )}
          </span>
          <span className="text-slate-700">{column.name}</span>
          <span className="text-slate-500">{column.type}</span>
          <div className="ml-auto flex opacity-0 focus-within:opacity-100 group-hover:opacity-100 group-focus:opacity-100">
            <IconButton
              label="Edit column"
              icon={Pencil}
              onClick={() => setIsEditing(true)}
              className="nodrag group-hover:focus:bg-slate-200 group-hover:active:bg-slate-200 group-hover:enabled:hover:bg-slate-200"
            />
            <IconButton
              label="Delete column"
              icon={Trash}
              severity="danger"
              onClick={() =>
                deleteTableColumn({
                  id: column.id,
                  tableId,
                })
              }
              className="nodrag group-hover:focus:bg-slate-200 group-hover:active:bg-slate-200 group-hover:enabled:hover:bg-slate-200"
            />
          </div>
        </>
      )}
    </div>
  );
}
