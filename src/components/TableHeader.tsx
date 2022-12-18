import { useEffect } from 'react';
import { FloppyDisk, Pencil, Trash, X } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TableWithIdProps, TableWithIdSchema } from '@/schemas/table';
import { useState } from 'react';
import { IconButton } from './IconButton';
import { useUpdateTable } from '@/flow-hooks/useUpdateTable';
import { useDeleteTable } from '@/flow-hooks/useDeleteTable';

interface TableHeaderProps {
  table: TableWithIdProps;
  isRenaming?: boolean;
}

export function TableHeader({ table, isRenaming: defaultIsRenaming }: TableHeaderProps) {
  const updateTable = useUpdateTable();
  const deleteTable = useDeleteTable();

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<TableWithIdProps>({
    resolver: zodResolver(TableWithIdSchema),
    defaultValues: table,
  });

  const [isRenaming, setIsRenaming] = useState(defaultIsRenaming);

  const onSubmit = handleSubmit(async (data) => {
    updateTable(data);
    setIsRenaming(false);
  });

  useEffect(() => {
    reset(table);
  }, [reset, table]);

  const handleCancelRename = () => {
    reset();
    setIsRenaming(false);
  };

  const handleRename = () => {
    setIsRenaming(true);
    queueMicrotask(() => setFocus('name'));
  };

  return (
    <div className="group rounded-t-xl bg-sky-500 px-3 pb-1.5 pt-2 font-medium">
      {isRenaming ? (
        <form onSubmit={onSubmit} className="flex items-center justify-between">
          <input
            {...register('name')}
            type="text"
            disabled={isSubmitting}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleCancelRename();
              }
            }}
            required
            className="form-input w-36 p-0 text-sm"
          />
          <div className="flex items-center">
            <IconButton
              type="button"
              icon={X}
              label="Cancel"
              severity="dark"
              onClick={handleCancelRename}
              disabled={isSubmitting}
              className="enabled:hover:bg-sky-600"
            />
            <IconButton
              type="submit"
              icon={FloppyDisk}
              label="Save"
              severity="dark"
              loading={isSubmitting}
              disabled={!isDirty}
              className="enabled:hover:bg-sky-600"
            />
          </div>
        </form>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2 text-white">{table.name}</div>
          <div className="invisible flex items-center gap-x-1 group-hover:visible">
            <IconButton
              icon={Pencil}
              label="Rename"
              severity="dark"
              onClick={handleRename}
              className="enabled:hover:bg-sky-600"
            />
            <IconButton
              icon={Trash}
              label="Delete"
              severity="dark"
              onClick={() => deleteTable(table.id)}
              className="enabled:hover:bg-sky-600"
            />
          </div>
        </div>
      )}
    </div>
  );
}
