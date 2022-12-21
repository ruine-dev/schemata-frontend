import { useEffect, useRef } from 'react';
import { Check, Pencil, Trash } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TableWithIdProps, TableWithIdSchema } from '@/schemas/table';
import { useState } from 'react';
import FocusTrap from 'focus-trap-react';
import { IconButton } from './IconButton';
import { useUpdateTable } from '@/flow-hooks/useUpdateTable';
import { useDeleteTable } from '@/flow-hooks/useDeleteTable';
import { clsx } from '@/utils/clsx';
import { Textbox } from './Textbox';

interface TableHeaderProps {
  table: TableWithIdProps;
}

export function TableHeader({ table }: TableHeaderProps) {
  const updateTable = useUpdateTable();
  const deleteTable = useDeleteTable();

  const nodeRef = useRef<HTMLDivElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { isSubmitting },
  } = useForm<TableWithIdProps>({
    resolver: zodResolver(TableWithIdSchema),
    defaultValues: table,
  });

  const [isRenaming, setIsRenaming] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    let name = data.name;

    if (table.name === '' && name === '') {
      name = 'untitled';
    } else if (table.name !== '' && name === '') {
      name = table.name;
    }

    updateTable({ ...data, name });
    setIsRenaming(false);
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
      ref={nodeRef}
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
          }
        }
      }}
      className={clsx(
        'group rounded-t-xl bg-sky-500 px-3 pb-1.5 pt-2 font-medium outline-none ring-sky-500 ring-offset-2',
        'focus:ring-2',
      )}
    >
      {isRenaming ? (
        <FocusTrap>
          <form
            onSubmit={onSubmit}
            className="flex items-center justify-between"
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                onSubmit();
              }
            }}
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
              required
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
        </FocusTrap>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2 text-white">{table.name}</div>
          <div
            className={clsx(
              'flex items-center gap-x-1',
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
