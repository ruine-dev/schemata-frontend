import { useSaveLocalSchema } from '@/mutations/useSaveLocalSchema';
import { PositionType, RelationType, TableType } from '@/schemas/base';
import { nodeToTable, nodeToPosition, edgeToRelation } from '@/utils/reactflow';
import { ReactFlowInstance } from 'reactflow';

type UseHandleSaveLocalSchemaParams = {
  reactFlowInstance: ReactFlowInstance | null;
};

export function useHandleSaveLocalSchema({ reactFlowInstance }: UseHandleSaveLocalSchemaParams) {
  const { mutate: saveLocalSchema } = useSaveLocalSchema();

  return () => {
    const tables: TableType[] =
      reactFlowInstance?.getNodes().map((node) => nodeToTable(node)) ?? [];

    const positions: PositionType[] =
      reactFlowInstance?.getNodes().map((node) => nodeToPosition(node)) ?? [];

    const relations: RelationType[] =
      reactFlowInstance?.getEdges().map((edge) => edgeToRelation(edge)) ?? [];

    saveLocalSchema((currentDatabase) => ({
      ...currentDatabase,
      tables,
      positions,
      relations,
    }));
  };
}
