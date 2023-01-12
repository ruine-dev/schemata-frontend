import { TableType } from '@/schemas/base';
import { useDroppable } from '@dnd-kit/core';
import clsx from 'clsx';
import { useStore } from 'reactflow';
import { TableColumnListItem } from './TableColumnListItem';

type TableColumnListProps = {
  table: TableType;
};

export function TableColumnList({ table }: TableColumnListProps) {
  const connectionNodeId = useStore((state) => state.connectionNodeId);

  const isTarget = !!(connectionNodeId && connectionNodeId !== table.id);

  const { setNodeRef } = useDroppable({
    id: 'droppable',
  });

  return (
    <ul
      ref={setNodeRef}
      className={clsx(
        'mt-3.5 divide-y divide-gray-200 rounded-t rounded-b border-b border-transparent bg-white',
        'group-hover/node:border-b-gray-200',
        'group-focus-within/node:border-b-gray-200',
      )}
    >
      {table.columns.map((column) => (
        <TableColumnListItem
          key={column.id}
          column={column}
          table={table}
          connectionNodeId={connectionNodeId}
          isTarget={isTarget}
        />
      ))}
    </ul>
  );
}
