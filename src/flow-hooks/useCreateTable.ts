import { TableNodeType, TableTypeWithoutId } from '@/schemas/base';
import { ReactFlowInstance, useReactFlow } from 'reactflow';

export function useCreateTable(callback?: () => void) {
  const reactFlowInstance = useReactFlow<TableTypeWithoutId>();

  return (newTableNode: TableNodeType) => {
    reactFlowInstance.addNodes({
      ...newTableNode,
      data: {
        ...newTableNode.data,
        onDataChange: callback,
      },
    });
  };
}

export function useCreateTableWithInstance(
  reactFlowInstance?: ReactFlowInstance<TableTypeWithoutId> | null,
  callback?: () => void,
) {
  if (!reactFlowInstance) {
    return () => {};
  }

  return (newTableNode: TableNodeType) => {
    reactFlowInstance.addNodes({
      ...newTableNode,
      data: {
        ...newTableNode.data,
        onDataChange: callback,
      },
    });
  };
}
