import { KeyboardEventHandler, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FocusLock, { AutoFocusInside } from 'react-focus-lock';
import { clsx } from '@/utils/clsx';
import { Textbox } from './Textbox';
import { useUpdateColumn } from '@/flow-hooks/useUpdateColumn';
import { useValidateUniqueColumnName } from '@/flow-hooks/useValidateUniqueColumnName';
import { useDeleteColumn } from '@/flow-hooks/useDeleteColumn';
import { useCreateColumn } from '@/flow-hooks/useCreateColumn';
import { emptyVarcharColumn, getColumnIdFromHandleId } from '@/utils/reactflow';
import {
  ColumnType,
  ColumnTypeEnum,
  IndexType,
  UpdateColumnSchema,
  UpdateColumnType,
} from '@/schemas/base';
import { useStore } from 'reactflow';
import { handleFocusLockChildrenBlur } from '@/utils/focus-lock';
import { Combobox } from './Combobox';
import { ContextMenu } from './ContextMenu';
import { Button } from './Button';
import { Checkbox } from './Checkbox';
import {
  DocumentDuplicateIcon,
  KeyIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/20/solid';

type TableColumnFinalProps = {
  column: ColumnType;
  tableIndexes: IndexType[];
  tableId: string;
  hideAction?: boolean;
  className?: string;
};

export function TableColumn({
  column,
  tableIndexes,
  tableId,
  hideAction,
  className,
}: TableColumnFinalProps) {
  const [isColumnFocused, setIsColumnFocused] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const updateColumn = useUpdateColumn();
  const deleteColumn = useDeleteColumn();
  const createColumn = useCreateColumn();
  const validateUniqueColumnName = useValidateUniqueColumnName();

  const isPrimaryKey = !!tableIndexes.find(
    (index) => index.columns.includes(column.id) && index.type === 'PRIMARY_KEY',
  );

  const edges = useStore((state) => state.edges);

  const isForeignKey = !!edges.find(
    (edge) => edge.targetHandle && getColumnIdFromHandleId(edge.targetHandle) === column.id,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
    control,
  } = useForm<UpdateColumnType>({
    resolver: zodResolver(UpdateColumnSchema),
    defaultValues: { ...column, isPrimaryKey, tableId },
  });

  const onSubmit = handleSubmit((data) => {
    updateColumn(data);
    setIsEditing(false);

    queueMicrotask(() => {
      containerRef.current?.focus();
    });
  });

  useEffect(() => {
    // Automatically edit after creation
    if (column.name === '') {
      triggerEdit();
    }
  }, []);

  useEffect(() => {
    reset({ ...column, isPrimaryKey, tableId });
  }, [reset, column, tableId]);

  const handleKeyEscape: KeyboardEventHandler<HTMLElement> = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();

      onSubmit(e);
    }
  };

  const triggerDelete = () => {
    const parent = containerRef.current?.parentElement;
    const nearestColumnSibling =
      parent?.previousElementSibling?.lastElementChild ||
      parent?.nextElementSibling?.lastElementChild;

    deleteColumn({
      id: column.id,
      tableId,
    });

    if (nearestColumnSibling instanceof HTMLElement) {
      nearestColumnSibling.focus();
    }

    if (nearestColumnSibling === undefined) {
      document.getElementById(`table-header-${tableId}`)?.focus();
    }
  };

  const triggerEdit = () => {
    setIsEditing(true);
  };

  const triggerDuplicate = () => {
    createColumn({ ...column, tableId });
  };

  return (
    <ContextMenu
      disabled={isEditing}
      menu={[
        {
          label: 'Edit',
          'data-test': 'column-context-menu-edit',
          onClick: triggerEdit,
          icon: PencilSquareIcon,
          kbd: 'E',
        },
        {
          label: 'Duplicate',
          'data-test': 'column-context-menu-duplicate',
          onClick: triggerDuplicate,
          icon: DocumentDuplicateIcon,
        },
        {
          label: 'Delete',
          'data-test': 'column-context-menu-delete',
          onClick: triggerDelete,
          icon: TrashIcon,
          kbd: 'DEL',
        },
      ]}
    >
      <div
        ref={containerRef}
        tabIndex={0}
        onClick={(e) => e.stopPropagation()}
        onFocus={() => setIsColumnFocused(true)}
        onBlur={() => setIsColumnFocused(false)}
        onKeyDown={(e) => {
          if (!isEditing && e.target === e.currentTarget) {
            if (e.key === 'e') {
              e.preventDefault();
              e.stopPropagation();
              triggerEdit();
            } else if (e.key === 'Delete') {
              e.preventDefault();
              e.stopPropagation();

              triggerDelete();
            } else if (e.shiftKey && e.key === 'Enter') {
              e.preventDefault();
              e.stopPropagation();

              createColumn({ ...emptyVarcharColumn(), tableId });
            } else if (e.key === 'Escape') {
              e.preventDefault();
              e.stopPropagation();

              document.getElementById(`table-header-${tableId}`)?.focus();
            }
          }
        }}
        data-test="column"
        className={clsx(
          'group py-3 px-4 outline-2 outline-sky-500',
          'focus:relative focus:z-10 focus:rounded focus:outline',
          { 'hover:bg-slate-100': !isEditing },
          className,
        )}
      >
        {isEditing ? (
          <FocusLock>
            <form
              onSubmit={onSubmit}
              onKeyDown={handleKeyEscape}
              autoComplete="off"
              onBlur={(e) => handleFocusLockChildrenBlur(e, onSubmit)}
              className="nodrag"
            >
              <AutoFocusInside>
                <Textbox
                  label="Name"
                  {...register('name', {
                    validate: {
                      unique: (value) => {
                        return (
                          validateUniqueColumnName({ name: value, tableId }) || 'should be unique'
                        );
                      },
                    },
                  })}
                  disabled={isSubmitting}
                  data-test="column-name-textbox"
                />
              </AutoFocusInside>
              <Controller
                control={control}
                name="type"
                render={({ field: { name, onBlur, onChange, value, ref } }) => (
                  <Combobox
                    ref={ref}
                    label="Type"
                    name={name}
                    options={ColumnTypeEnum.options.map((type) => ({ label: type, value: type }))}
                    onBlur={onBlur}
                    onChange={(option) => {
                      if (option && 'value' in option) {
                        onChange(option.value);
                      }
                    }}
                    value={ColumnTypeEnum.options
                      .map((type) => ({ label: type, value: type }))
                      .find((option) => option.value === value)}
                    data-test="column-type-combobox"
                    className="mt-3"
                  />
                )}
              />
              <Checkbox
                {...register('isPrimaryKey')}
                label="Primary Key"
                data-test="column-primary-key-checkbox"
                className="mt-4"
              />
              <div className="mt-5 flex justify-end">
                <Button type="submit" variant="outline">
                  Save
                </Button>
              </div>
            </form>
          </FocusLock>
        ) : (
          <div className="flex items-center">
            <span className="h-4 w-4" data-test="column-key">
              {(isPrimaryKey || isForeignKey) && (
                <>
                  <KeyIcon
                    className={clsx('h-4 w-4', {
                      'text-yellow-400': isPrimaryKey,
                      'text-slate-400': isForeignKey && !isPrimaryKey,
                    })}
                    aria-hidden
                  />
                  <div className="sr-only">
                    {isPrimaryKey && 'Primary key'}
                    {isForeignKey && (isPrimaryKey ? 'and Foreign key' : 'Foreign key')}
                  </div>
                </>
              )}
            </span>
            <span className="ml-2 mr-4 font-medium text-slate-600" data-test="column-name">
              {column.name}
            </span>
            <span className="ml-auto font-medium text-sky-700" data-test="column-type">
              {column.type}
            </span>
          </div>
        )}
      </div>
    </ContextMenu>
  );
}
