import { TableTypeWithoutId, UpdateColumnType } from '@/schemas/base';
import { useReactFlow } from 'reactflow';

export function useUpdateTableColumn() {
  const reactFlowInstance = useReactFlow<TableTypeWithoutId>();

  return (columnPayload: UpdateColumnType) => {
    const { tableId, name, isPrimaryKey, ...newColumn } = columnPayload;

    reactFlowInstance.setNodes((currentNodes) => {
      return currentNodes.map((node) => {
        if (node.id === tableId) {
          let newIndexes = node.data.indexes;

          if (isPrimaryKey) {
            const hasExistingPrimaryKey = !!node.data.indexes.find(
              (index) => index.type === 'PRIMARY_KEY',
            );

            if (hasExistingPrimaryKey) {
              newIndexes = node.data.indexes.map((index) => {
                if (index.type === 'PRIMARY_KEY') {
                  return {
                    ...index,
                    columns: [...index.columns, newColumn.id],
                  };
                }
                return index;
              });
            } else {
              newIndexes = newIndexes.concat({
                id: crypto.randomUUID(),
                type: 'PRIMARY_KEY',
                columns: [newColumn.id],
              });
            }
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
  };
}
