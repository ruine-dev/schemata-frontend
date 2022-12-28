import { DragEventHandler, useCallback, useState, useRef, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Edge,
  EdgeTypes,
  MiniMap,
  Node,
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
import { createTableWithInstance } from '@/flow-hooks/useCreateTable';
import { useSaveLocalSchema } from '@/mutations/useSaveLocalSchema';
import { SimpleFloatingEdge } from './ReactFlow/SimpleFloatingEdge';
import {
  PositionType,
  SchemaType,
  TableNodeType,
  TableType,
  transformSchemaToReactFlowData,
} from '@/schemas/base';
import { emptyTableNode, tableNodeToPosition, tableNodeToTable } from '@/utils/reactflow';

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
          emptyTableNode({
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

  const { mutate: saveLocalSchema } = useSaveLocalSchema();

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
          onNodesChange={() => {
            const tables: TableType[] =
              reactFlowInstance?.getNodes().map((node) => tableNodeToTable(node)) ?? [];

            const positions: PositionType[] =
              reactFlowInstance?.getNodes().map((node) => tableNodeToPosition(node)) ?? [];

            saveLocalSchema((currentDatabase) => ({
              ...currentDatabase,
              tables,
              positions,
            }));
          }}
          onConnect={(connection) => {
            // const tableRelations = TableRelationSchema.array().safeParse(
            //   reactFlowInstance?.getEdges().map((edge) => edgeToTableRelation(edge)),
            // );
            console.log(connection);
            // console.log(reactFlowInstance?.getEdges());

            // saveDatabaseLocal((currentDatabase) => ({
            //   ...currentDatabase,
            //   relations: tableRelations.success ? tableRelations.data : currentDatabase.relations,
            // }));
            return;
          }}
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
