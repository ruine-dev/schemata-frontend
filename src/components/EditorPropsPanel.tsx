import { useSaveDatabase } from '@/mutations/useSaveDatabase';
import { DatabaseProps } from '@/schemas/database';
import { toPng } from 'html-to-image';
import { Export, ShareNetwork } from 'phosphor-react';
import { EditorPanelContainer } from './EditorPanelContainer';
import { IconButton } from './IconButton';

interface EditorPropsPanelProps {
  database: DatabaseProps;
}

function downloadImage(dataUrl: string) {
  const a = document.createElement('a');

  a.setAttribute('download', 'reactflow.png');
  a.setAttribute('href', dataUrl);
  a.click();

  a.remove();
}

export function EditorPropsPanel({ database }: EditorPropsPanelProps) {
  const exportToImage = () => {
    const canvas = document.querySelector('.react-flow');

    if (!canvas || !(canvas instanceof HTMLElement)) {
      return;
    }

    toPng(canvas, {
      filter: (node) => {
        // we don't want to add the minimap and the controls to the image
        if (
          node?.classList?.contains('react-flow__minimap') ||
          node?.classList?.contains('react-flow__controls') ||
          node?.classList?.contains('react-flow__panel') ||
          node?.classList?.contains('noimage')
        ) {
          return false;
        }

        return true;
      },
    }).then(downloadImage);
  };

  return (
    <EditorPanelContainer>
      <IconButton label="Export as image" icon={Export} size="large" onClick={exportToImage} />
      <ShareLinkButton database={database} />
    </EditorPanelContainer>
  );
}

interface ShareLinkButtonProps {
  database: DatabaseProps;
}

function ShareLinkButton({ database }: ShareLinkButtonProps) {
  const { mutateAsync: saveDatabase, isLoading } = useSaveDatabase();

  const handleSaveDatabase = async () => {
    await saveDatabase(database);
  };

  return (
    <IconButton
      label="Share link"
      icon={ShareNetwork}
      onClick={handleSaveDatabase}
      loading={isLoading}
      size="large"
    />
  );
}
