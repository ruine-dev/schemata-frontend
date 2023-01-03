import { TableNodeType, TableTypeWithoutId } from '@/schemas/base';
import { ReactFlowInstance, useReactFlow } from 'reactflow';

export function useCreateTable(callback?: () => void) {
  const reactFlowInstance = useReactFlow<TableTypeWithoutId>();

  return (newTable: TableTypeWithoutId, position: TableNodeType['position'] = { x: 0, y: 0 }) => {
    reactFlowInstance.addNodes({
      id: crypto.randomUUID(),
      type: 'table',
      position,
      data: {
        ...newTable,
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

  return (newTable: TableTypeWithoutId, position: TableNodeType['position'] = { x: 0, y: 0 }) => {
    reactFlowInstance.addNodes({
      id: crypto.randomUUID(),
      type: 'table',
      position,
      data: {
        ...newTable,
        onDataChange: callback,
      },
    });
  };
}
