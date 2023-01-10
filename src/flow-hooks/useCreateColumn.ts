import { EditorStateContext } from '@/contexts/EditorStateContext';
import { CreateColumnSchema, CreateColumnType, TableWithoutIdType } from '@/schemas/base';
import { useContext } from 'react';
import { useReactFlow } from 'reactflow';

export function useCreateColumn() {
  const { undoableService } = useContext(EditorStateContext);
  const reactFlowInstance = useReactFlow<TableWithoutIdType>();

  return (columnPayload: CreateColumnType) => {
    const { tableId, ...newColumn } = CreateColumnSchema.parse(columnPayload);

    reactFlowInstance.setNodes((currentNodes) => {
      return currentNodes.map((node) => {
        if (node.id === tableId) {
          return {
            ...node,
            data: {
              ...node.data,
              columns: [
                ...node.data.columns,
                {
                  id: crypto.randomUUID(),
                  index: node.data.columns.length,
                  ...newColumn,
                },
              ],
            },
          };
        }

        return node;
      });
    });

    if (newColumn.name !== '') {
      undoableService.updateData(true);
    }
  };
}
