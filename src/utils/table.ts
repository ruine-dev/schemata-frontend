import { TableProps } from '@/schemas/table';
import { Node } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';

export function emptyTableNodeFactory(overrides?: Partial<Node<TableProps>>): Node<TableProps> {
  return {
    id: uuidv4(),
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
