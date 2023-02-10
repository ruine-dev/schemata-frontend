import { z } from 'zod';
import { useHandleEdgeMarker } from './useHandleEdgeMarker';
import { TableNodeType } from '@/schemas/table';
import { RelationEdgeType } from '@/schemas/relation';
import { SchemaSchema } from '@/schemas/schema';

export function useTransformSchemaToReactFlowData() {
  const handleEdgeMarker = useHandleEdgeMarker();

  return SchemaSchema.transform<{
    nodes: TableNodeType[];
    edges: RelationEdgeType[];
  }>((schema, ctx) => {
    const positionsMap = new Map(
      schema.positions.map((position) => [position.itemId, { x: position.x, y: position.y }]),
    );

    const nodes: TableNodeType[] = schema.tables.map((table) => {
      const { id, ...tablePayload } = table;

      const position = positionsMap.get(id);

      if (!position) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Position for ${id} is not found`,
        });

        return z.NEVER;
      }

      return {
        id,
        type: 'table',
        data: {
          name: tablePayload.name,
          columns: tablePayload.columns,
          indexes: tablePayload.indexes,
        },
        position,
      };
    });

    const edges: RelationEdgeType[] =
      schema.relations?.map((relation) => {
        const edge = {
          id: relation.id,
          source: relation.source.tableId,
          sourceHandle: `${relation.source.columnId}-source-right`,
          target: relation.target.tableId,
          targetHandle: `${relation.target.columnId}-target`,
          data: {
            name: relation.name,
            sourceColumnId: relation.source.columnId,
            targetColumnId: relation.target.columnId,
            actions: relation.actions,
          },
        };

        const { markerEnd, markerStart } = handleEdgeMarker(edge);

        return { ...edge, markerEnd, markerStart };
      }) ?? [];

    return {
      nodes,
      edges,
    };
  });
}
