import { TableTypeWithoutId } from '@/schemas/base';
import { emptyTableWithoutId } from '@/utils/reactflow';
import { useEffect } from 'react';
import { ReactFlowInstance } from 'reactflow';
import { useCreateTableWithInstance } from './useCreateTable';

type UseAddCreateTableShortcutParams = {
  reactFlowInstance: ReactFlowInstance<TableTypeWithoutId> | null;
};

export function useAddCreateTableShortcut(
  { reactFlowInstance }: UseAddCreateTableShortcutParams,
  callback?: () => void,
) {
  const createTable = useCreateTableWithInstance(reactFlowInstance, callback);

  useEffect(() => {
    const handleCreateTableShortcut = (e: KeyboardEvent) => {
      if (
        !(
          document.activeElement instanceof HTMLDivElement ||
          document.activeElement instanceof HTMLBodyElement
        )
      ) {
        return;
      }

      if (e.key === 't') {
        const rect = document.body.getBoundingClientRect();

        e.preventDefault();
        e.stopPropagation();

        const position = reactFlowInstance?.project({
          x: rect.width / 2,
          y: rect.height / 2,
        });

        createTable(emptyTableWithoutId(), position);
      }
    };

    document.body.addEventListener('keydown', handleCreateTableShortcut);

    return () => {
      document.body.removeEventListener('keydown', handleCreateTableShortcut);
    };
  }, [createTable]);
}
