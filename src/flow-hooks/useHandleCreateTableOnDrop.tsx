import { emptyTableWithoutId } from '@/utils/reactflow';
import { DragEvent, RefObject, useCallback } from 'react';
import { useReactFlow } from 'reactflow';
import { useCreateTable } from './useCreateTable';

type UseHandleCreateTableOnDropParams = {
  reactFlowWrapper: RefObject<HTMLDivElement>;
};

export function useHandleCreateTableOnDrop({ reactFlowWrapper }: UseHandleCreateTableOnDropParams) {
  const reactFlowInstance = useReactFlow();
  const createTable = useCreateTable();

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

      createTable(emptyTableWithoutId(), position);
    },
    [reactFlowInstance],
  );
}
