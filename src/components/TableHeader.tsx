import { useEffect, useRef } from 'react';
import { Check, Pencil, Trash } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import FocusLock from 'react-focus-lock';
import { IconButton } from './IconButton';
import { useUpdateTable } from '@/flow-hooks/useUpdateTable';
import { useDeleteTable } from '@/flow-hooks/useDeleteTable';
import { clsx } from '@/utils/clsx';
import { Textbox } from './Textbox';
import { useCreateColumn } from '@/flow-hooks/useCreateColumn';
import { TableSchema, TableType } from '@/schemas/base';
import { emptyVarcharColumn } from '@/utils/reactflow';
import { handleFocusLockChildrenBlur } from '@/utils/focus-lock';

interface TableHeaderProps {
  table: TableType;
  onDataChange?: () => void;
}

export function TableHeader({ table, onDataChange }: TableHeaderProps) {
  const updateTable = useUpdateTable(onDataChange);
  const deleteTable = useDeleteTable();
  const addColumn = useCreateColumn();

  const containerRef = useRef<HTMLDivElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
    setFocus,
  } = useForm<TableType>({
    resolver: zodResolver(TableSchema),
    defaultValues: table,
  });

  const [isRenaming, setIsRenaming] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    updateTable(data);
    setIsRenaming(false);

    queueMicrotask(() => containerRef.current?.focus());
  });

  // Automatically focus after creation
  useEffect(() => {
    if (table.name === '') {
      setIsRenaming(true);

      setTimeout(() => setFocus('name'), 1);
    }
  }, []);

  useEffect(() => {
    reset(table);
  }, [reset, table.id, table.name, table.columns, table.indexes]);

  const handleRename = () => {
    setIsRenaming(true);
  };

  return (
    <div
      ref={containerRef}
      id={`table-header-${table.id}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (!isRenaming && e.target === e.currentTarget) {
          if (e.key === 'e') {
            e.preventDefault();
            e.stopPropagation();
            setIsRenaming(true);
          } else if (e.key === 'Delete') {
            e.preventDefault();
            e.stopPropagation();
            deleteTable(table.id);
          } else if (e.shiftKey && e.key === 'Enter') {
            addColumn({
              ...emptyVarcharColumn(),
              tableId: table.id,
            });
          } else if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.blur();
          }
        }
      }}
      data-test="table-header"
      className={clsx(
        'group rounded-t-xl bg-sky-500 px-3 pb-1.5 pt-2 font-medium outline-none ring-sky-500 ring-offset-2',
        'focus:ring-2',
      )}
    >
      {isRenaming ? (
        <FocusLock>
          <form
            onSubmit={onSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                onSubmit();
              }
            }}
            onBlur={(e) => handleFocusLockChildrenBlur(e, onSubmit)}
            autoComplete="off"
            className="flex items-center justify-between"
          >
            <Textbox
              {...register('name', {
                setValueAs(value: string) {
                  return value.trim();
                },
              })}
              label="Name"
              size="small"
              srOnlyLabel
              disabled={isSubmitting}
              data-test="table-name-input"
              className="nodrag"
            />
            <IconButton
              icon={Check}
              iconProps={{ weight: 'bold' }}
              severity="dark"
              label="Save"
              type="submit"
              data-test="submit-table"
              className="ml-2 focus:bg-sky-600 enabled:hover:bg-sky-600"
            />
          </form>
        </FocusLock>
      ) : (
        <div className="flex items-center justify-between">
          <div data-test="table-name" className="flex items-center gap-x-2 text-white">
            {table.name}
          </div>
          <div className={clsx('invisible flex items-center gap-x-1', 'group-hover:visible')}>
            <IconButton
              icon={Pencil}
              label="Rename"
              severity="dark"
              onClick={handleRename}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.preventDefault();
                  e.stopPropagation();

                  containerRef.current?.focus();
                }
              }}
              data-test="rename-table-button"
              className="ml-2 focus:bg-sky-600 enabled:hover:bg-sky-600"
            />
            <IconButton
              icon={Trash}
              label="Delete"
              severity="dark"
              onClick={() => deleteTable(table.id)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.preventDefault();
                  e.stopPropagation();

                  containerRef.current?.focus();
                }
              }}
              data-test="delete-table-button"
              className="focus:bg-sky-600 enabled:hover:bg-sky-600"
            />
          </div>
        </div>
      )}
    </div>
  );
}
