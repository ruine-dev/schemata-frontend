import { ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Modal } from './Modal';
import { IconButton } from './IconButton';
import { X } from 'phosphor-react';

interface BaseDialogProps {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
  noCloseButton?: boolean;
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export function BaseDialog({
  trigger,
  title,
  children,
  noCloseButton,
  onClose,
  open,
  onOpenChange,
}: BaseDialogProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose?.();
        }
        onOpenChange?.(isOpen);
      }}
    >
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <Modal.Overlay>
            <Dialog.Content onInteractOutside={(e) => e.preventDefault()} asChild>
              <Modal.Content>
                <div className="flex items-center justify-between">
                  <Dialog.Title asChild>
                    <Modal.Title>{title}</Modal.Title>
                  </Dialog.Title>
                  {!noCloseButton && (
                    <Dialog.Close asChild>
                      <IconButton icon={X} label="Close" size="large" />
                    </Dialog.Close>
                  )}
                </div>
                {children}
              </Modal.Content>
            </Dialog.Content>
          </Modal.Overlay>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
