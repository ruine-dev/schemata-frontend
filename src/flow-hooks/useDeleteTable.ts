import { TableWithIdProps } from '@/schemas/table';
import { useReactFlow } from 'reactflow';

export function useDeleteTable() {
  const reactFlowInstance = useReactFlow();

  return (tableId: TableWithIdProps['id']) => {
    reactFlowInstance.deleteElements({ nodes: [{ id: tableId }] });
  };
}
