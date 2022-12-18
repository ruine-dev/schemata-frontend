import { TableProps, TableWithIdProps } from '@/schemas/table';
import { Node, useReactFlow } from 'reactflow';

export function useCreateTable() {
  const reactFlowInstance = useReactFlow();

  return (newTable: Node<TableProps>) => {
    reactFlowInstance.setNodes((currentNodes: Node<TableProps>[]) => [...currentNodes, newTable]);
  };
}
