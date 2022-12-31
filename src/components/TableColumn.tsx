import { Check, Key, Pencil, Trash } from 'phosphor-react';
import { KeyboardEventHandler, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FocusLock from 'react-focus-lock';
import { IconButton } from './IconButton';
import { clsx } from '@/utils/clsx';
import { Textbox } from './Textbox';
import { useUpdateColumn } from '@/flow-hooks/useUpdateColumn';
import { Select } from './Select';
import { useValidateUniqueColumnName } from '@/flow-hooks/useValidateUniqueColumnName';
import { useDeleteColumn } from '@/flow-hooks/useDeleteColumn';
import { CustomCheckbox } from './CustomCheckbox';
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

type TableColumnFinalProps = {
  column: ColumnType;
  tableIndexes: IndexType[];
  tableId: string;
  onDataChange?: () => void;
  hideAction?: boolean;
  className?: string;
};

export function TableColumn({
  column,
  tableIndexes,
  tableId,
  onDataChange,
  hideAction,
  className,
}: TableColumnFinalProps) {
  const [isEditing, setIsEditing] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const updateColumn = useUpdateColumn(onDataChange);
  const deleteColumn = useDeleteColumn(onDataChange);
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
      setIsEditing(true);
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

  const handleDelete = () => {
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

            handleDelete();
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
        'group flex items-center gap-x-2 py-0.5 pl-3 pr-1.5 outline-none ring-sky-500',
        'hover:bg-slate-100',
        'focus:relative focus:z-10 focus:ring-2',
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
            className="flex items-center gap-x-2"
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
                    return validateUniqueColumnName({ name: value, tableId }) || 'should be unique';
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
              options={ColumnTypeEnum.options.map((type) => ({ label: type, value: type }))}
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
              data-test="submit-column"
            />
          </form>
        </FocusLock>
      ) : (
        <>
          <span className="h-4 w-4">
            {(isPrimaryKey || isForeignKey) && (
              <>
                <Key
                  weight="fill"
                  className={clsx('h-4 w-4', {
                    'text-yellow-400': isPrimaryKey,
                    'text-slate-400': isForeignKey && !isPrimaryKey,
                  })}
                  aria-hidden
                />
                <div className="sr-only" data-test="column-key">
                  {isPrimaryKey && 'Primary key'}
                  {isForeignKey && (isPrimaryKey ? 'and Foreign key' : 'Foreign key')}
                </div>
              </>
            )}
          </span>
          <span className="text-slate-700" data-test="column-name">
            {column.name}
          </span>
          <span className="text-slate-500" data-test="column-type">
            {column.type}
          </span>
          <div
            className={clsx('invisible ml-auto flex group-hover:visible', {
              invisible: hideAction,
            })}
          >
            <IconButton
              label="Edit column"
              icon={Pencil}
              onClick={() => setIsEditing(true)}
              disabled={hideAction}
              data-test="edit-column-button"
              className="nodrag group-hover:focus:bg-slate-200 group-hover:active:bg-slate-200 group-hover:enabled:hover:bg-slate-200"
            />
            <IconButton
              label="Delete column"
              icon={Trash}
              severity="danger"
              onClick={handleDelete}
              disabled={hideAction}
              data-test="delete-column-button"
              className="nodrag group-hover:focus:bg-slate-200 group-hover:active:bg-slate-200 group-hover:enabled:hover:bg-slate-200"
            />
          </div>
        </>
      )}
    </div>
  );
}
