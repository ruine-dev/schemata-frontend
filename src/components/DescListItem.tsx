import { ReactNode } from 'react';

type DescListItemProps = {
  label: string;
  value: ReactNode;
};

export function DescListItem({ label, value }: DescListItemProps) {
  return (
    <div className="flex flex-col gap-y-1">
      <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">{label}</dt>
      <dd className="text-sm font-medium text-gray-800">{value}</dd>
    </div>
  );
}
