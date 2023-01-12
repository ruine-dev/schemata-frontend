import { ColumnType, TableType } from '@/schemas/base';
import { clsx } from '@/utils/clsx';
import { Handle, Position } from 'reactflow';
import { TableColumn } from './TableColumn';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type TableColumnListItemProps = {
  column: ColumnType;
  table: TableType;
  connectionNodeId: string | null;
  isTarget: boolean;
};

export function TableColumnListItem({
  column,
  table,
  connectionNodeId,
  isTarget,
}: TableColumnListItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    setActivatorNodeRef,
  } = useSortable({
    id: column.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={clsx(
        'nodrag group relative bg-white',
        'first:rounded-t',
        'last:rounded-b',
        'group-hover/node:rounded-b-none',
        'group-focus-within/node:rounded-b-none',
        { 'z-10': isDragging },
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
        ref={setActivatorNodeRef}
        column={column}
        tableIndexes={table.indexes}
        tableId={table.id}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
        className="peer-hover:bg-slate-100"
      />
    </li>
  );
}
