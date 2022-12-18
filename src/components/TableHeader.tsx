import { useEffect, useRef } from 'react';
import { Pencil, Trash } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TableWithIdProps, TableWithIdSchema } from '@/schemas/table';
import { useState } from 'react';
import { IconButton } from './IconButton';
import { useUpdateTable } from '@/flow-hooks/useUpdateTable';
import { useDeleteTable } from '@/flow-hooks/useDeleteTable';

interface TableHeaderProps {
  table: TableWithIdProps;
}

export function TableHeader({ table }: TableHeaderProps) {
  const updateTable = useUpdateTable();
  const deleteTable = useDeleteTable();

  const nodeRef = useRef<HTMLDivElement | null>(null);

  const defaultValues = table;

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<TableWithIdProps>({
    resolver: zodResolver(TableWithIdSchema),
    defaultValues,
  });

  const [isRenaming, setIsRenaming] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    let name = data.name;

    if (defaultValues.name === '' && name === '') {
      name = 'untitled';
    } else if (defaultValues.name !== '' && name === '') {
      name = defaultValues.name;
    }

    updateTable({ ...data, name });
    setIsRenaming(false);

    nodeRef.current?.parentElement?.parentElement?.focus();
  });

  useEffect(() => {
    if (table.name === '') {
      setIsRenaming(true);
      setTimeout(() => setFocus('name'), 0);
    }
  }, []);

  useEffect(() => {
    reset(table);
  }, [reset, table]);

  const handleRename = () => {
    setIsRenaming(true);
  };

  return (
    <div ref={nodeRef} className="group rounded-t-xl bg-sky-500 px-3 pb-1.5 pt-2 font-medium">
      {isRenaming ? (
        <form onSubmit={onSubmit} className="flex items-center justify-between">
          <input
            {...register('name', {
              setValueAs(value: string) {
                return value.trim();
              },
              onBlur() {
                onSubmit();
              },
            })}
            type="text"
            disabled={isSubmitting}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                onSubmit();
              }
            }}
            required
            autoFocus
            className="form-input w-full py-1 px-0 text-sm"
          />
          <button type="submit" className="sr-only">
            Save
          </button>
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
              className="ml-2 enabled:hover:bg-sky-600"
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
