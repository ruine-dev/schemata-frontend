import { TableType, TableTypeWithoutId } from '@/schemas/base';
import { useReactFlow } from 'reactflow';

export function useDeleteTable() {
  const reactFlowInstance = useReactFlow<TableTypeWithoutId>();

  return (tableId: TableType['id']) => {
    reactFlowInstance.deleteElements({ nodes: [{ id: tableId }] });
  };
}
