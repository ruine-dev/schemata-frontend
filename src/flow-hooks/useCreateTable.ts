import { TableNodeType } from '@/schemas/base';
import { ReactFlowInstance, useReactFlow } from 'reactflow';

export function useCreateTable() {
  const reactFlowInstance = useReactFlow();

  return (newTableNode: TableNodeType) => {
    reactFlowInstance.setNodes((currentNodes: TableNodeType[]) =>
      currentNodes.concat(newTableNode),
    );
  };
}

export function createTableWithInstance(reactFlowInstance?: ReactFlowInstance | null) {
  if (!reactFlowInstance) {
    return () => {};
  }

  return (newTable: TableNodeType) => {
    reactFlowInstance.setNodes((currentNodes: TableNodeType[]) => [...currentNodes, newTable]);
  };
}
