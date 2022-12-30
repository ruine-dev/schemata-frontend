import { TableTypeWithoutId } from '@/schemas/base';
import { emptyTableNode } from '@/utils/reactflow';
import { DragEvent, RefObject, useCallback } from 'react';
import { ReactFlowInstance } from 'reactflow';
import { useCreateTableWithInstance } from './useCreateTable';

type UseHandleCreateTableOnDropParams = {
  reactFlowInstance: ReactFlowInstance<TableTypeWithoutId> | null;
  reactFlowWrapper: RefObject<HTMLDivElement>;
};

export function useHandleCreateTableOnDrop(
  { reactFlowInstance, reactFlowWrapper }: UseHandleCreateTableOnDropParams,
  callback?: () => void,
) {
  const createTable = useCreateTableWithInstance(reactFlowInstance, callback);

  return useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (!type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      createTable(
        emptyTableNode({
          position,
        }),
      );
    },
    [reactFlowInstance, callback],
  );
}
