import { Plus } from 'phosphor-react';
import { Handle, Position, useStore } from 'reactflow';
import { TableColumn } from './TableColumn';
import { clsx } from '@/utils/clsx';
import { TableHeader } from './TableHeader';
import { useCreateColumn } from '@/flow-hooks/useCreateColumn';
import { emptyVarcharColumn } from '@/utils/reactflow';
import { TableNodeType } from '@/schemas/base';
import { Tooltip } from './Tooltip';
import { useState } from 'react';

export function TableNode({ id, data: table }: TableNodeType) {
  const createColumn = useCreateColumn();
  const connectionNodeId = useStore((state) => state.connectionNodeId);
  const connectionHandleId = useStore((state) => state.connectionHandleId);

  const isTarget = connectionNodeId && connectionNodeId !== id;

  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      id={`table-${id}`}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      data-test="table-node"
      className={clsx(
        'group/node min-w-[18rem] rounded-xl border border-slate-300 bg-white font-mono shadow-sm',
      )}
    >
      <TableHeader table={{ id, ...table }} />
      <ul className="mt-1 pb-1">
        {table.columns.map((column) => (
          <li key={column.id} className="group relative">
            <Handle
              id={`${column.id}-source-right`}
              position={Position.Right}
              type="source"
              className={clsx('peer absolute -right-[0.3125rem] z-10 h-2.5 w-2.5 bg-sky-500', {
                'opacity-0': connectionHandleId !== `${table.name}-${column.name}-source-right`,
                'group-hover:opacity-100': !connectionNodeId || !isTarget,
              })}
            />
            <Handle
              id={`${column.id}-source-left`}
              position={Position.Left}
              type="source"
              className={clsx('peer absolute -left-[0.3125rem] z-10 h-2.5 w-2.5 bg-sky-500', {
                'opacity-0': connectionHandleId !== `${table.name}-${column.name}-source-left`,
                'group-hover:opacity-100': !connectionNodeId || !isTarget,
              })}
            />
            <Handle
              id={`${column.id}-target`}
              position={Position.Right}
              type="target"
              className={clsx(
                'peer invisible absolute top-0 left-0 h-full w-full translate-y-0 rounded-none border-0 opacity-0',
                {
                  'visible z-20': isTarget,
                },
              )}
            />
            <TableColumn
              column={column}
              tableIndexes={table.indexes}
              tableId={id}
              hideAction={!!connectionNodeId}
              className="peer-hover:bg-slate-100"
            />
          </li>
        ))}
      </ul>
      <Tooltip text="(SHIFT + ENTER)" allowOpen={isFocused}>
        <button
          onClick={() => createColumn({ ...emptyVarcharColumn(), tableId: id })}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              e.stopPropagation();
              document.getElementById(`table-header-${id}`)?.focus();
            }
          }}
          data-test="create-column-button"
          className={clsx(
            'noimage nodrag hidden w-full items-center justify-center rounded-b-xl py-3 px-3 font-sans font-medium text-sky-500 outline-none ring-sky-500',
            'hover:bg-sky-50 hover:text-sky-600',
            'group-hover/node:flex',
            'group-focus-within/node:flex',
            'focus:relative focus:z-10 focus:ring-2',
            'enabled:active:bg-sky-50 enabled:active:text-sky-600',
          )}
        >
          <span className="-ml-4 flex items-center gap-x-2 text-sm uppercase tracking-wider">
            <Plus aria-hidden className="h-5 w-5" />
            Add field
          </span>
        </button>
      </Tooltip>
    </div>
  );
}
