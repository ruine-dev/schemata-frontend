import { clsx } from '@/utils/clsx';
import { forwardRef, HTMLAttributes, Ref } from 'react';

const ModalOvelay = forwardRef(
  ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>, ref: Ref<HTMLDivElement>) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'fixed inset-0 flex items-center justify-center bg-slate-900/70 duration-1000',
          'rdx-state-open:animate-in rdx-state-open:fade-in',
          'rdx-state-closed:animate-out rdx-state-closed:fade-out',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

const ModalContent = forwardRef(
  ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>, ref: Ref<HTMLDivElement>) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-lg bg-white py-4 px-5 shadow-2xl duration-1000',
          'rdx-state-open:animate-in rdx-state-open:fade-in rdx-state-open:slide-in-from-bottom-8',
          'rdx-state-closed:animate-out rdx-state-closed:fade-out rdx-state-closed:slide-out-to-bottom-8',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

const ModalTitle = forwardRef(
  ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>, ref: Ref<HTMLDivElement>) => {
    return (
      <div ref={ref} className={clsx('text-gray-600', className)} {...props}>
        {children}
      </div>
    );
  },
);

export const Modal = {
  Content: ModalContent,
  Overlay: ModalOvelay,
  Title: ModalTitle,
};
