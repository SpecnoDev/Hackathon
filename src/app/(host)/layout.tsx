import type { ReactNode } from 'react';
import { requireHostPage } from '@/core/guards';
import { HostShell } from '@/core/layout';
import { firstName } from '@/shared/utils';

export const metadata = { title: 'Host' };

export default async function HostLayout({ children }: { children: ReactNode }) {
  const host = await requireHostPage();

  return <HostShell hostName={firstName(host.fullName) || 'Your account'}>{children}</HostShell>;
}
