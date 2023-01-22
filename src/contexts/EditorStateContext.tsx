import { createContext, ReactNode, useMemo, useState } from 'react';
import { useInterpret } from '@xstate/react';
import { copyPasteMachine } from '@/machines/copy-paste-machine';
import { InterpreterFrom } from 'xstate';
import { SchemaType, TableNodeType } from '@/schemas/base';
import { Edge, useReactFlow } from 'reactflow';
import useUndoable from 'use-undoable';
import { useTransformSchemaToReactFlowData } from '@/flow-hooks/useTransformSchemaToReactFlowData';
import { CreateRelationDialogProps } from '@/components/CreateRelationDialog';
import { useHandleSaveLocalSchema } from '@/flow-hooks/useHandleSaveLocalSchema';

type ReactFlowDataType = { nodes: TableNodeType[]; edges: Edge[] };

export const EditorStateContext = createContext({
  copyPasteService: {} as InterpreterFrom<typeof copyPasteMachine>,
  defaults: {} as ReactFlowDataType,
  undoableService: {} as {
    data: ReactFlowDataType;
    setData: (value: (currentData: ReactFlowDataType) => ReactFlowDataType) => void;
    updateData: (forcePass?: boolean) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
  },
  createRelationDialogStore: {} as CreateRelationDialogProps,
});

type EditorStateProviderProps = {
  schema: SchemaType;
  children: ReactNode;
};

export function EditorStateProvider({ schema, children }: EditorStateProviderProps) {
  const copyPasteService = useInterpret(copyPasteMachine);

  const transformSchemaToReactFlowData = useTransformSchemaToReactFlowData();

  const defaults = useMemo(() => transformSchemaToReactFlowData.parse(schema), [schema]);

  const [
    reactFlowData,
    setReactFlowData,
    { undo, redo, canUndo, canRedo, past: pasts, future: futures },
  ] = useUndoable({
    nodes: defaults.nodes,
    edges: defaults.edges,
  });

  const reactFlowInstance = useReactFlow();
  const handleSaveSchema = useHandleSaveLocalSchema(schema.id);

  const updateData = (forcePass?: boolean) => {
    const nodes = reactFlowInstance.getNodes();
    const edges = reactFlowInstance.getEdges();

    const nodePositionsMap = new Map(nodes.map((node) => [node.id, node.position]));

    setReactFlowData((currentData) => {
      if (forcePass) {
        return { edges, nodes };
      }

      const isPositionChanged = !!currentData.nodes.find((node) => {
        const newPosition = nodePositionsMap.get(node.id);

        return node.position.x !== newPosition?.x && node.position.y !== newPosition?.y;
      });

      const isNodeCountChanged = currentData.nodes.length !== nodes.length;

      if (!isPositionChanged && !isNodeCountChanged) {
        return currentData;
      }

      return { edges, nodes };
    });

    handleSaveSchema();
  };

  const handleUndo = () => {
    undo();

    const [past] = pasts.slice(-1);

    reactFlowInstance.setNodes(past.nodes);
    reactFlowInstance.setEdges(past.edges);
  };

  const handleRedo = () => {
    redo();

    const [future] = futures.slice(0, 1);

    reactFlowInstance.setNodes(future.nodes);
    reactFlowInstance.setEdges(future.edges);
  };

  const [createRelationDialogState, setCreateRelationDialogState] = useState<{
    source: CreateRelationDialogProps['source'];
  }>({
    source: null,
  });

  return (
    <EditorStateContext.Provider
      value={{
        copyPasteService,
        defaults,
        undoableService: {
          data: reactFlowData,
          setData: setReactFlowData,
          updateData,
          undo: handleUndo,
          redo: handleRedo,
          canUndo,
          canRedo,
        },
        createRelationDialogStore: {
          source: createRelationDialogState.source,
          setSource(source: CreateRelationDialogProps['source']) {
            setCreateRelationDialogState((currentState) => ({ ...currentState, source }));
          },
        },
      }}
    >
      {children}
    </EditorStateContext.Provider>
  );
}
