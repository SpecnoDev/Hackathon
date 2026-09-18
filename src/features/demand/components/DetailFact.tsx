import type { ReactNode } from 'react';
import { Icon, type IconName } from '@/shared/components';

/** DESIGN.md detail-row at traveller density: icon, bold label, plain answer. The same row a host edits. */
export const DetailFact = ({ icon, title, children }: { icon: IconName; title: string; children: ReactNode }) => (
  <li className="flex items-start gap-4">
    <Icon name={icon} className="shrink-0 text-ink" />
    <div className="flex min-w-0 flex-col gap-1">
      <p className="text-title-sm text-ink">{title}</p>
      <div className="text-body-md text-body">{children}</div>
    </div>
  </li>
);
