import { EditorStateContext } from '@/contexts/EditorStateContext';
import {
  ColumnType,
  CreateColumnSchema,
  CreateColumnType,
  TableWithoutIdType,
} from '@/schemas/base';
import { useContext } from 'react';
import { useReactFlow } from 'reactflow';

export function useCreateColumn() {
  const { undoableService } = useContext(EditorStateContext);
  const reactFlowInstance = useReactFlow<TableWithoutIdType>();

  return (columnPayload: CreateColumnType) => {
    const { tableId, ...newColumn } = CreateColumnSchema.parse(columnPayload);

    reactFlowInstance.setNodes((currentNodes) => {
      return currentNodes.map((node) => {
        if (node.id !== tableId) {
          return node;
        }

        let newColumns = node.data.columns
          .concat({
            id: crypto.randomUUID(),
            ...newColumn,
            index: newColumn.index ?? node.data.columns.length,
          })
          .sort((a, b) => a.index - b.index)
          .map((column, index) => ({ ...column, index }));

        return {
          ...node,
          data: {
            ...node.data,
            columns: newColumns,
          },
        };
      });
    });

    if (newColumn.name !== '') {
      undoableService.updateData(true);
    }
  };
}
