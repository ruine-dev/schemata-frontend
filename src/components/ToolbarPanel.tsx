import { DragEvent, useContext } from 'react';
import { useCreateTable } from '@/flow-hooks/useCreateTable';
import { ArrowClockwise, ArrowCounterClockwise, Table } from 'phosphor-react';
import { EditorPanelContainer } from './EditorPanelContainer';
import { Tooltip } from './Tooltip';
import { useReactFlow } from 'reactflow';
import { clsx } from '@/utils/clsx';
import { emptyTableWithoutId } from '@/utils/reactflow';
import { IconButton } from './IconButton';
import { EditorStateContext } from '@/contexts/EditorStateContext';

export function ToolbarPanel() {
  const { project } = useReactFlow();
  const { undoableService } = useContext(EditorStateContext);
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
              'flex cursor-pointer items-center gap-x-2 rounded-lg px-3 py-2 text-gray-500 outline-none ring-sky-500',
              'hover:bg-slate-100',
              'focus:ring-2',
            )}
          >
            <Table aria-hidden className="h-5 w-5" />
            Add Table
          </button>
        </Tooltip>
        <IconButton
          icon={ArrowCounterClockwise}
          label="Undo (CTRL + Z)"
          onClick={undoableService.undo}
          disabled={!undoableService.canUndo}
          filled
        />
        <IconButton
          icon={ArrowClockwise}
          label="Redo (CTRL + Y)"
          onClick={undoableService.redo}
          disabled={!undoableService.canRedo}
          filled
        />
      </div>
    </EditorPanelContainer>
  );
}
