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
import { SchemaType, TableNodeType, TableTypeWithoutId } from '@/schemas/base';
import { emptyTableNode } from '@/utils/reactflow';
import { useAddCreateTableShortcut } from '@/flow-hooks/useAddCreateTableShortcut';
import { useHandleSaveLocalSchema } from '@/flow-hooks/useHandleSaveLocalSchema';
import { isUuid } from '@/utils/zod';
import { useHandleEdgeMarker } from '@/flow-hooks/useHandleEdgeMarker';
import { useTransformSchemaToReactFlowData } from '@/flow-hooks/useTransformSchemaToReactFlowData';

const nodeTypes: NodeTypes = { table: TableNode } as unknown as NodeTypes;

const edgeTypes: EdgeTypes = {
  floating: SimpleFloatingEdge,
};

interface CanvasProps {
  schema: SchemaType;
}

export function Canvas({ schema }: CanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);

  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance<TableTypeWithoutId> | null>(null);

  const transformSchemaToReactFlowData = useTransformSchemaToReactFlowData({ reactFlowInstance });
  const { nodes: defaultNodes, edges: defaultEdges } = transformSchemaToReactFlowData.parse(schema);

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

      if (!type) {
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
  const handleEdgeMarker = useHandleEdgeMarker({ reactFlowInstance });

  return (
    <ReactFlowProvider>
      <svg
        style={{ position: 'absolute', top: 0, left: 0 }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker
            id="many"
            viewBox="0 0 10 20"
            markerUnits="strokeWidth"
            markerHeight={20}
            markerWidth={10}
            refX={7}
            refY={10}
            orient="auto-start-reverse"
            className="text-slate-400"
          >
            <g clipPath="url(#clip0_2_2)">
              <line
                x1="0.382683"
                y1="10.2605"
                x2="22.5558"
                y2="19.4449"
                stroke="currentColor"
                strokeWidth={1}
              />
              <line
                x1="-0.0326773"
                y1="10.2605"
                x2="22.1404"
                y2="1.07612"
                stroke="currentColor"
                strokeWidth={1}
              />
              <line y1="10.1844" x2="20" y2="10.1844" stroke="currentColor" strokeWidth={1} />
            </g>
            <defs>
              <clipPath id="clip0_2_2">
                <rect width="11" height="20" fill="white" />
              </clipPath>
            </defs>
          </marker>
          <marker
            id="one"
            viewBox="0 0 10 20"
            markerUnits="strokeWidth"
            markerHeight={20}
            markerWidth={10}
            refX={7}
            refY={9.5}
            orient="auto-start-reverse"
            className="text-slate-400"
          >
            <line x1="1" y1="16" x2="1" y2="4" stroke="currentColor" strokeWidth={1} />
            <line x1="2" y1="9.5" x2="10" y2="9.5" stroke="currentColor" strokeWidth={1} />
          </marker>
        </defs>
      </svg>

      <div className="h-screen w-full" ref={reactFlowWrapper}>
        <ReactFlow
          defaultNodes={defaultNodes}
          defaultEdges={defaultEdges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onInit={setReactFlowInstance}
          elevateEdgesOnSelect
          defaultEdgeOptions={{ type: 'floating' }}
          onNodesChange={handleSaveSchema}
          onConnect={() => {
            const edges =
              reactFlowInstance?.getEdges()?.map((edge) => {
                const id = isUuid(edge.id) ? edge.id : crypto.randomUUID();

                const { markerEnd, markerStart } = handleEdgeMarker(edge);

                return {
                  ...edge,
                  id,
                  markerEnd,
                  markerStart,
                };
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
