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
import { TableNodeSchema, TableProps } from '@/schemas/table';
import { DatabaseProps } from '@/schemas/database';
import { TableNode } from './TableNode';
import { DatabasePropsPanel } from './DatabasePropsPanel';
import { EditorPropsPanel } from './EditorPropsPanel';
import { ToolbarPanel } from './ToolbarPanel';
import { createTableWithInstance } from '@/flow-hooks/useCreateTable';
import { emptyTableNodeFactory } from '@/utils/table';
import { useSaveDatabaseLocal } from '@/mutations/useSaveDatabaseLocal';

const nodeTypes: NodeTypes = { table: TableNode };

interface CanvasProps {
  database: DatabaseProps;
}

export function Canvas({ database }: CanvasProps) {
  const defaultNodes: Node<TableProps>[] = database.tables.map((table) => ({
    ...table,
    type: 'table',
  }));
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
        id: crypto.randomUUID(),
        type,
        position,
        data: { name: 'Untitled', columns: [] },
      };

      reactFlowInstance.addNodes(newNode);
    },
    [reactFlowInstance],
  );

  const createTable = createTableWithInstance(reactFlowInstance);

  useEffect(() => {
    const handleCreateTableShortcut = (e: KeyboardEvent) => {
      if (document.activeElement !== document.body) {
        return;
      }

      if (e.key === 't') {
        const rect = document.body.getBoundingClientRect();

        e.preventDefault();
        e.stopPropagation();

        const position = reactFlowInstance?.project({
          x: rect.width / 2,
          y: rect.height / 2,
        });

        createTable(
          emptyTableNodeFactory({
            position,
          }),
        );
      }
    };

    document.body.addEventListener('keydown', handleCreateTableShortcut);

    return () => {
      document.body.removeEventListener('keydown', handleCreateTableShortcut);
    };
  }, [createTable]);

  const { mutate: saveDatabaseLocal } = useSaveDatabaseLocal();

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
          onNodesChange={() => {
            const tableNodes = TableNodeSchema.array().safeParse(reactFlowInstance?.getNodes());

            saveDatabaseLocal((currentDatabase) => ({
              ...currentDatabase,
              tables: tableNodes.success ? tableNodes.data : [],
            }));
          }}
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
          <Background className="bg-white" />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}
