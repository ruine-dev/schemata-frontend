import { TableProps } from '@/schemas/table';
import { Node } from 'reactflow';

export function emptyTableNodeFactory(overrides?: Partial<Node<TableProps>>): Node<TableProps> {
  return {
    id: crypto.randomUUID(),
    type: 'table',
    data: {
      name: '',
      columns: [],
    },
    position: {
      x: 200,
      y: 200,
    },
    ...overrides,
  };
}
