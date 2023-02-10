import {
  DragEventHandler,
  useCallback,
  useRef,
  useEffect,
  useContext,
  MouseEvent,
  useState,
} from 'react';
import ReactFlow, { Background, EdgeTypes, NodeTypes, Panel, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';
import { TableNode } from './TableNode';
import { GeneralPropsPanel } from './GeneralPropsPanel';
import { EditorPropsPanel } from './EditorPropsPanel';
import { ToolbarPanel } from './ToolbarPanel';
import { SimpleFloatingEdge } from './ReactFlow/SimpleFloatingEdge';
import { useAddCreateTableShortcut } from '@/flow-hooks/useAddCreateTableShortcut';
import { useHandleSaveLocalSchema } from '@/flow-hooks/useHandleSaveLocalSchema';
import { isUuid } from '@/utils/zod';
import { useHandleEdgeMarker } from '@/flow-hooks/useHandleEdgeMarker';
import { Markers } from './Markers';
import { useHandleCreateTableOnDrop } from '@/flow-hooks/useHandleCreateTableOnDrop';
import { emptyTableWithoutId, getColumnIdFromHandleId } from '@/utils/reactflow';
import { ContextMenu } from './ContextMenu';
import { EditorStateContext } from '@/contexts/EditorStateContext';
import { useCreateTable } from '@/flow-hooks/useCreateTable';
import { UtilsPanel } from './UtilsPanel';
import { AddTableIcon } from './Icon/AddTableIcon';
import { ClipboardIcon } from '@heroicons/react/20/solid';
import { TableWithoutIdType } from '@/schemas/table';
import { SchemaType } from '@/schemas/schema';
import { EdgeType } from '@/schemas/relation';

const nodeTypes: NodeTypes = { table: TableNode } as unknown as NodeTypes;

const edgeTypes: EdgeTypes = {
  floating: SimpleFloatingEdge,
};

type CanvasProps = {
  schema: SchemaType;
};

export function Canvas({ schema }: CanvasProps) {
  const reactFlowInstance = useReactFlow<TableWithoutIdType, EdgeType>();
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);

  const { copyPasteService, defaults, undoableService } = useContext(EditorStateContext);

  const onDragOver: DragEventHandler<HTMLDivElement> = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop: DragEventHandler<HTMLDivElement> = useHandleCreateTableOnDrop({
    reactFlowWrapper,
  });

  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useAddCreateTableShortcut(cursorPosition);
  const handleEdgeMarker = useHandleEdgeMarker();

  const triggerPaste = (position: { x: number; y: number }) => {
    const {
      context: { clipboard },
    } = copyPasteService.getSnapshot();

    const finalPosition = reactFlowInstance.project(position);

    if (clipboard.status === 'COPIED' && clipboard.type === 'TABLE') {
      const { id, ...payloadWithoutId } = clipboard.payload;

      createTable(payloadWithoutId, finalPosition);
    } else if (clipboard.status === 'CUT' && clipboard.type === 'TABLE') {
      createTable(clipboard.payload, finalPosition);
    }
  };

  useEffect(() => {
    const registerUndoRedoShortcut = (e: KeyboardEvent) => {
      if (
        !(
          document.activeElement instanceof HTMLDivElement ||
          document.activeElement instanceof HTMLBodyElement
        )
      ) {
        return;
      }

      if (e.target === e.currentTarget && e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        e.stopPropagation();

        undoableService.undo();
      }

      if (e.target === e.currentTarget && e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        e.stopPropagation();

        undoableService.redo();
      }
    };

    const registerPasteShortcut = (e: KeyboardEvent) => {
      if (e.target === e.currentTarget && e.ctrlKey && e.key === 'v') {
        e.preventDefault();
        e.stopPropagation();
        triggerPaste(cursorPosition);
      }
    };

    document.body.addEventListener('keydown', registerUndoRedoShortcut);
    document.body.addEventListener('keydown', registerPasteShortcut);

    return () => {
      document.body.removeEventListener('keydown', registerUndoRedoShortcut);
      document.body.removeEventListener('keydown', registerPasteShortcut);
    };
  });

  const createTable = useCreateTable();

  const triggerCreateTable = (e: MouseEvent) => {
    const position = reactFlowInstance.project({
      x: e.clientX,
      y: e.clientY,
    });

    createTable(emptyTableWithoutId(), position);
  };

  const canPaste = copyPasteService.getSnapshot().matches('FILLED_CLIPBOARD');

  return (
    <ContextMenu
      menu={[
        {
          label: 'Add table',
          'data-test': 'canvas-context-menu-add-table',
          icon: AddTableIcon,
          onClick: triggerCreateTable,
          kbd: 'T',
        },
        {
          label: 'Paste',
          'data-test': 'canvas-context-menu-paste',
          icon: ClipboardIcon,
          onClick: (e) => triggerPaste({ x: e.clientX, y: e.clientY }),
          disabled: !canPaste,
          kbd: 'CTRL + V',
        },
      ]}
    >
      <div ref={reactFlowWrapper} className="h-screen w-full">
        <ReactFlow
          id="canvas"
          defaultNodes={defaults.nodes}
          defaultEdges={defaults.edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onDragOver={onDragOver}
          onDrop={onDrop}
          elevateEdgesOnSelect
          defaultEdgeOptions={{ type: 'floating' }}
          onNodesDelete={() => undoableService.updateData(true)}
          onEdgesDelete={() => undoableService.updateData(true)}
          onNodeDragStop={() => undoableService.updateData(true)}
          onConnect={() => {
            const edges =
              reactFlowInstance.getEdges().map((edge) => {
                if (isUuid(edge.id)) {
                  return edge;
                }

                const { markerEnd, markerStart } = handleEdgeMarker(edge);

                const sourceTable = reactFlowInstance
                  .getNodes()
                  .find((node) => node.id === edge.source)?.data;

                const targetTable = reactFlowInstance
                  .getNodes()
                  .find((node) => node.id === edge.target)?.data;

                const sourceColumnId = getColumnIdFromHandleId(edge.sourceHandle as string);

                const sourceColumn = sourceTable?.columns.find(
                  (column) => column.id === sourceColumnId,
                );

                return {
                  ...edge,
                  id: crypto.randomUUID(),
                  markerEnd,
                  markerStart,
                  data: {
                    name: `fk_${sourceTable?.name}_${targetTable?.name}_${sourceColumn?.name}`,
                    sourceColumnId,
                    targetColumnId: getColumnIdFromHandleId(edge.targetHandle as string),
                    actions: { onUpdate: 'RESTRICT' as const, onDelete: 'RESTRICT' as const },
                  },
                };
              }) ?? [];

            reactFlowInstance.setEdges(edges);
          }}
          onConnectEnd={() => {
            undoableService.updateData(true);
          }}
          onPaneMouseMove={(e) => setCursorPosition({ x: e.clientX, y: e.clientY })}
          data-test="canvas"
        >
          <Markers />
          <Panel position="top-left">
            <GeneralPropsPanel schema={schema} />
          </Panel>
          <Panel position="top-right">
            <EditorPropsPanel schema={schema} />
          </Panel>
          <Panel position="top-center">
            <ToolbarPanel />
          </Panel>
          <Panel position="bottom-left">
            <UtilsPanel />
          </Panel>
          <Background className="bg-white" color="black" />
        </ReactFlow>
      </div>
    </ContextMenu>
  );
}
