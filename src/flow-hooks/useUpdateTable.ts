import { EditorStateContext } from '@/contexts/EditorStateContext';
import { TableType, TableWithoutIdType } from '@/schemas/table';
import { useContext } from 'react';
import { useReactFlow } from 'reactflow';

export function useUpdateTable() {
  const { undoableService } = useContext(EditorStateContext);
  const reactFlowInstance = useReactFlow<TableWithoutIdType>();

  return (newTable: TableType) => {
    const { id, name, ...tablePayload } = newTable;

    reactFlowInstance.setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              name: name || 'untitled',
              ...tablePayload,
            },
          };
        }

        return node;
      }),
    );

    undoableService.updateData(true);
  };
}
