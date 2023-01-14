import { clsx } from '@/utils/clsx';
import { forwardRef, HTMLAttributes, Ref } from 'react';

const ModalOvelay = forwardRef(
  ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>, ref: Ref<HTMLDivElement>) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'fixed inset-0 flex items-center justify-center bg-slate-900/70',
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
        className={clsx('rounded-lg bg-white py-4 px-5 shadow-2xl', className)}
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
