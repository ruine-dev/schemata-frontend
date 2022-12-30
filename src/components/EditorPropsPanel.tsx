import { toPng } from 'html-to-image';
import { Export, ShareNetwork } from 'phosphor-react';
import { toast } from 'react-hot-toast';
import { useReactFlow } from 'reactflow';
import { useCopyToClipboard } from 'usehooks-ts';
import { useRouter } from '@tanstack/react-router';
import { EditorPanelContainer } from './EditorPanelContainer';
import { IconButton } from './IconButton';
import { SchemaType } from '@/schemas/base';
import { schemaToBase64Url } from '@/utils/schema';

interface EditorPropsPanelProps {
  schema: SchemaType;
}

function downloadImage(dataUrl: string) {
  const a = document.createElement('a');

  a.setAttribute('download', 'reactflow.png');
  a.setAttribute('href', dataUrl);
  a.click();

  a.remove();
}

export function EditorPropsPanel({ schema }: EditorPropsPanelProps) {
  const reactFlowInstance = useReactFlow();

  const exportToImage = () => {
    reactFlowInstance.fitView();

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
      <IconButton
        label="Export as image"
        icon={Export}
        size="large"
        onClick={exportToImage}
        filled
      />
      <ShareLinkButton schema={schema} />
    </EditorPanelContainer>
  );
}

interface ShareLinkButtonProps {
  schema: SchemaType;
}

function ShareLinkButton({ schema }: ShareLinkButtonProps) {
  const [, copy] = useCopyToClipboard();
  const router = useRouter();

  const encodedDatabase = schemaToBase64Url(schema);

  const copyLinkToClipboard = () => {
    const url = `${window.location.origin}/?schema=${encodedDatabase}`;

    copy(url);

    router.navigate({ params: '', to: '/', search: { schema: encodedDatabase }, replace: true });

    toast.success('URL copied to clipboard');
  };

  return (
    <IconButton
      label="Share link"
      icon={ShareNetwork}
      onClick={copyLinkToClipboard}
      size="large"
      filled
    />
  );
}
