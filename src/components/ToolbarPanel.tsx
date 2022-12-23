import { DragEvent, MouseEvent } from 'react';
import { useCreateTable } from '@/flow-hooks/useCreateTable';
import { Table } from 'phosphor-react';
import { EditorPanelContainer } from './EditorPanelContainer';
import { Tooltip } from './Tooltip';
import { emptyTableNodeFactory } from '@/utils/table';
import { useReactFlow } from 'reactflow';
import { clsx } from '@/utils/clsx';

export function ToolbarPanel() {
  const { project } = useReactFlow();
  const createTable = useCreateTable();

  const onDragStart = (event: DragEvent<HTMLButtonElement>, nodeType: 'table') => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleCreateTable = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = document.body.getBoundingClientRect();

    const position = project({
      x: rect.width / 2,
      y: rect.height / 2,
    });

    createTable(
      emptyTableNodeFactory({
        position,
      }),
    );
  };

  return (
    <EditorPanelContainer>
      <div className="flex items-center">
        <Tooltip text="Drag and drop to create a table">
          <button
            onClick={handleCreateTable}
            onDragStart={(event) => onDragStart(event, 'table')}
            draggable
            className={clsx(
              'flex cursor-pointer items-center gap-x-2 rounded-lg px-3 py-2 text-gray-500 outline-none ring-sky-500',
              'hover:bg-slate-100',
              'focus:ring-2',
            )}
          >
            <Table aria-hidden className="h-5 w-5" />
            Add Table
          </button>
        </Tooltip>
      </div>
    </EditorPanelContainer>
  );
}
