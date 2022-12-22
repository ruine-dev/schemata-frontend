import { Check, Key, Pencil, Trash } from 'phosphor-react';
import { KeyboardEventHandler, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FocusTrap from 'focus-trap-react';
import { TableColumnProps, TableColumnTypeEnum } from '@/schemas/table';
import { IconButton } from './IconButton';
import { clsx } from '@/utils/clsx';
import { Textbox } from './Textbox';
import {
  UpdateTableColumnSchema,
  UpdateTableColumnSchemaType,
  useUpdateTableColumn,
} from '@/flow-hooks/useUpdateTableColumn';
import { Select } from './Select';
import { useValidateUniqueTableColumn } from '@/flow-hooks/useValidateUniqueTableColumn';
import { useDeleteTableColumn } from '@/flow-hooks/useDeleteTableColumn';
import { CustomCheckbox } from './CustomCheckbox';
import { useAddTableColumn } from '@/flow-hooks/useAddTableColumn';

type TableColumnFinalProps = {
  column: TableColumnProps;
  tableId: string;
  hideAction?: boolean;
  className?: string;
};

export function TableColumn({ column, tableId, hideAction, className }: TableColumnFinalProps) {
  const isForeignKey = false;

  const [isEditing, setIsEditing] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const updateTableColumn = useUpdateTableColumn();
  const deleteTableColumn = useDeleteTableColumn();
  const addTableColumn = useAddTableColumn();
  const validateUniqueTableColumn = useValidateUniqueTableColumn();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
    control,
  } = useForm<UpdateTableColumnSchemaType>({
    resolver: zodResolver(UpdateTableColumnSchema),
    defaultValues: { ...column, tableId },
  });

  const onSubmit = handleSubmit((data, event) => {
    let name = data.name;

    if (column.name === '' && name === '') {
      name = 'untitled';
    } else if (column.name !== '' && name === '') {
      name = column.name;
    }

    updateTableColumn({ ...data, name });
    setIsEditing(false);

    queueMicrotask(() => {
      containerRef.current?.focus();
    });
  });

  useEffect(() => {
    // Automatically edit after creation
    if (column.name === '') {
      setIsEditing(true);
    }
  }, []);

  useEffect(() => {
    reset({ ...column, tableId });
  }, [reset, column, tableId]);

  const handleKeyEscape: KeyboardEventHandler<HTMLElement> = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      onSubmit(e);
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={(e) => {
        if (!isEditing && e.target === e.currentTarget) {
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
          } else if (e.shiftKey && e.key === 'Enter') {
            addTableColumn({
              name: '',
              type: 'varchar',
              isPrimaryKey: false,
              tableId: tableId,
            });
          }
        }
      }}
      className={clsx(
        'group flex items-center gap-x-2 py-0.5 pl-3 pr-1.5 outline-none ring-sky-500',
        'hover:bg-slate-100',
        'focus:relative focus:z-10 focus:ring-2',
        className,
      )}
    >
      {isEditing ? (
        <FocusTrap>
          <form
            onSubmit={onSubmit}
            className="flex items-center gap-x-2"
            onKeyDown={handleKeyEscape}
          >
            <Controller
              control={control}
              name="isPrimaryKey"
              render={({ field: { name, onBlur, onChange, ref, value } }) => (
                <CustomCheckbox
                  ref={ref}
                  name={name}
                  checkedElement={<Key weight="fill" className="h-4 w-4 text-yellow-400" />}
                  uncheckedElement={<Key className="h-4 w-4 text-yellow-600" />}
                  onBlur={onBlur}
                  onChange={onChange}
                  checked={value}
                />
              )}
            />

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
              autoFocus
              className="w-32"
            />
            <Select
              label="Type"
              {...register('type')}
              options={TableColumnTypeEnum.options.map((type) => ({ label: type, value: type }))}
              srOnlyLabel
              size="small"
              disabled={isSubmitting}
              required
              className="w-32"
            />
            <IconButton
              icon={Check}
              iconProps={{ weight: 'bold' }}
              severity="primary"
              label="Save"
              type="submit"
            />
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
          <div
            className={clsx(
              'ml-auto flex opacity-0 focus-within:opacity-100 group-hover:opacity-100 group-focus:opacity-100',
              {
                invisible: hideAction,
              },
            )}
          >
            <IconButton
              label="Edit column"
              icon={Pencil}
              onClick={() => setIsEditing(true)}
              disabled={hideAction}
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
              disabled={hideAction}
              className="nodrag group-hover:focus:bg-slate-200 group-hover:active:bg-slate-200 group-hover:enabled:hover:bg-slate-200"
            />
          </div>
        </>
      )}
    </div>
  );
}
