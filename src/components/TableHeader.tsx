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
import { useAddTableColumn } from '@/flow-hooks/useAddTableColumn';
import { TableSchema, TableType } from '@/schemas/base';
import { emptyVarcharColumn } from '@/utils/reactflow';

interface TableHeaderProps {
  table: TableType;
}

export function TableHeader({ table }: TableHeaderProps) {
  const updateTable = useUpdateTable();
  const deleteTable = useDeleteTable();
  const addTableColumn = useAddTableColumn();

  const containerRef = useRef<HTMLDivElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
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
    }
  }, []);

  useEffect(() => {
    reset(table);
  }, [reset, table]);

  const handleRename = () => {
    setIsRenaming(true);
  };

  return (
    <div
      ref={containerRef}
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
            addTableColumn({
              ...emptyVarcharColumn(),
              tableId: table.id,
            });
          }
        }
      }}
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
              autoFocus
              className="nodrag"
            />
            <IconButton
              icon={Check}
              iconProps={{ weight: 'bold' }}
              severity="dark"
              label="Save"
              type="submit"
              className="ml-2 focus:bg-sky-600 enabled:hover:bg-sky-600"
            />
          </form>
        </FocusLock>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2 text-white">{table.name}</div>
          <div
            className={clsx(
              'flex items-center gap-x-1 opacity-0',
              'group-hover:opacity-100',
              'group-focus:opacity-100',
              'focus-within:opacity-100',
            )}
          >
            <IconButton
              icon={Pencil}
              label="Rename"
              severity="dark"
              onClick={handleRename}
              className="ml-2 focus:bg-sky-600 enabled:hover:bg-sky-600"
            />
            <IconButton
              icon={Trash}
              label="Delete"
              severity="dark"
              onClick={() => deleteTable(table.id)}
              className="focus:bg-sky-600 enabled:hover:bg-sky-600"
            />
          </div>
        </div>
      )}
    </div>
  );
}
