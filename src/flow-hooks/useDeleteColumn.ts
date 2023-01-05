import { EditorStateContext } from '@/contexts/EditorStateContext';
import { DeleteColumnType, TableWithoutIdType } from '@/schemas/base';
import { getColumnIdFromHandleId } from '@/utils/reactflow';
import { useContext } from 'react';
import { useReactFlow } from 'reactflow';

export function useDeleteColumn() {
  const { undoableService } = useContext(EditorStateContext);
  const reactFlowInstance = useReactFlow<TableWithoutIdType>();

  return (columnPayload: DeleteColumnType) => {
    const { tableId, id } = columnPayload;

    reactFlowInstance.setNodes((currentNodes) => {
      return currentNodes.map((node) => {
        if (node.id === tableId) {
          return {
            ...node,
            data: {
              ...node.data,
              columns: node.data.columns.filter((column) => column.id !== id),
            },
          };
        }

        return node;
      });
    });

    reactFlowInstance.setEdges((currentEdges) => {
      return currentEdges.filter((edge) => {
        return (
          edge.targetHandle &&
          getColumnIdFromHandleId(edge.targetHandle) !== id &&
          edge.sourceHandle &&
          getColumnIdFromHandleId(edge.sourceHandle) !== id
        );
      });
    });

    undoableService.updateData(true);
  };
}
