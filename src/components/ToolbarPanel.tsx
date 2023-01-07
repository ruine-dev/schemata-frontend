import { DragEvent } from 'react';
import { useCreateTable } from '@/flow-hooks/useCreateTable';
import { EditorPanelContainer } from './EditorPanelContainer';
import { Tooltip } from './Tooltip';
import { useReactFlow } from 'reactflow';
import { clsx } from '@/utils/clsx';
import { emptyTableWithoutId } from '@/utils/reactflow';
import { AddTableIcon } from './Icon/AddTableIcon';

export function ToolbarPanel() {
  const { project } = useReactFlow();
  const createTable = useCreateTable();

  const onDragStart = (event: DragEvent<HTMLButtonElement>, nodeType: 'table') => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleCreateTable = () => {
    const rect = document.body.getBoundingClientRect();

    const position = project({
      x: rect.width / 2,
      y: rect.height / 2,
    });

    createTable(emptyTableWithoutId(), position);
  };

  return (
    <EditorPanelContainer>
      <div className="flex items-center">
        <Tooltip text="Drag and drop to create a table (T)">
          <button
            onClick={handleCreateTable}
            onDragStart={(event) => onDragStart(event, 'table')}
            draggable
            data-test="create-table-button"
            className={clsx(
              'flex cursor-pointer items-center gap-x-2 rounded pr-1 text-sm text-slate-600 outline-offset-2 outline-sky-500',
              'hover:bg-gray-100',
            )}
          >
            <span className="flex h-7 w-7 items-center justify-center">
              <AddTableIcon aria-hidden />
            </span>
            Add Table
          </button>
        </Tooltip>
      </div>
    </EditorPanelContainer>
  );
}
