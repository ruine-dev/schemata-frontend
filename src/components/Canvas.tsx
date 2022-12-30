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
import { SchemaType, TableTypeWithoutId } from '@/schemas/base';
import { useAddCreateTableShortcut } from '@/flow-hooks/useAddCreateTableShortcut';
import { useHandleSaveLocalSchema } from '@/flow-hooks/useHandleSaveLocalSchema';
import { isUuid } from '@/utils/zod';
import { useHandleEdgeMarker } from '@/flow-hooks/useHandleEdgeMarker';
import { useTransformSchemaToReactFlowData } from '@/flow-hooks/useTransformSchemaToReactFlowData';
import { Markers } from './Markers';
import { useHandleCreateTableOnDrop } from '@/flow-hooks/useHandleCreateTableOnDrop';

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

  const onDrop: DragEventHandler<HTMLDivElement> = useHandleCreateTableOnDrop({
    reactFlowInstance,
    reactFlowWrapper,
  });

  useAddCreateTableShortcut({ reactFlowInstance });
  const handleSaveSchema = useHandleSaveLocalSchema({ reactFlowInstance });
  const handleEdgeMarker = useHandleEdgeMarker({ reactFlowInstance });

  return (
    <ReactFlowProvider>
      <Markers />
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
          onEdgesChange={handleSaveSchema}
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
