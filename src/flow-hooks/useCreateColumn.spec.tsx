import { ReactFlowProvider, useReactFlow } from 'reactflow';
import { renderHook, act } from '@/test/utils';
import { useCreateColumn } from './useCreateColumn';
import { EditorStateProvider } from '@/contexts/EditorStateContext';
import { generateMock } from '@anatine/zod-mock';
import crypto from 'crypto';
import { expect, it } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TableSchema, TableWithoutIdType } from '@/schemas/table';
import { CreateVarcharColumnSchema } from '@/schemas/varchar';
import { EdgeType } from '@/schemas/relation';
import { SchemaType, SchemaSchema } from '@/schemas/schema';

const tableId = crypto.randomUUID();

const schemaMock: SchemaType = {
  ...generateMock(
    SchemaSchema.omit({ positions: true, relations: true, tables: true, groups: true }),
  ),
  tables: [
    {
      ...generateMock(TableSchema.omit({ id: true, columns: true, indexes: true })),
      id: tableId,
      columns: [],
      indexes: [],
    },
  ],
  groups: [],
  relations: [],
  positions: [
    {
      itemId: tableId,
      x: 0,
      y: 0,
    },
  ],
};

const queryClient = new QueryClient();

queryClient.setQueryData([`schema-${schemaMock.id}`], schemaMock);

it('should create a column', () => {
  const { result } = renderHook(
    () => {
      return {
        createColumn: useCreateColumn(),
        reactFlowInstance: useReactFlow<TableWithoutIdType, EdgeType>(),
      };
    },
    {
      wrapper({ children }) {
        return (
          <QueryClientProvider client={queryClient}>
            <ReactFlowProvider>
              <EditorStateProvider schema={schemaMock}>{children}</EditorStateProvider>
            </ReactFlowProvider>
          </QueryClientProvider>
        );
      },
    },
  );

  const columnData = generateMock(CreateVarcharColumnSchema);

  act(() => {
    const { createColumn } = result.current;

    createColumn(columnData);
  });

  expect(
    result.current.reactFlowInstance.getNodes().find((node) => node.id === tableId)?.data.columns ??
      [],
  ).toHaveLength(1);
  expect(
    result.current.reactFlowInstance.getNodes().find((node) => node.id === tableId)?.data.columns[0]
      .name,
  ).toEqual(columnData.name);
  expect(
    result.current.reactFlowInstance.getNodes().find((node) => node.id === tableId)?.data.columns[0]
      .type,
  ).toEqual(columnData.type);
});
