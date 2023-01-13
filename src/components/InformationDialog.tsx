import { ReactNode } from 'react';
import { BaseDialog } from './BaseDialog';

type InformationDialogProps = {
  trigger: ReactNode;
};

export function InformationDialog({ trigger }: InformationDialogProps) {
  return (
    <BaseDialog title="Information" trigger={trigger} closeOnInteractOutside>
      <div className="max-w-[24rem] pt-4 pb-2">
        <table>
          <tbody>
            <tr>
              <td className="py-1 pr-8 text-slate-500">Version</td>
              <td className="py-1 text-slate-800">Alpha 0.14.1</td>
            </tr>
            <tr>
              <td className="py-1 pr-8 text-slate-500">Last updated</td>
              <td className="py-1 text-slate-800">13 January 2023</td>
            </tr>
            <tr>
              <td className="py-1 pr-8 text-slate-500">Created by</td>
              <td className="py-1">
                <a
                  href="https://github.com/ruine-dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-800 underline underline-offset-2 hover:text-slate-900"
                >
                  @ruine.dev
                </a>
              </td>
            </tr>
          </tbody>
        </table>
        <p className="mt-4 text-slate-600">Thank you for using Schemata!</p>
        <p className="mt-1 text-slate-600">
          If you have any feedback or bug reports, please don't hesitate to send them through{' '}
          <a
            href="https://bit.ly/schemata-feedback"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            this form
          </a>
        </p>
      </div>
    </BaseDialog>
  );
}
