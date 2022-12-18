import { Key, Pencil, Trash } from 'phosphor-react';
import { IconButton } from './IconButton';
import { TableColumnProps } from '@/schemas/table';
import { clsx } from '@/utils/clsx';
import { UpdateTableColumnDialog } from './UpdateTableColumnDialog';

type TableColumnFinalProps = TableColumnProps & { tableId: string; className?: string };

export function TableColumn({
  id,
  name,
  type,
  isPrimaryKey,
  tableId,
  className,
}: TableColumnFinalProps) {
  const isForeignKey = false;

  return (
    <div
      className={clsx(
        'group flex items-center gap-x-2 py-0.5 pl-3 pr-1.5 hover:bg-slate-100',
        className,
      )}
    >
      <span className="h-4 w-4">
        {(isPrimaryKey || isForeignKey) && (
          <Key
            weight="fill"
            className={clsx('h-4 w-4', {
              'text-yellow-400': isPrimaryKey,
              'text-slate-400': isForeignKey,
            })}
          />
        )}
      </span>
      <span className="text-slate-700">{name}</span>
      <span className="text-slate-500">{type}</span>
      <div className="invisible ml-auto flex group-hover:visible">
        <UpdateTableColumnDialog
          column={{ id, name, type, isPrimaryKey }}
          tableId={tableId}
          trigger={
            <IconButton
              label="Edit column"
              icon={Pencil}
              className="nodrag hover:bg-slate-200 active:bg-slate-300"
            />
          }
        />
        <IconButton
          label="Delete column"
          icon={Trash}
          severity="danger"
          className="nodrag hover:bg-slate-200 active:bg-slate-300"
        />
      </div>
    </div>
  );
}
