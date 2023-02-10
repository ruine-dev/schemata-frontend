import { useReverseRelation } from '@/flow-hooks/useReverseRelation';
import { RelationEdgeType } from '@/schemas/relation';
import { TableWithoutIdType } from '@/schemas/table';
import { getColumnIdFromHandleId } from '@/utils/reactflow';
import {
  ArrowsRightLeftIcon,
  Bars3Icon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/20/solid';
import { useCallback } from 'react';
import { useStore, Position, getSmoothStepPath, useReactFlow } from 'reactflow';
import { DropdownMenu } from '../DropdownMenu';
import { getEdgeParams } from './utils';

type SimpleFloatingEdgeProps = Pick<
  RelationEdgeType,
  'id' | 'source' | 'target' | 'markerStart' | 'markerEnd' | 'style' | 'data'
>;

const foreignObjectSize = 40;

export function SimpleFloatingEdge({
  id,
  source,
  target,
  markerStart,
  markerEnd,
  style,
  data,
}: SimpleFloatingEdgeProps) {
  const reactFlowInstance = useReactFlow<TableWithoutIdType>();
  const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
  const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));
  const relatedEdge = useStore(
    useCallback(
      (store) =>
        store.edges.find(
          (edge) =>
            getColumnIdFromHandleId(edge.sourceHandle as string) === data?.sourceColumnId &&
            getColumnIdFromHandleId(edge.targetHandle as string) === data?.targetColumnId,
        ),
      [source, target],
    ),
  );

  if (!sourceNode || !targetNode || !relatedEdge) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode,
    relatedEdge,
  );

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX: sx as number,
    sourceY: sy as number,
    sourcePosition: sourcePos as Position,
    targetPosition: targetPos as Position,
    targetX: tx as number,
    targetY: ty as number,
    borderRadius: 16,
  });

  const reverseRelation = useReverseRelation();

  return (
    <>
      <path
        tabIndex={0}
        id={id}
        onKeyDown={(e) => {
          e.preventDefault();

          if (e.key === 'Delete') {
            reactFlowInstance.deleteElements({ edges: [relatedEdge] });
          }
        }}
        d={edgePath}
        markerStart={markerStart as string}
        markerEnd={markerEnd as string}
        style={style}
        className="fill-none stroke-slate-400 stroke-[1.5] outline-none focus:stroke-sky-500"
      />
      <path
        d={edgePath}
        onClick={(e) => {
          const edge = e.currentTarget.previousElementSibling as HTMLElement;

          edge.focus();
        }}
        className="peer fill-none stroke-transparent stroke-[20] outline-none"
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={labelX - foreignObjectSize / 2}
        y={labelY - foreignObjectSize / 2}
        requiredExtensions="http://www.w3.org/1999/xhtml"
        className="invisible flex items-center justify-center focus-within:visible hover:visible peer-hover:visible peer-focus:visible"
      >
        <DropdownMenu
          trigger={
            <button className="rounded-full border border-white bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-600">
              <Bars3Icon className="h-5 w-5" />
            </button>
          }
          items={[
            // {
            //   icon: PencilSquareIcon,
            //   label: 'Edit',
            // },
            {
              icon: ArrowsRightLeftIcon,
              label: 'Reverse',
              onClick() {
                reverseRelation(id);
              },
            },
            {
              icon: TrashIcon,
              label: 'Delete',
              onClick() {
                reactFlowInstance.deleteElements({ edges: [relatedEdge] });
              },
            },
          ]}
        />
      </foreignObject>
    </>
  );
}
