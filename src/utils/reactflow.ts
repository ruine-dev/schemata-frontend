import { PositionType, TableNodeType, TableType, VarcharColumnType } from '@/schemas/base';

export function tableNodeToTable(node: TableNodeType): TableType {
  return {
    id: node.id,
    name: node.data.name,
    columns: node.data.columns,
    indexes: node.data.indexes,
    relations: node.data.relations,
  };
}

export function tableNodeToPosition(node: TableNodeType): PositionType {
  return {
    itemId: node.id,
    x: node.position.x,
    y: node.position.y,
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
      relations: [],
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
