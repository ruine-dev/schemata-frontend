import { z } from 'zod';
import { Edge } from 'reactflow';
import { SchemaSchema, TableNodeType } from '@/schemas/base';
import { useHandleEdgeMarker } from './useHandleEdgeMarker';

export function useTransformSchemaToReactFlowData() {
  const handleEdgeMarker = useHandleEdgeMarker();

  return SchemaSchema.transform<{
    nodes: TableNodeType[];
    edges: Edge[];
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

    const edges: Edge[] =
      schema.relations?.map((relation) => {
        const edge = {
          id: relation.id,
          source: relation.source.tableId,
          sourceHandle: `${relation.source.columnId}-source-right`,
          target: relation.target.tableId,
          targetHandle: `${relation.target.columnId}-target`,
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
