import { EditorStateContext } from '@/contexts/EditorStateContext';
import { ArrowCounterClockwise, ArrowClockwise } from 'phosphor-react';
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid';
import { useContext, useState } from 'react';
import { EditorPanelContainer } from './EditorPanelContainer';
import { IconButton } from './IconButton';
import { Separator } from './Separator';
import { useReactFlow, useStoreApi } from 'reactflow';

export function UtilsPanel() {
  const reactFlowStoreApi = useStoreApi();

  const reactFlowInstance = useReactFlow();
  const { undoableService } = useContext(EditorStateContext);

  const [zoomPercentage, setZoomPercentage] = useState(
    Math.round(reactFlowInstance.getZoom() * 100),
  );

  const zoomOut = () => {
    reactFlowInstance.zoomOut();
  };

  const zoomIn = () => {
    reactFlowInstance.zoomIn();
  };

  reactFlowStoreApi.subscribe((y) => {
    setZoomPercentage(Math.round(reactFlowInstance.getZoom() * 100));
  });

  return (
    <div className="flex items-center gap-x-6">
      <EditorPanelContainer className="flex items-center gap-x-4">
        <IconButton icon={MinusIcon} label="Zoom out" onClick={zoomOut} filled />
        <Separator orientation="vertical" />
        {zoomPercentage}%
        <Separator orientation="vertical" />
        <IconButton icon={PlusIcon} label="Zoom in" onClick={zoomIn} filled />
      </EditorPanelContainer>
      <EditorPanelContainer className="flex items-center gap-x-2">
        <IconButton
          icon={ArrowCounterClockwise}
          label="Undo (CTRL + Z)"
          onClick={undoableService.undo}
          disabled={!undoableService.canUndo}
          filled
        />
        <Separator orientation="vertical" />
        <IconButton
          icon={ArrowClockwise}
          label="Redo (CTRL + Y)"
          onClick={undoableService.redo}
          disabled={!undoableService.canRedo}
          filled
        />
      </EditorPanelContainer>
    </div>
  );
}
