import { TableProps, TableWithIdProps } from '@/schemas/table';
import { Node, useReactFlow } from 'reactflow';

export function useUpdateTable() {
  const reactFlowInstance = useReactFlow();

  return (newTable: TableWithIdProps) => {
    const { id, name, ...tablePayload } = newTable;

    reactFlowInstance.setNodes((currentNodes: Node<TableProps>[]) =>
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
