import {
  PositionType,
  RelationType,
  TableNodeType,
  TableType,
  VarcharColumnType,
} from '@/schemas/base';
import { Edge } from 'reactflow';
import { isUuid } from './zod';

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
