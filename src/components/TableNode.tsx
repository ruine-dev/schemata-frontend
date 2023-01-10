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
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TableColumnList } from './TableColumnList';

export function TableNode({ id, data: table }: TableNodeType) {
  const createColumn = useCreateColumn();

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
      <DndProvider backend={HTML5Backend}>
        <TableColumnList table={{ id, ...table }} />
      </DndProvider>
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
