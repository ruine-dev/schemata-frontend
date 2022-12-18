import { useSaveDatabase } from '@/mutations/useSaveDatabase';
import { DatabaseProps } from '@/schemas/database';
import localforage from 'localforage';
import { Export, ShareNetwork } from 'phosphor-react';
import { EditorPanelContainer } from './EditorPanelContainer';
import { IconButton } from './IconButton';

interface EditorPropsPanelProps {
  database: DatabaseProps;
}

export function EditorPropsPanel({ database }: EditorPropsPanelProps) {
  return (
    <EditorPanelContainer>
      <IconButton label="Export as image" icon={Export} size="large" />
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
