import type { ReactNode } from 'react';
import { APP_NAME } from '@/core/constants';
import { TravellerAppProvider } from '@/features/demand/components';

export const metadata = { title: APP_NAME };

export default function TravellerLayout({ children }: { children: ReactNode }) {
  return <TravellerAppProvider>{children}</TravellerAppProvider>;
}
