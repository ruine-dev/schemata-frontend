import {
  PositionType,
  RelationType,
  TableNodeType,
  TableType,
  TableTypeWithoutId,
  VarcharColumnType,
} from '@/schemas/base';
import { Edge, ReactFlowInstance } from 'reactflow';

export function nodeToTable(node: TableNodeType): TableType {
  return {
    id: node.id,
    name: node.data.name,
    columns: node.data.columns,
    indexes: node.data.indexes,
  };
}

export function nodeToPosition(node: TableNodeType): PositionType {
  return {
    itemId: node.id,
    x: node.position.x,
    y: node.position.y,
  };
}

export function edgeToRelation(edge: Edge): RelationType {
  if (!edge.sourceHandle || !edge.targetHandle) {
    throw Error(`Handle id for edge ${edge.id} is empty`);
  }

  return {
    id: edge.id,
    source: {
      columnId: edge.sourceHandle.split('-').slice(0, -2).join('-'),
      tableId: edge.source,
    },
    target: {
      columnId: edge.targetHandle.split('-').slice(0, -1).join('-'),
      tableId: edge.target,
    },
  };
}

export function emptyTableNode(overrides?: Partial<TableNodeType>): TableNodeType {
  return {
    id: crypto.randomUUID(),
    type: 'table',
    data: {
      name: '',
      columns: [],
      indexes: [],
    },
    position: {
      x: 200,
      y: 200,
    },
    ...overrides,
  };
}

export function emptyVarcharColumn(): VarcharColumnType {
  return {
    id: crypto.randomUUID(),
    name: '',
    type: 'VARCHAR',
    attributes: [],
  };
}

export function getColumnIdFromHandleId(handleId: string): string {
  const columnId = handleId
    .replace('-source-left', '')
    .replace('-source-right', '')
    .replace('-target', '');

  return columnId;
}

export function getHandlePositionFromHandleId(handleId: string): 'right' | 'left' {
  if (handleId.includes('right')) {
    return 'right';
  }
  if (handleId.includes('left')) {
    return 'left';
  }

  throw Error(`Cannot get position from handleId ${handleId}`);
}

export function appendDataChangeListenerToNodes({
  nodes,
  onDataChange,
}: {
  nodes: TableNodeType[];
  onDataChange: () => void;
}) {
  return nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onDataChange,
    },
  }));
}
