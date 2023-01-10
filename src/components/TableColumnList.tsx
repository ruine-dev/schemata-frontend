import { TableType } from '@/schemas/base';
import clsx from 'clsx';
import { Handle, Position, useStore } from 'reactflow';
import { TableColumn } from './TableColumn';

type TableColumnListProps = {
  table: TableType;
};

export function TableColumnList({ table }: TableColumnListProps) {
  const connectionNodeId = useStore((state) => state.connectionNodeId);

  const isTarget = !!(connectionNodeId && connectionNodeId !== table.id);

  return (
    <ul
      className={clsx(
        'mt-3.5 divide-y divide-gray-200 rounded-t rounded-b border-b border-transparent',
        'group-hover/node:border-b-gray-200',
        'group-focus-within/node:border-b-gray-200',
      )}
    >
      {table.columns
        .sort((a, b) => a.index - b.index)
        .map((column) => (
          <li
            key={column.id}
            className={clsx(
              'nodrag group relative bg-white',
              'first:rounded-t',
              'last:rounded-b',
              'group-hover/node:rounded-b-none',
              'group-focus-within/node:rounded-b-none',
            )}
          >
            <Handle
              id={`${column.id}-source-right`}
              position={Position.Right}
              type="source"
              className={clsx(
                'peer absolute -right-[0.3125rem] z-20 h-2.5 w-2.5 border-2 border-sky-400 bg-white opacity-0',
                {
                  'group-hover:opacity-100': !connectionNodeId || !isTarget,
                },
              )}
            />
            <Handle
              id={`${column.id}-source-left`}
              position={Position.Left}
              type="source"
              className={clsx(
                'peer absolute -left-[0.3125rem] z-20 h-2.5 w-2.5 border-2 border-sky-400 bg-white opacity-0',
                {
                  'group-hover:opacity-100': !connectionNodeId || !isTarget,
                },
              )}
            />
            <Handle
              id={`${column.id}-target`}
              position={Position.Right}
              type="target"
              className={clsx(
                'peer absolute top-0 left-0 h-full w-full translate-y-0 rounded-none border-0 opacity-0',
                {
                  invisible: !isTarget,
                  'visible z-20': isTarget,
                },
              )}
            />
            <TableColumn
              column={column}
              tableIndexes={table.indexes}
              tableId={table.id}
              className="peer-hover:bg-slate-100"
            />
          </li>
        ))}
    </ul>
  );
}
