import { FocusEvent } from 'react';

export function handleFocusLockChildrenBlur(event: FocusEvent, callback: () => void) {
  const parent = event.currentTarget;
  setTimeout(() => {
    if (!parent.contains(document.activeElement)) {
      callback();
    }
  }, 0);
}
