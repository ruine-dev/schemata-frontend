import { EditorStateContext } from '@/contexts/EditorStateContext';
import { TableType, TableWithoutIdType } from '@/schemas/base';
import { useContext } from 'react';
import { useReactFlow } from 'reactflow';

export function useDeleteTable() {
  const { undoableService } = useContext(EditorStateContext);
  const reactFlowInstance = useReactFlow<TableWithoutIdType>();

  return (tableId: TableType['id']) => {
    reactFlowInstance.deleteElements({ nodes: [{ id: tableId }] });
    undoableService.updateData();
  };
}
