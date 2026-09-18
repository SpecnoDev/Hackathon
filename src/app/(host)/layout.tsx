import type { ReactNode } from 'react';
import { APP_NAME } from '@/core/constants';
import { HostAppProvider } from '@/features/supply/components';

export const metadata = { title: APP_NAME };

export default function HostLayout({ children }: { children: ReactNode }) {
  return <HostAppProvider>{children}</HostAppProvider>;
}
