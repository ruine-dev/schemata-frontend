import { EditorStateContext } from '@/contexts/EditorStateContext';
import { ColumnType, TableType, TableWithoutIdType } from '@/schemas/base';
import { useContext } from 'react';
import { useReactFlow } from 'reactflow';
import { arrayMove } from '@dnd-kit/sortable';

type ReorderColumnType = {
  movedColumnId: ColumnType['id'];
  hoveredColumnId: ColumnType['id'];
  tableId: TableType['id'];
};

export function useReorderColumn() {
  const { undoableService } = useContext(EditorStateContext);
  const reactFlowInstance = useReactFlow<TableWithoutIdType>();

  return (reorderPayload: ReorderColumnType) => {
    const { movedColumnId, hoveredColumnId, tableId } = reorderPayload;

    reactFlowInstance.setNodes((currentNodes) => {
      return currentNodes.map((node) => {
        if (node.id !== tableId) {
          return node;
        }

        const movedColumnIndex = node.data.columns.findIndex(
          (column) => column.id === movedColumnId,
        );
        const hoveredColumnIndex = node.data.columns.findIndex(
          (column) => column.id === hoveredColumnId,
        );

        const finalColumns = arrayMove(node.data.columns, movedColumnIndex, hoveredColumnIndex);

        return {
          ...node,
          data: {
            ...node.data,
            columns: finalColumns,
          },
        };
      });
    });

    undoableService.updateData(true);
  };
}
