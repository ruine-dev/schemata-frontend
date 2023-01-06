import { DragEvent } from 'react';
import { useCreateTable } from '@/flow-hooks/useCreateTable';
import { EditorPanelContainer } from './EditorPanelContainer';
import { Tooltip } from './Tooltip';
import { useReactFlow } from 'reactflow';
import { clsx } from '@/utils/clsx';
import { emptyTableWithoutId } from '@/utils/reactflow';

export function ToolbarPanel() {
  const { project } = useReactFlow();
  const createTable = useCreateTable();

  const onDragStart = (event: DragEvent<HTMLButtonElement>, nodeType: 'table') => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleCreateTable = () => {
    const rect = document.body.getBoundingClientRect();

    const position = project({
      x: rect.width / 2,
      y: rect.height / 2,
    });

    createTable(emptyTableWithoutId(), position);
  };

  return (
    <EditorPanelContainer>
      <div className="flex items-center">
        <Tooltip text="Drag and drop to create a table (T)">
          <button
            onClick={handleCreateTable}
            onDragStart={(event) => onDragStart(event, 'table')}
            draggable
            data-test="create-table-button"
            className={clsx(
              'flex cursor-pointer items-center gap-x-2 rounded pr-1 text-sm text-slate-600 outline-offset-2 outline-sky-500',
              'hover:bg-gray-100',
            )}
          >
            <span className="flex h-7 w-7 items-center justify-center">
              <svg
                width="21"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.5 5.23999C1.5 3.99735 2.51737 3 3.76001 3H17.26C18.5027 3 19.51 4.00736 19.51 5.25L19.5164 11.3615C19.0996 10.8869 18.5723 10.5119 17.9746 10.2766C17.878 9.97409 17.5946 9.755 17.26 9.755H12.01C11.5958 9.755 11.26 10.0908 11.26 10.505V11.13C11.26 11.5442 11.5958 11.88 12.01 11.88H13.1174C12.8359 12.3296 12.6412 12.8391 12.557 13.385H12.01C11.5958 13.385 11.26 13.7208 11.26 14.135V14.76C11.26 15.1324 11.5314 15.4414 11.8872 15.5H12.8008C13.0356 16.08 13.4025 16.5925 13.8642 17H3.77002C2.52738 17 1.51001 15.9826 1.51001 14.74L1.5 5.23999ZM9.76001 14.76V14.135C9.76001 13.7208 9.42422 13.385 9.01001 13.385H3.76001C3.3458 13.385 3.01001 13.7208 3.01001 14.135V14.75C3.01001 15.1642 3.3458 15.5 3.76001 15.5H9.13284C9.48862 15.4414 9.76001 15.1324 9.76001 14.76ZM9.76001 11.13V10.505C9.76001 10.0908 9.42422 9.755 9.01001 9.755H3.76001C3.3458 9.755 3.01001 10.0908 3.01001 10.505V11.13C3.01001 11.5442 3.3458 11.88 3.76001 11.88H9.01001C9.42422 11.88 9.76001 11.5442 9.76001 11.13ZM18.01 7.5V6.875C18.01 6.46079 17.6742 6.125 17.26 6.125H12.01C11.5958 6.125 11.26 6.46079 11.26 6.875V7.5C11.26 7.91421 11.5958 8.25 12.01 8.25H17.26C17.6742 8.25 18.01 7.91421 18.01 7.5ZM9.76001 7.5V6.875C9.76001 6.46079 9.42422 6.125 9.01001 6.125H3.76001C3.3458 6.125 3.01001 6.46079 3.01001 6.875V7.5C3.01001 7.91421 3.3458 8.25 3.76001 8.25H9.01001C9.42422 8.25 9.76001 7.91421 9.76001 7.5ZM15.76 11.75C15.76 11.3358 16.0958 11 16.51 11C16.9242 11 17.26 11.3358 17.26 11.75V13.25H18.76C19.1742 13.25 19.51 13.5858 19.51 14C19.51 14.4142 19.1742 14.75 18.76 14.75H17.26V16.25C17.26 16.6642 16.9242 17 16.51 17C16.0958 17 15.76 16.6642 15.76 16.25V14.75H14.26C13.8458 14.75 13.51 14.4142 13.51 14C13.51 13.5858 13.8458 13.25 14.26 13.25H15.76V11.75Z"
                  fill="#475569"
                />
              </svg>
            </span>
            Add Table
          </button>
        </Tooltip>
      </div>
    </EditorPanelContainer>
  );
}
