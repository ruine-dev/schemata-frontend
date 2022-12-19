import { DragEventHandler, useCallback, useState, useRef, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Edge,
  MiniMap,
  Node,
  NodeTypes,
  Panel,
  ReactFlowInstance,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
import { TableProps } from '@/schemas/table';
import { DatabaseProps } from '@/schemas/database';
import { TableNode } from './TableNode';
import { DatabasePropsPanel } from './DatabasePropsPanel';
import { EditorPropsPanel } from './EditorPropsPanel';
import { ToolbarPanel } from './ToolbarPanel';

const nodeTypes: NodeTypes = { table: TableNode };

interface CanvasProps {
  database: DatabaseProps;
}

export function Canvas({ database }: CanvasProps) {
  const defaultNodes: Node<TableProps>[] = database.tables;
  const defaultEdges: Edge[] = [];

  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);

  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onDragOver: DragEventHandler<HTMLDivElement> = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop: DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node<TableProps> = {
        id: uuidv4(),
        type,
        position,
        data: { name: 'Untitled', columns: [] },
      };

      reactFlowInstance.addNodes(newNode);
    },
    [reactFlowInstance],
  );

  const deleteSelectedNodes = useCallback(() => {
    if (!reactFlowInstance) {
      return;
    }

    const nodes = reactFlowInstance.getNodes();
    const selectedNodes = nodes.filter((node) => node.selected);

    reactFlowInstance.deleteElements({ nodes: selectedNodes });
  }, [reactFlowInstance]);

  return (
    <ReactFlowProvider>
      <div className="h-screen w-full" ref={reactFlowWrapper}>
        <ReactFlow
          defaultNodes={defaultNodes}
          defaultEdges={defaultEdges}
          nodeTypes={nodeTypes}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onInit={setReactFlowInstance}
          onKeyDown={(e) => {
            if (e.key === 'Delete') {
              deleteSelectedNodes();
            }
          }}
          elementsSelectable
        >
          <Panel position="top-left">
            <DatabasePropsPanel database={database} />
          </Panel>
          <Panel position="top-right">
            <EditorPropsPanel database={database} />
          </Panel>
          <Panel position="bottom-center">
            <ToolbarPanel />
          </Panel>
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}
