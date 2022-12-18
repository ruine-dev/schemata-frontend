import { DragEvent } from 'react';
import { useCreateTable } from '@/flow-hooks/useCreateTable';
import { Table } from 'phosphor-react';
import { EditorPanelContainer } from './EditorPanelContainer';
import { Tooltip } from './Tooltip';
import { emptyTableNodeFactory } from '@/utils/table';
import { useReactFlow } from 'reactflow';

export function ToolbarPanel() {
  const reactFlowInstance = useReactFlow();
  const createTable = useCreateTable();

  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: 'table') => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleCreateTable = () => {
    const viewport = reactFlowInstance.getViewport();

    createTable(
      emptyTableNodeFactory({
        position: {
          x: viewport.x + 200,
          y: viewport.y + 200,
        },
      }),
    );
  };

  return (
    <EditorPanelContainer>
      <div className="flex items-center">
        <Tooltip text="Drag and drop to create a table">
          <div
            onClick={handleCreateTable}
            onDragStart={(event) => onDragStart(event, 'table')}
            draggable
            className="flex cursor-grab items-center gap-x-2 rounded-lg px-3 py-2 text-gray-500 hover:bg-slate-100"
          >
            <Table aria-hidden className="h-5 w-5" />
            Add Table
          </div>
        </Tooltip>
      </div>
    </EditorPanelContainer>
  );
}
