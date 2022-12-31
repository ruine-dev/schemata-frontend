import { DragEventHandler, useCallback, useState, useRef, useEffect, useMemo } from 'react';
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
import { useAddCreateTableShortcut } from '@/flow-hooks/useAddCreateTableShortcut';
import { useHandleSaveLocalSchema } from '@/flow-hooks/useHandleSaveLocalSchema';
import { isUuid } from '@/utils/zod';
import { useHandleEdgeMarker } from '@/flow-hooks/useHandleEdgeMarker';
import { useTransformSchemaToReactFlowData } from '@/flow-hooks/useTransformSchemaToReactFlowData';
import { Markers } from './Markers';
import { useHandleCreateTableOnDrop } from '@/flow-hooks/useHandleCreateTableOnDrop';
import useUndoable from 'use-undoable';
import { appendDataChangeListenerToNodes } from '@/utils/reactflow';

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
  const { nodes: preDefaultNodes, edges: defaultEdges } = useMemo(
    () => transformSchemaToReactFlowData.parse(schema),
    [schema],
  );

  const [reactFlowData, setReactFlowData, { undo, redo, canUndo, canRedo }] = useUndoable({
    nodes: preDefaultNodes,
    edges: defaultEdges,
  });

  const handleUpdateReactFlowDataNode = () => {
    const nodes = reactFlowInstance?.getNodes() ?? [];

    const nodePositionsMap = new Map(nodes.map((node) => [node.id, node.position]));

    setReactFlowData((currentData) => {
      const isPositionChanged = !!currentData.nodes.find((node) => {
        const newPosition = nodePositionsMap.get(node.id);

        return node.position.x !== newPosition?.x && node.position.y !== newPosition?.y;
      });

      const isNodeCountChanged = currentData.nodes.length !== nodes.length;

      if (!isPositionChanged && !isNodeCountChanged) {
        return currentData;
      }

      return { ...currentData, nodes };
    });
  };

  const handleUpdateReactFlowDataEdge = () => {
    const edges = reactFlowInstance?.getEdges() ?? [];

    setReactFlowData((currentData) => ({ ...currentData, edges }));
  };

  const defaultNodes: TableNodeType[] = useMemo(
    () =>
      appendDataChangeListenerToNodes({
        nodes: preDefaultNodes,
        onDataChange() {
          const nodes = reactFlowInstance?.getNodes() ?? [];
          const edges = reactFlowInstance?.getEdges() ?? [];

          setReactFlowData({ edges, nodes });
        },
      }),
    [preDefaultNodes],
  );

  const onDragOver: DragEventHandler<HTMLDivElement> = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop: DragEventHandler<HTMLDivElement> = useHandleCreateTableOnDrop(
    {
      reactFlowInstance,
      reactFlowWrapper,
    },
    handleUpdateReactFlowDataNode,
  );

  useAddCreateTableShortcut({ reactFlowInstance }, handleUpdateReactFlowDataNode);
  const handleSaveSchema = useHandleSaveLocalSchema({ reactFlowInstance });
  const handleEdgeMarker = useHandleEdgeMarker({ reactFlowInstance });

  useEffect(() => {
    const handleUndoRedoShortcut = (e: KeyboardEvent) => {
      if (
        !(
          document.activeElement instanceof HTMLDivElement ||
          document.activeElement instanceof HTMLBodyElement
        )
      ) {
        return;
      }

      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        e.stopPropagation();

        undo();
      }

      if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        e.stopPropagation();

        redo();
      }
    };

    document.body.addEventListener('keydown', handleUndoRedoShortcut);

    return () => {
      document.body.removeEventListener('keydown', handleUndoRedoShortcut);
    };
  });

  useEffect(() => {
    reactFlowInstance?.setNodes(reactFlowData.nodes);
    reactFlowInstance?.setEdges(reactFlowData.edges);
  }, [reactFlowData]);

  return (
    <ReactFlowProvider>
      <Markers />
      <div className="h-screen w-full" ref={reactFlowWrapper}>
        <ReactFlow
          id="canvas"
          defaultNodes={defaultNodes}
          defaultEdges={defaultEdges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onInit={setReactFlowInstance}
          elevateEdgesOnSelect
          defaultEdgeOptions={{ type: 'floating' }}
          onNodesDelete={handleUpdateReactFlowDataNode}
          onEdgesDelete={handleUpdateReactFlowDataEdge}
          onNodeDragStop={handleUpdateReactFlowDataNode}
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
          onConnectEnd={() => {
            handleSaveSchema();

            handleUpdateReactFlowDataEdge();
          }}
        >
          <Panel position="top-left">
            <GeneralPropsPanel schema={schema} />
          </Panel>
          <Panel position="top-right">
            <EditorPropsPanel schema={schema} />
          </Panel>
          <Panel position="bottom-center">
            <ToolbarPanel
              canUndo={canUndo}
              canRedo={canRedo}
              handleUndo={undo}
              handleRedo={redo}
              onCreateTable={handleUpdateReactFlowDataNode}
            />
          </Panel>
          <Background className="bg-white" />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}
