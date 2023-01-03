import { useEffect, useRef, useState } from 'react';
import { Check, Pencil, Trash } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FocusLock, { AutoFocusInside } from 'react-focus-lock';
import * as ContextMenu from '@radix-ui/react-context-menu';
import { IconButton } from './IconButton';
import { useUpdateTable } from '@/flow-hooks/useUpdateTable';
import { useDeleteTable } from '@/flow-hooks/useDeleteTable';
import { clsx } from '@/utils/clsx';
import { Textbox } from './Textbox';
import { useCreateColumn } from '@/flow-hooks/useCreateColumn';
import { TableSchema, TableType } from '@/schemas/base';
import { emptyVarcharColumn } from '@/utils/reactflow';
import { handleFocusLockChildrenBlur } from '@/utils/focus-lock';
import { useCreateTable } from '@/flow-hooks/useCreateTable';
import { useReactFlow } from 'reactflow';

interface TableHeaderProps {
  table: TableType;
  onDataChange?: () => void;
}

export function TableHeader({ table, onDataChange }: TableHeaderProps) {
  const { project } = useReactFlow();
  const createTable = useCreateTable(onDataChange);
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

  const [isHeaderFocused, setIsHeaderFocused] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    updateTable(data);
    setIsRenaming(false);

    queueMicrotask(() => containerRef.current?.focus());
  });

  const triggerRename = () => {
    setIsRenaming(true);
  };

  const triggerDelete = () => {
    deleteTable(table.id);
  };

  const triggerDuplicate = () => {
    const { id, ...tableWithoutId } = table;

    const rect = containerRef.current?.getBoundingClientRect();

    const position = project({
      x: (rect?.x ?? 0) + (rect?.width ?? 0),
      y: rect?.y ?? 0,
    });

    createTable(tableWithoutId, position);
  };

  const triggerAddColumn = () => {
    addColumn({
      ...emptyVarcharColumn(),
      tableId: table.id,
    });
  };

  // Automatically focus after creation
  useEffect(() => {
    if (table.name === '') {
      triggerRename();

      setTimeout(() => setFocus('name'), 1);
    }
  }, []);

  useEffect(() => {
    reset(table);
  }, [reset, table.id, table.name, table.columns, table.indexes]);

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
            triggerRename();
          } else if (e.key === 'Delete') {
            e.preventDefault();
            e.stopPropagation();
            triggerDelete();
          } else if (e.shiftKey && e.key === 'Enter') {
            triggerAddColumn();
          } else if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.blur();
          }
        }
      }}
      onFocus={() => setIsHeaderFocused(true)}
      onBlur={() => setIsHeaderFocused(false)}
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
            <AutoFocusInside>
              <Textbox
                {...register('name')}
                label="Name"
                srOnlyLabel
                disabled={isSubmitting}
                data-test="table-name-input"
                className="nodrag"
              />
            </AutoFocusInside>
            <IconButton
              icon={Check}
              iconProps={{ weight: 'bold' }}
              severity="dark"
              label="Save (ENTER)"
              type="submit"
              data-test="submit-table"
              className="ml-2 focus:bg-sky-600 enabled:hover:bg-sky-600"
            />
          </form>
        </FocusLock>
      ) : (
        <ContextMenu.Root>
          <ContextMenu.Trigger asChild>
            <div className="flex items-center justify-between">
              <div data-test="table-name" className="flex items-center gap-x-2 text-white">
                {table.name}
              </div>
              <div className={clsx('invisible flex items-center gap-x-1', 'group-hover:visible')}>
                <IconButton
                  icon={Pencil}
                  label={`Rename${isHeaderFocused ? ' (E)' : ''}`}
                  severity="dark"
                  onClick={triggerRename}
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
                  label={`Delete${isHeaderFocused ? ' (DEL)' : ''}`}
                  severity="dark"
                  onClick={triggerDelete}
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
          </ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content asChild>
              <div
                onKeyDown={(e) => e.stopPropagation()}
                data-test="table-header-context-menu"
                className="w-52 overflow-hidden rounded-xl border border-slate-300/70 bg-white/70 shadow backdrop-blur-lg"
              >
                <ContextMenu.Item asChild>
                  <button
                    onClick={triggerRename}
                    data-test="table-header-context-menu-rename"
                    className="w-full py-2 px-3 text-left text-slate-700 backdrop-blur-xl hover:bg-slate-100/70"
                  >
                    Rename
                  </button>
                </ContextMenu.Item>
                <ContextMenu.Item asChild>
                  <button
                    onClick={triggerDuplicate}
                    data-test="table-header-context-menu-duplicate"
                    className="w-full py-2 px-3 text-left text-slate-700 backdrop-blur-xl hover:bg-slate-100/70"
                  >
                    Duplicate
                  </button>
                </ContextMenu.Item>
                <ContextMenu.Item asChild>
                  <button
                    onClick={triggerAddColumn}
                    data-test="table-header-context-menu-add-field"
                    className="w-full py-2 px-3 text-left text-slate-700 backdrop-blur-xl hover:bg-slate-100/70"
                  >
                    Add field
                  </button>
                </ContextMenu.Item>
                <ContextMenu.Item asChild>
                  <button
                    onClick={triggerDelete}
                    data-test="table-header-context-menu-delete"
                    className="w-full py-2 px-3 text-left text-slate-700 backdrop-blur-xl hover:bg-slate-100/70"
                  >
                    Delete
                  </button>
                </ContextMenu.Item>
              </div>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>
      )}
    </div>
  );
}
