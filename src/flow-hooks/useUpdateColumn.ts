import { EditorStateContext } from '@/contexts/EditorStateContext';
import { IndexType } from '@/schemas/base';
import { TableWithoutIdType } from '@/schemas/table';
import { UpdateColumnType } from '@/schemas/update-column';
import { getColumnIdFromHandleId } from '@/utils/reactflow';
import { useContext } from 'react';
import { Node, useReactFlow } from 'reactflow';
import { useHandleEdgeMarker } from './useHandleEdgeMarker';

export function useUpdateColumn() {
  const { undoableService } = useContext(EditorStateContext);
  const reactFlowInstance = useReactFlow<TableWithoutIdType>();
  const handleEdgeMarker = useHandleEdgeMarker();

  return (columnPayload: UpdateColumnType) => {
    const { tableId, name, isPrimaryKey, isUniqueIndex, ...newColumn } = columnPayload;

    let changedUniqueIndexData:
      | undefined
      | {
          indexes: IndexType[];
          nodeId: Node['id'];
        };

    reactFlowInstance.setNodes((currentNodes) => {
      return currentNodes.map((node) => {
        if (node.id !== tableId) {
          return node;
        }

        let newIndexes = node.data.indexes;

        const hasExistingPrimaryKey = !!node.data.indexes.find(
          (index) => index.type === 'PRIMARY_KEY',
        );

        if (hasExistingPrimaryKey) {
          newIndexes = node.data.indexes.map((index) => {
            if (index.type !== 'PRIMARY_KEY') {
              return index;
            }
            return {
              ...index,
              columns: isPrimaryKey
                ? Array.from(new Set(index.columns.concat(newColumn.id)))
                : index.columns.filter((columnId) => columnId !== newColumn.id),
            };
          });
        } else if (isPrimaryKey) {
          newIndexes = newIndexes.concat({
            id: crypto.randomUUID(),
            type: 'PRIMARY_KEY',
            columns: [newColumn.id],
          });
        }

        const hasExistingUniqueIndex = !!newIndexes.find((index) => index.type === 'UNIQUE_INDEX');

        if (hasExistingUniqueIndex) {
          newIndexes = newIndexes.map((index) => {
            if (index.type !== 'UNIQUE_INDEX') {
              return index;
            }

            return {
              ...index,
              columns: isUniqueIndex
                ? Array.from(new Set(index.columns.concat(newColumn.id)))
                : index.columns.filter((columnId) => columnId !== newColumn.id),
            };
          });
        } else if (isUniqueIndex) {
          newIndexes = newIndexes.concat({
            id: crypto.randomUUID(),
            type: 'UNIQUE_INDEX',
            columns: [newColumn.id],
          });
        }

        if (
          newIndexes.find((index) => index.type === 'UNIQUE_INDEX')?.columns.length !==
          node.data.indexes.find((index) => index.type === 'UNIQUE_INDEX')?.columns.length
        ) {
          changedUniqueIndexData = {
            indexes: newIndexes,
            nodeId: node.id,
          };
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
      });
    });

    if (changedUniqueIndexData) {
      reactFlowInstance.setEdges((edges) => {
        return edges.map((edge) => {
          const { markerEnd, markerStart } = handleEdgeMarker(
            edge,
            edge.source === changedUniqueIndexData?.nodeId
              ? changedUniqueIndexData.indexes
              : undefined,
          );

          return {
            ...edge,
            markerEnd,
            markerStart,
            data: {
              sourceColumnId: getColumnIdFromHandleId(edge.sourceHandle as string),
              targetColumnId: getColumnIdFromHandleId(edge.targetHandle as string),
            },
          };
        });
      });
    }

    undoableService.updateData(true);
  };
}
