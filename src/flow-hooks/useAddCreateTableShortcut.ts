import { emptyTableWithoutId } from '@/utils/reactflow';
import { useEffect } from 'react';
import { useReactFlow } from 'reactflow';
import { useCreateTable } from './useCreateTable';

export function useAddCreateTableShortcut(position: { x: number; y: number }) {
  const reactFlowInstance = useReactFlow();
  const createTable = useCreateTable();

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
        e.preventDefault();
        e.stopPropagation();

        let finalPosition = position;

        if (
          position.x <= 0 ||
          position.y <= 0 ||
          position.x >= window.innerWidth ||
          position.y >= window.innerHeight - 100
        ) {
          const rect = document.body.getBoundingClientRect();

          finalPosition = { x: rect.width / 2, y: rect.height / 2 };
        }

        createTable(emptyTableWithoutId(), reactFlowInstance.project(finalPosition));
      }
    };

    document.body.addEventListener('keydown', handleCreateTableShortcut);

    return () => {
      document.body.removeEventListener('keydown', handleCreateTableShortcut);
    };
  }, [createTable, position]);
}
