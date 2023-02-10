import { useReactFlow } from 'reactflow';
import { useContext } from 'react';
import { EditorStateContext } from '@/contexts/EditorStateContext';
import { useHandleEdgeMarker } from './useHandleEdgeMarker';
import { TableWithoutIdType } from '@/schemas/table';
import { EdgeType, CreateRelationType, RelationEdgeType } from '@/schemas/relation';

export function useCreateRelation() {
  const { undoableService } = useContext(EditorStateContext);
  const reactFlowInstance = useReactFlow<TableWithoutIdType, EdgeType>();
  const handleEdgeMarker = useHandleEdgeMarker();

  return (newRelation: CreateRelationType) => {
    const newEdge: RelationEdgeType = {
      id: crypto.randomUUID(),
      source: newRelation.source.tableId,
      target: newRelation.target.tableId,
      sourceHandle: `${newRelation.source.columnId}-source-right`,
      targetHandle: `${newRelation.target.columnId}-target`,
      data: {
        name: newRelation.name,
        sourceColumnId: newRelation.source.columnId,
        targetColumnId: newRelation.target.columnId,
        actions: newRelation.actions,
      },
    };

    const { markerEnd, markerStart } = handleEdgeMarker(newEdge);

    reactFlowInstance.addEdges({
      ...newEdge,
      markerEnd,
      markerStart,
    });

    undoableService.updateData(true);
  };
}
