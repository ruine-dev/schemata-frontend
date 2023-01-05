import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Check, Pencil, Trash } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FocusLock, { AutoFocusInside } from 'react-focus-lock';
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
import { ContextMenu } from './ContextMenu';
import { EditorStateContext } from '@/contexts/EditorStateContext';

interface TableHeaderProps {
  table: TableType;
}

export function TableHeader({ table }: TableHeaderProps) {
  const { copyPasteService, undoableService } = useContext(EditorStateContext);

  const reactFlowInstance = useReactFlow();
  const createTable = useCreateTable();
  const updateTable = useUpdateTable();
  const deleteTable = useDeleteTable();
  const createColumn = useCreateColumn();

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

    const position = reactFlowInstance.project({
      x: (rect?.x ?? 0) + (rect?.width ?? 0),
      y: rect?.y ?? 0,
    });

    createTable(
      {
        ...tableWithoutId,
        columns: tableWithoutId.columns.map((column) => ({ ...column, id: crypto.randomUUID() })),
        indexes: tableWithoutId.indexes.map((index) => ({ ...index, id: crypto.randomUUID() })),
      },
      position,
    );

    undoableService.updateData();
  };

  const triggerCopy = useCallback(() => {
    copyPasteService.send({
      type: 'COPY',
      data: {
        type: 'TABLE',
        payload: table,
      },
    });
  }, [copyPasteService, table]);

  const triggerCut = useCallback(() => {
    copyPasteService.send({
      type: 'CUT',
      data: {
        type: 'TABLE',
        payload: table,
      },
      reactFlowInstance,
    });
  }, [copyPasteService, reactFlowInstance, table]);

  const triggerCreateColumn = () => {
    createColumn({
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
    <ContextMenu
      disabled={isRenaming}
      menu={[
        {
          label: 'Rename',
          'data-test': 'table-header-context-menu-rename',
          onClick: triggerRename,
        },
        {
          label: 'Cut',
          'data-test': 'table-header-context-menu-cut',
          onClick: triggerCut,
        },
        {
          label: 'Copy',
          'data-test': 'table-header-context-menu-copy',
          onClick: triggerCopy,
        },
        {
          label: 'Add field',
          'data-test': 'table-header-context-menu-add-field',
          onClick: triggerCreateColumn,
        },
        {
          label: 'Delete',
          'data-test': 'table-header-context-menu-delete',
          onClick: triggerDelete,
        },
      ]}
    >
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
              triggerCreateColumn();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              e.stopPropagation();
              e.currentTarget.blur();
            } else if (e.ctrlKey && e.key === 'd') {
              e.preventDefault();
              e.stopPropagation();
              triggerDuplicate();
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
        )}
      </div>
    </ContextMenu>
  );
}
