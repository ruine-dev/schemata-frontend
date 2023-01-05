import { useSaveLocalSchema } from '@/mutations/useSaveLocalSchema';
import { PositionType, RelationType, SchemaType, TableType } from '@/schemas/base';
import { nodeToTable, nodeToPosition, edgeToRelation } from '@/utils/reactflow';
import { useReactFlow } from 'reactflow';

export function useHandleSaveLocalSchema(id: SchemaType['id']) {
  const reactFlowInstance = useReactFlow();
  const { mutate: saveLocalSchema } = useSaveLocalSchema(id);

  return () => {
    const tables: TableType[] = reactFlowInstance.getNodes().map((node) => nodeToTable(node)) ?? [];

    const positions: PositionType[] =
      reactFlowInstance.getNodes().map((node) => nodeToPosition(node)) ?? [];

    const relations: RelationType[] =
      reactFlowInstance.getEdges().map((edge) => edgeToRelation(edge)) ?? [];

    saveLocalSchema((currentDatabase) => ({
      ...currentDatabase,
      tables,
      positions,
      relations,
    }));
  };
}
