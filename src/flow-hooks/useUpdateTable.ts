import { TableType, TableTypeWithoutId } from '@/schemas/base';
import { useReactFlow } from 'reactflow';

export function useUpdateTable() {
  const reactFlowInstance = useReactFlow<TableTypeWithoutId>();

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
  };
}
