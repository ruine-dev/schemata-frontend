import {
  CSSProperties,
  forwardRef,
  HTMLAttributes,
  KeyboardEventHandler,
  Ref,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FocusLock, { AutoFocusInside } from 'react-focus-lock';
import CreatableSelect from 'react-select/creatable';
import { clsx } from '@/utils/clsx';
import { Textbox } from './Textbox';
import { useUpdateColumn } from '@/flow-hooks/useUpdateColumn';
import { useValidateUniqueColumnName } from '@/flow-hooks/useValidateUniqueColumnName';
import { useDeleteColumn } from '@/flow-hooks/useDeleteColumn';
import { useCreateColumn } from '@/flow-hooks/useCreateColumn';
import { emptyCreateVarcharColumn, getColumnIdFromHandleId } from '@/utils/reactflow';
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
import { DotsSixVertical } from 'phosphor-react';
import { Tooltip } from './Tooltip';

type TableColumnFinalProps = {
  column: ColumnType;
  tableIndexes: IndexType[];
  tableId: string;
  className?: string;
  style?: CSSProperties;
  dragHandleProps?: HTMLAttributes<HTMLDivElement>;
  isDragging?: boolean;
};

function TableColumnComponent(
  {
    column,
    tableIndexes,
    tableId,
    className,
    style,
    dragHandleProps,
    isDragging,
  }: TableColumnFinalProps,
  dragHandleRef: Ref<HTMLDivElement>,
) {
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

  const isUniqueIndex = !!tableIndexes.find(
    (index) => index.columns.includes(column.id) && index.type === 'UNIQUE_INDEX',
  );

  const edges = useStore((state) => state.edges);

  const isForeignKey = !!edges.find(
    (edge) => edge.targetHandle && getColumnIdFromHandleId(edge.targetHandle) === column.id,
  );

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm<UpdateColumnType>({
    resolver: zodResolver(UpdateColumnSchema),
    defaultValues: { ...column, isPrimaryKey, isUniqueIndex, tableId },
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
    reset({ ...column, isPrimaryKey, isUniqueIndex, tableId });
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
          kbd: 'Ctrl + D',
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
        onDoubleClick={() => {
          if (!isEditing) {
            triggerEdit();
          }
        }}
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

              createColumn({ ...emptyCreateVarcharColumn(), tableId });
            } else if (e.ctrlKey && e.key === 'd') {
              e.preventDefault();
              e.stopPropagation();
              triggerDuplicate();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              e.stopPropagation();

              document.getElementById(`table-header-${tableId}`)?.focus();
            }
          }
        }}
        style={style}
        data-test="column"
        className={clsx(
          'group bg-white py-3 px-4 outline-2 outline-sky-500',
          'focus:relative focus:z-10 focus:rounded focus:outline',
          { 'hover:bg-slate-100': !isEditing, 'relative z-10': isDragging },
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
              {(watch('type') === 'ENUM' || watch('type') === 'SET') && (
                <Controller
                  control={control}
                  name="values"
                  render={({ field: { name, onBlur, onChange, value } }) => (
                    <div className={clsx('mt-4 flex flex-col gap-y-1')}>
                      <label
                        htmlFor="values"
                        className={clsx('text-sm font-medium text-slate-500')}
                      >
                        Values
                      </label>
                      <CreatableSelect
                        isMulti
                        name={name}
                        onBlur={onBlur}
                        onChange={(values) => {
                          onChange(values.map((val) => (val as { value: string }).value));
                        }}
                        value={(value ?? []).map((val) => ({ label: val, value: val }))}
                        inputId="values"
                        className={clsx('react-select-container w-[16.5rem]')}
                        classNamePrefix="react-select"
                      />
                    </div>
                  )}
                />
              )}
              <Checkbox
                {...register('isPrimaryKey')}
                label="Primary Key"
                data-test="column-primary-key-checkbox"
                className="mt-4"
              />
              <Checkbox
                {...register('isUniqueIndex')}
                label="Unique"
                data-test="column-unique-index-checkbox"
                className="mt-4"
              />
              <Checkbox
                {...register('attributes')}
                label="Nullable"
                value="NULLABLE"
                data-test="column-nullable-checkbox"
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
                <Tooltip
                  text={`${isPrimaryKey ? 'Primary key' : ''}${
                    isForeignKey ? (isPrimaryKey ? ' and Foreign key' : 'Foreign key') : ''
                  }`}
                >
                  <span>
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
                  </span>
                </Tooltip>
              )}
            </span>
            <span className="ml-2 mr-4 font-medium text-slate-600">
              <span data-test="column-name">{column.name}</span>
              {column.attributes.includes('NULLABLE') ? (
                <span className="sr-only"> Nullable</span>
              ) : (
                <Tooltip text="Not Null">
                  <span aria-hidden className="text-red-500">
                    *
                  </span>
                </Tooltip>
              )}
            </span>
            <span className="ml-auto font-medium text-sky-700" data-test="column-type">
              {column.type}
            </span>
            <div
              ref={dragHandleRef}
              {...dragHandleProps}
              className={clsx('noimage ml-3', {
                'cursor-grab': !isDragging,
                'cursor-grabbing': isDragging,
              })}
            >
              <DotsSixVertical aria-hidden className="h-5 w-5" />
            </div>
          </div>
        )}
      </div>
    </ContextMenu>
  );
}

export const TableColumn = forwardRef(TableColumnComponent);
