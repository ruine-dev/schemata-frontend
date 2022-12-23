import { TableProps } from '@/schemas/table';
import { Node, ReactFlowInstance, useReactFlow } from 'reactflow';

export function useCreateTable() {
  const reactFlowInstance = useReactFlow();

  return (newTable: Node<TableProps>) => {
    reactFlowInstance.setNodes((currentNodes: Node<TableProps>[]) => [...currentNodes, newTable]);
  };
}

export function createTableWithInstance(reactFlowInstance?: ReactFlowInstance | null) {
  if (!reactFlowInstance) {
    return () => {};
  }

  return (newTable: Node<TableProps>) => {
    reactFlowInstance.setNodes((currentNodes: Node<TableProps>[]) => [...currentNodes, newTable]);
  };
}
