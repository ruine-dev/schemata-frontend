import { Plus } from 'phosphor-react';
import { Handle, Position, useStore } from 'reactflow';
import { TableNodeProps as BaseTableNodeProps } from '@/schemas/table';
import { TableColumn } from './TableColumn';
import { clsx } from '@/utils/clsx';
import { TableHeader } from './TableHeader';
import { useAddTableColumn } from '@/flow-hooks/useAddTableColumn';

type TableNodeProps = Pick<BaseTableNodeProps, 'id'> & {
  data: BaseTableNodeProps['data'];
};

export function TableNode({ id, data: table }: TableNodeProps) {
  const addTableColumn = useAddTableColumn();
  const connectionNodeId = useStore((state) => state.connectionNodeId);
  const connectionHandleId = useStore((state) => state.connectionHandleId);

  const isTarget = connectionNodeId && connectionNodeId !== id;

  return (
    <div
      className={clsx(
        'min-w-[16rem] rounded-xl border border-slate-300 bg-white font-mono text-sm shadow-sm',
      )}
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
                'opacity-0': connectionHandleId !== `${table.name}-${column.name}-source-right`,
                'group-hover:opacity-100': !connectionNodeId || !isTarget,
              })}
            />
            <Handle
              id={`${table.name}-${column.name}-source-left`}
              position={Position.Left}
              type="source"
              className={clsx('peer absolute -left-[0.3125rem] z-10 h-2.5 w-2.5 bg-sky-500', {
                'opacity-0': connectionHandleId !== `${table.name}-${column.name}-source-left`,
                'group-hover:opacity-100': !connectionNodeId || !isTarget,
              })}
            />
            <Handle
              id={`${table.name}-${column.name}-target-right`}
              position={Position.Right}
              type="target"
              className={clsx(
                'peer invisible absolute top-0 right-0 h-full w-1/2 translate-y-0 rounded-none border-0 opacity-0',
                {
                  'visible z-20': isTarget,
                },
              )}
            />
            <Handle
              id={`${table.name}-${column.name}-target-left`}
              position={Position.Left}
              type="target"
              className={clsx(
                'peer invisible absolute top-0 left-0 h-full w-1/2 translate-y-0 rounded-none border-0 opacity-0',
                {
                  'visible z-20': isTarget,
                },
              )}
            />
            <TableColumn
              column={column}
              tableId={id}
              hideAction={!!connectionNodeId}
              className="peer-hover:bg-slate-100"
            />
          </li>
        ))}
      </ul>
      <button
        onClick={() =>
          addTableColumn({
            name: '',
            type: 'varchar',
            isPrimaryKey: false,
            tableId: id,
          })
        }
        className={clsx(
          'noimage nodrag flex w-full items-center justify-center rounded-b-xl py-3 px-3 font-sans text-xs font-medium text-sky-500 outline-none ring-sky-500',
          'hover:bg-sky-50 hover:text-sky-600',
          'focus:relative focus:z-10 focus:ring-2',
          'enabled:active:bg-sky-50 enabled:active:text-sky-600',
        )}
      >
        <span className="-ml-4 flex items-center gap-x-2 uppercase tracking-wider">
          <Plus aria-hidden className="h-4 w-4" />
          Add field
        </span>
      </button>
    </div>
  );
}
