import { Plus } from 'phosphor-react';
import { Handle, Position, useStore } from 'reactflow';
import { TableNodeProps as BaseTableNodeProps } from '@/schemas/table';
import { TableColumn } from './TableColumn';
import { clsx } from '@/utils/clsx';
import { TableHeader } from './TableHeader';
import { AddTableColumnDialog } from './AddTableColumnDialog';
import { useDeleteSelectedTable } from '@/flow-hooks/useDeleteSelectedTable';

type TableNodeProps = Pick<BaseTableNodeProps, 'id'> & {
  selected?: boolean;
  data: BaseTableNodeProps['data'];
};

export function TableNode({ id, data: table, selected }: TableNodeProps) {
  const deleteSelectedTable = useDeleteSelectedTable();
  const connectionNodeId = useStore((state) => state.connectionNodeId);
  const connectionHandleId = useStore((state) => state.connectionHandleId);

  const isTarget = connectionNodeId && connectionNodeId !== id;

  return (
    <div
      className={clsx(
        'min-w-[16rem] rounded-xl border border-slate-300 bg-white font-mono text-sm shadow-sm',
        {
          'outline outline-offset-2 outline-sky-500': selected,
        },
      )}
      onKeyDown={(e) => {
        if (e.key === 'Delete') {
          deleteSelectedTable();
        }
      }}
    >
      <TableHeader table={{ id, ...table }} />
      <ul className="mt-1">
        {table.columns.map((column) => (
          <li key={column.id} className="group relative">
            <Handle
              id={`${table.name}-${column.name}-source-right`}
              position={Position.Right}
              type="source"
              className={clsx('peer absolute -right-[0.3125rem] z-10 h-2.5 w-2.5 bg-sky-500', {
                invisible: connectionHandleId !== `${table.name}-${column.name}-source-right`,
                'group-hover:visible': !connectionNodeId || isTarget,
              })}
            />
            <Handle
              id={`${table.name}-${column.name}-source-left`}
              position={Position.Left}
              type="source"
              className={clsx('peer absolute -left-[0.3125rem] z-10 h-2.5 w-2.5 bg-sky-500', {
                invisible: connectionHandleId !== `${table.name}-${column.name}-source-left`,
                'group-hover:visible': !connectionNodeId || isTarget,
              })}
            />
            <Handle
              id={`${table.name}-${column.name}-target-right`}
              position={Position.Right}
              type="target"
              className={clsx('peer invisible absolute -right-[0.3125rem] h-2.5 w-2.5 bg-sky-500', {
                'z-20 group-hover:visible': isTarget,
              })}
            />
            <Handle
              id={`${table.name}-${column.name}-target-left`}
              position={Position.Left}
              type="target"
              className={clsx('peer invisible absolute -right-[0.3125rem] h-2.5 w-2.5 bg-sky-500', {
                'z-20 group-hover:visible': isTarget,
              })}
            />
            <TableColumn
              id={column.id}
              name={column.name}
              type={column.type}
              isPrimaryKey={column.isPrimaryKey}
              tableId={id}
              className="peer-hover:bg-slate-100"
            />
          </li>
        ))}
      </ul>
      <AddTableColumnDialog
        tableId={id}
        trigger={
          <button className="nodrag flex w-full items-center justify-center rounded-b-xl py-3 px-3 font-sans text-xs font-medium text-sky-500 hover:bg-sky-50 hover:text-sky-600">
            <span className="-ml-4 flex items-center gap-x-2 uppercase tracking-wider">
              <Plus aria-hidden className="h-4 w-4" />
              Add field
            </span>
          </button>
        }
      />
    </div>
  );
}
