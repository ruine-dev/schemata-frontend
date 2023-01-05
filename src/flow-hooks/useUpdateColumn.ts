import { EditorStateContext } from '@/contexts/EditorStateContext';
import { TableWithoutIdType, UpdateColumnType } from '@/schemas/base';
import { useContext } from 'react';
import { useReactFlow } from 'reactflow';

export function useUpdateColumn() {
  const { undoableService } = useContext(EditorStateContext);
  const reactFlowInstance = useReactFlow<TableWithoutIdType>();

  return (columnPayload: UpdateColumnType) => {
    const { tableId, name, isPrimaryKey, ...newColumn } = columnPayload;

    reactFlowInstance.setNodes((currentNodes) => {
      return currentNodes.map((node) => {
        if (node.id === tableId) {
          let newIndexes = node.data.indexes;

          const hasExistingPrimaryKey = !!node.data.indexes.find(
            (index) => index.type === 'PRIMARY_KEY',
          );

          if (hasExistingPrimaryKey) {
            newIndexes = node.data.indexes.map((index) => {
              if (index.type === 'PRIMARY_KEY') {
                return {
                  ...index,
                  columns: isPrimaryKey
                    ? index.columns.concat(newColumn.id)
                    : index.columns.filter((columnId) => columnId !== newColumn.id),
                };
              }
              return index;
            });
          } else if (isPrimaryKey) {
            newIndexes = newIndexes.concat({
              id: crypto.randomUUID(),
              type: 'PRIMARY_KEY',
              columns: [newColumn.id],
            });
          }

          return {
            ...node,
            data: {
              ...node.data,
              columns: node.data.columns.map((column) => {
                if (column.id === newColumn.id) {
                  return {
                    name: name || 'untitled',
                    ...newColumn,
                  };
                }
                return column;
              }),
              indexes: newIndexes,
            },
          };
        }

        return node;
      });
    });

    undoableService.updateData(true);
  };
}
