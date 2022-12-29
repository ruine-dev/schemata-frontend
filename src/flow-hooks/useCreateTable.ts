import { TableNodeType, TableTypeWithoutId } from '@/schemas/base';
import { ReactFlowInstance, useReactFlow } from 'reactflow';

export function useCreateTable() {
  const reactFlowInstance = useReactFlow<TableTypeWithoutId>();

  return (newTableNode: TableNodeType) => {
    reactFlowInstance.setNodes((currentNodes) => currentNodes.concat(newTableNode));
  };
}

export function useCreateTableWithInstance(
  reactFlowInstance?: ReactFlowInstance<TableTypeWithoutId> | null,
) {
  if (!reactFlowInstance) {
    return () => {};
  }

  return (newTableNode: TableNodeType) => {
    reactFlowInstance.setNodes((currentNodes) => currentNodes.concat(newTableNode));
  };
}
