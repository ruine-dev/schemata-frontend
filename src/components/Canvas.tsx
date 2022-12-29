import { DragEventHandler, useCallback, useState, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  EdgeTypes,
  MiniMap,
  NodeTypes,
  Panel,
  ReactFlowInstance,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { TableNode } from './TableNode';
import { GeneralPropsPanel } from './GeneralPropsPanel';
import { EditorPropsPanel } from './EditorPropsPanel';
import { ToolbarPanel } from './ToolbarPanel';
import { SimpleFloatingEdge } from './ReactFlow/SimpleFloatingEdge';
import {
  SchemaType,
  TableNodeType,
  TableType,
  transformSchemaToReactFlowData,
} from '@/schemas/base';
import { emptyTableNode } from '@/utils/reactflow';
import { useAddCreateTableShortcut } from '@/flow-hooks/useAddCreateTableShortcut';
import { useHandleSaveLocalSchema } from '@/flow-hooks/useHandleSaveLocalSchema';
import { isUuid } from '@/utils/zod';

const nodeTypes: NodeTypes = { table: TableNode } as unknown as NodeTypes;

const edgeTypes: EdgeTypes = {
  floating: SimpleFloatingEdge,
};

interface CanvasProps {
  schema: SchemaType;
}

export function Canvas({ schema }: CanvasProps) {
  const { nodes: defaultNodes, edges: defaultEdges } = transformSchemaToReactFlowData.parse(schema);

  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);

  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<
    Omit<TableType, 'id'>
  > | null>(null);

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

      const newNode: TableNodeType = emptyTableNode({
        position,
      });

      reactFlowInstance.addNodes(newNode);
    },
    [reactFlowInstance],
  );

  useAddCreateTableShortcut({ reactFlowInstance });
  const handleSaveSchema = useHandleSaveLocalSchema({ reactFlowInstance });

  return (
    <ReactFlowProvider>
      <div className="h-screen w-full" ref={reactFlowWrapper}>
        <ReactFlow
          defaultNodes={defaultNodes}
          defaultEdges={defaultEdges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onInit={setReactFlowInstance}
          defaultEdgeOptions={{ type: 'floating' }}
          onNodesChange={handleSaveSchema}
          onConnect={() => {
            const edges =
              reactFlowInstance?.getEdges()?.map((edge) => {
                const id = isUuid(edge.id) ? edge.id : crypto.randomUUID();

                return { ...edge, id };
              }) ?? [];

            reactFlowInstance?.setEdges(edges);
          }}
          onConnectEnd={handleSaveSchema}
        >
          <Panel position="top-left">
            <GeneralPropsPanel schema={schema} />
          </Panel>
          <Panel position="top-right">
            <EditorPropsPanel schema={schema} />
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
