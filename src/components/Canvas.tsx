import { DragEventHandler, useCallback, useRef, useEffect, useContext, MouseEvent } from 'react';
import ReactFlow, { Background, EdgeTypes, NodeTypes, Panel, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';
import { TableNode } from './TableNode';
import { GeneralPropsPanel } from './GeneralPropsPanel';
import { EditorPropsPanel } from './EditorPropsPanel';
import { ToolbarPanel } from './ToolbarPanel';
import { SimpleFloatingEdge } from './ReactFlow/SimpleFloatingEdge';
import { SchemaType } from '@/schemas/base';
import { useAddCreateTableShortcut } from '@/flow-hooks/useAddCreateTableShortcut';
import { useHandleSaveLocalSchema } from '@/flow-hooks/useHandleSaveLocalSchema';
import { isUuid } from '@/utils/zod';
import { useHandleEdgeMarker } from '@/flow-hooks/useHandleEdgeMarker';
import { Markers } from './Markers';
import { useHandleCreateTableOnDrop } from '@/flow-hooks/useHandleCreateTableOnDrop';
import { emptyTableWithoutId } from '@/utils/reactflow';
import { ContextMenu } from './ContextMenu';
import { EditorStateContext } from '@/contexts/EditorStateContext';
import { useCreateTable } from '@/flow-hooks/useCreateTable';
import { UtilsPanel } from './UtilsPanel';
import { AddTableIcon } from './Icon/AddTableIcon';
import { ClipboardIcon } from '@heroicons/react/20/solid';

const nodeTypes: NodeTypes = { table: TableNode } as unknown as NodeTypes;

const edgeTypes: EdgeTypes = {
  floating: SimpleFloatingEdge,
};

type CanvasProps = {
  schema: SchemaType;
};

export function Canvas({ schema }: CanvasProps) {
  const reactFlowInstance = useReactFlow();
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);

  const { copyPasteService, defaults, undoableService } = useContext(EditorStateContext);

  const onDragOver: DragEventHandler<HTMLDivElement> = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop: DragEventHandler<HTMLDivElement> = useHandleCreateTableOnDrop({
    reactFlowWrapper,
  });

  useAddCreateTableShortcut();
  const handleSaveSchema = useHandleSaveLocalSchema(schema.id);
  const handleEdgeMarker = useHandleEdgeMarker();

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

        undoableService.undo();
      }

      if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        e.stopPropagation();

        undoableService.redo();
      }
    };

    document.body.addEventListener('keydown', handleUndoRedoShortcut);

    return () => {
      document.body.removeEventListener('keydown', handleUndoRedoShortcut);
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

  const triggerPaste = (e: MouseEvent) => {
    const {
      context: { clipboard },
    } = copyPasteService.getSnapshot();

    const position = reactFlowInstance.project({
      x: e.clientX,
      y: e.clientY,
    });

    if (clipboard.status === 'COPIED' && clipboard.type === 'TABLE') {
      const { id, ...payloadWithoutId } = clipboard.payload;

      createTable(payloadWithoutId, position);
    } else if (clipboard.status === 'CUT' && clipboard.type === 'TABLE') {
      createTable(clipboard.payload, position);
    }
  };

  const canPaste = copyPasteService.getSnapshot().matches('FILLED_CLIPBOARD');

  return (
    <>
      <ContextMenu
        menu={[
          {
            label: 'Add table',
            'data-test': 'pane-context-menu-add-table',
            icon: AddTableIcon,
            onClick: triggerCreateTable,
            kbd: 'T',
          },
          {
            label: 'Paste',
            'data-test': 'pane-context-menu-paste',
            icon: ClipboardIcon,
            onClick: triggerPaste,
            disabled: !canPaste,
            kbd: 'CTRL + V',
          },
        ]}
      >
        <div className="h-screen w-full" ref={reactFlowWrapper}>
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
            onNodesChange={handleSaveSchema}
            onEdgesChange={handleSaveSchema}
            onConnect={() => {
              const edges =
                reactFlowInstance.getEdges().map((edge) => {
                  const id = isUuid(edge.id) ? edge.id : crypto.randomUUID();
                  const { markerEnd, markerStart } = handleEdgeMarker(edge);
                  return {
                    ...edge,
                    id,
                    markerEnd,
                    markerStart,
                  };
                }) ?? [];
              reactFlowInstance.setEdges(edges);
            }}
            onConnectEnd={() => {
              handleSaveSchema();
              undoableService.updateData(true);
            }}
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
    </>
  );
}
