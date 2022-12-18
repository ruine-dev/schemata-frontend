import { TableProps, TableWithIdProps } from '@/schemas/table';
import { Node, useReactFlow } from 'reactflow';

export function useUpdateTable() {
  const reactFlowInstance = useReactFlow();

  return (newTable: TableWithIdProps) => {
    const { id, ...tablePayload } = newTable;

    reactFlowInstance.setNodes((currentNodes: Node<TableProps>[]) =>
      currentNodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: tablePayload,
          };
        }

        return node;
      }),
    );
  };
}
