import { cleanup, render, RenderOptions } from '@testing-library/react';
import { afterEach } from 'vitest';
import { ReactElement, ReactNode } from 'react';
import { ReactFlowProvider } from 'reactflow';

afterEach(() => {
  cleanup();
});

const Providers = ({ children }: { children: ReactNode }) => {
  return <ReactFlowProvider>{children}</ReactFlowProvider>;
};

const customRender = (ui: ReactElement, options: RenderOptions = {}) => {
  return render(ui, {
    wrapper({ children }) {
      return <Providers>{children}</Providers>;
    },
    ...options,
  });
};

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

export { customRender as render };
