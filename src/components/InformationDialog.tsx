import { ReactNode } from 'react';
import { BaseDialog } from './BaseDialog';
import { DescListItem } from './DescListItem';

type InformationDialogProps = {
  trigger: ReactNode;
};

export function InformationDialog({ trigger }: InformationDialogProps) {
  return (
    <BaseDialog title="Information" trigger={trigger} closeOnInteractOutside>
      <div className="max-w-[24rem] pt-4 pb-2">
        <dl className="flex flex-col gap-y-4">
          <DescListItem label="Version" value="Alpha 0.14.3" />
          <DescListItem label="Last updated" value="14 January 2023" />
          <DescListItem
            label="Created by"
            value={
              <a
                href="https://github.com/ruine-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-800 underline underline-offset-2 hover:text-slate-900"
              >
                @ruine.dev
              </a>
            }
          />
        </dl>
        <div className="mt-4 text-sm text-gray-600">
          <p>Thank you for using Schemata!</p>
          <p className="mt-1">
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
      </div>
    </BaseDialog>
  );
}
