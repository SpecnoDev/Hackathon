import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

/** DESIGN.md detail-row: icon, bold label, plain answer. Shared across a listing, a trip and a booking receipt. */
export const DetailFact = ({ icon, title, children }: { icon: IconName; title: string; children: ReactNode }) => (
  <li className="flex items-start gap-4">
    <Icon name={icon} className="shrink-0 text-ink" />
    <div className="flex min-w-0 flex-col gap-1">
      <p className="text-title-sm text-ink">{title}</p>
      <div className="text-body-md text-body">{children}</div>
    </div>
  </li>
);
