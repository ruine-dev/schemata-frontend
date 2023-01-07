import { Handle, Position, useStore } from 'reactflow';
import { TableColumn } from './TableColumn';
import { clsx } from '@/utils/clsx';
import { TableHeader } from './TableHeader';
import { useCreateColumn } from '@/flow-hooks/useCreateColumn';
import { emptyVarcharColumn } from '@/utils/reactflow';
import { TableNodeType } from '@/schemas/base';
import { Tooltip } from './Tooltip';
import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/20/solid';

export function TableNode({ id, data: table }: TableNodeType) {
  const createColumn = useCreateColumn();
  const connectionNodeId = useStore((state) => state.connectionNodeId);
  const connectionHandleId = useStore((state) => state.connectionHandleId);

  const isTarget = connectionNodeId && connectionNodeId !== id;

  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      id={`table-${id}`}
      onClick={() => {
        document.getElementById(`table-header-${id}`)?.focus();
      }}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      data-test="table-node"
      className={clsx(
        'group/node min-w-[20rem] rounded-md bg-slate-200 px-3 pb-4 shadow-sm ring-1 ring-slate-200 ring-offset-2',
        'outline-2 outline-offset-2 outline-sky-500 [&:has([id*=table-header-]:focus)]:outline',
      )}
    >
      <TableHeader table={{ id, ...table }} />
      <ul
        className={clsx(
          'mt-3.5 divide-y divide-gray-200 rounded-t rounded-b border-b border-transparent',
          'group-hover/node:border-b-gray-200',
          'group-focus-within/node:border-b-gray-200',
        )}
      >
        {table.columns.map((column) => (
          <li
            key={column.id}
            className={clsx(
              'group relative bg-white',
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
            'nodrag hidden w-full rounded-b bg-white py-3 px-4 text-left text-sm font-semibold text-sky-600 outline-2 outline-sky-500',
            'hover:bg-slate-100',
            'group-hover/node:flex',
            'group-focus-within/node:flex',
            'focus:relative focus:z-10 focus:rounded-t focus:outline',
            'enabled:active:bg-slate-100',
            { 'rounded-t': table.columns.length === 0 },
          )}
        >
          <span className="flex items-center gap-x-2 text-sm uppercase tracking-wide">
            <PlusIcon aria-hidden className="h-5 w-5" />
            Add field
          </span>
        </button>
      </Tooltip>
    </div>
  );
}
