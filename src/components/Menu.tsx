import { clsx } from '@/utils/clsx';
import { ElementType, forwardRef, HTMLAttributes, Ref } from 'react';
import { Kbd } from './Kbd';

type MenuContentProps = HTMLAttributes<HTMLDivElement>;

function MenuContent(
  { children, className, ...props }: MenuContentProps,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      className={clsx(
        'min-w-[14rem] overflow-hidden rounded-lg border border-gray-300/50 bg-white/40 shadow-xl backdrop-blur',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type MenuItemProps = HTMLAttributes<HTMLDivElement> & {
  icon?: ElementType;
  kbd?: string;
};

function MenuItem(
  { icon: Icon, kbd, children, className, ...props }: MenuItemProps,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      className={clsx(
        'flex w-full cursor-default items-center py-2 px-2.5 text-left backdrop-blur',
        'hover:bg-gray-100/60',
        className,
      )}
      {...props}
    >
      {!!Icon && <Icon aria-hidden className="h-5 w-5 text-slate-400" />}
      <span className={clsx('text-sm text-slate-900', { 'ml-2': !!Icon, 'ml-7': !Icon })}>
        {children}
      </span>
      {kbd && <Kbd className="ml-auto">{kbd}</Kbd>}
    </div>
  );
}

export const Menu = {
  Content: forwardRef(MenuContent),
  Item: forwardRef(MenuItem),
};
