import { EditorStateContext } from '@/contexts/EditorStateContext';
import { ColumnType, TableType, TableWithoutIdType } from '@/schemas/base';
import { useContext } from 'react';
import { useReactFlow } from 'reactflow';

type ReorderColumnType = {
  dragIndex: ColumnType['index'];
  hoverIndex: ColumnType['index'];
  tableId: TableType['id'];
};

export function useReorderColumn() {
  const { undoableService } = useContext(EditorStateContext);
  const reactFlowInstance = useReactFlow<TableWithoutIdType>();

  return (reorderPayload: ReorderColumnType) => {
    const { dragIndex, hoverIndex, tableId } = reorderPayload;

    reactFlowInstance.setNodes((currentNodes) => {
      return currentNodes.map((node) => {
        if (node.id !== tableId) {
          return node;
        }

        return {
          ...node,
          data: {
            ...node.data,
            columns: node.data.columns.map((column) => {
              if (column.index === dragIndex) {
                return { ...column, index: hoverIndex };
              }

              if (column.index === hoverIndex) {
                return { ...column, index: dragIndex };
              }

              return column;
            }),
          },
        };
      });
    });

    undoableService.updateData(true);
  };
}
