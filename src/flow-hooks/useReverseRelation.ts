import { useReactFlow } from 'reactflow';
import { useContext } from 'react';
import { EditorStateContext } from '@/contexts/EditorStateContext';
import { TableWithoutIdType } from '@/schemas/table';
import { EdgeType, RelationType } from '@/schemas/relation';

export function useReverseRelation() {
  const { undoableService } = useContext(EditorStateContext);
  const reactFlowInstance = useReactFlow<TableWithoutIdType, EdgeType>();

  return (relationId: RelationType['id']) => {
    reactFlowInstance.setEdges((edges) => {
      return edges.map((edge) => {
        if (edge.id !== relationId) {
          return edge;
        }

        return {
          ...edge,
          source: edge.target,
          sourceHandle: `${edge.data?.targetColumnId}-source-right`,
          target: edge.source,
          targetHandle: `${edge.data?.sourceColumnId}-target`,
          ...(edge.data
            ? {
                data: {
                  name: edge.data.name,
                  actions: edge.data.actions,
                  sourceColumnId: edge.data.targetColumnId,
                  targetColumnId: edge.data.sourceColumnId,
                },
              }
            : {}),
        };
      });
    });

    undoableService.updateData(true);
  };
}
