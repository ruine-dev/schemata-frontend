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
  RelationType,
  SchemaType,
  TableNodeType,
  TableType,
  TableTypeWithoutId,
  transformSchemaToReactFlowData,
} from '@/schemas/base';
import {
  emptyTableNode,
  getColumnIdFromHandleId,
  getHandlePositionFromHandleId,
} from '@/utils/reactflow';
import { useAddCreateTableShortcut } from '@/flow-hooks/useAddCreateTableShortcut';
import { useHandleSaveLocalSchema } from '@/flow-hooks/useHandleSaveLocalSchema';
import { isUuid } from '@/utils/zod';
import { useHandleEdgeMarker } from '@/flow-hooks/useHandleEdgeMarker';

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

  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance<TableTypeWithoutId> | null>(null);

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
  const handleEdgeMarker = useHandleEdgeMarker({ reactFlowInstance });

  return (
    <ReactFlowProvider>
      <svg
        style={{ position: 'absolute', top: 0, left: 0 }}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-slate-400"
      >
        <defs>
          <marker
            id="many"
            viewBox="0 0 40 40"
            markerUnits="strokeWidth"
            markerHeight={24}
            markerWidth={24}
            refX={16}
            refY={12}
            orient="auto-start-reverse"
          >
            <g clipPath="url(#clip0_2_2)">
              <line
                x1="8.38268"
                y1="12.0761"
                x2="30.5558"
                y2="21.2605"
                stroke="currentColor"
                strokeWidth={1.7}
              />
              <line
                x1="7.96732"
                y1="12.0761"
                x2="30.1404"
                y2="2.89172"
                stroke="currentColor"
                strokeWidth={1.7}
              />
              <line y1="12" x2="24" y2="12" stroke="currentColor" strokeWidth={1.7} />
            </g>
            <defs>
              <clipPath id="clip0_2_2">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </marker>
          <marker
            id="one"
            viewBox="0 0 40 40"
            markerUnits="strokeWidth"
            markerHeight={24}
            markerWidth={24}
            refX={16}
            refY={12}
            orient="auto-start-reverse"
          >
            <line x1="8" y1="20" x2="8" y2="4" stroke="currentColor" strokeWidth={1.7} />
            <line y1="12" x2="24" y2="12" stroke="currentColor" strokeWidth={1.7} />
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
