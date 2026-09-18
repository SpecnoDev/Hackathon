import type { ReactNode } from 'react';
import { forbidHostOnTravellerRoutes } from '@/core/guards';
import { SavedListingsProvider } from '@/features/demand/components';
import { ToastProvider } from '@/shared/components';

export const metadata = { title: 'Explore' };

/** Browsing stays open to anonymous visitors; only a signed-in host is turned away. Each page owns its own TravellerScreen. */
export default async function TravellerLayout({ children }: { children: ReactNode }) {
  await forbidHostOnTravellerRoutes();

  return (
    <ToastProvider>
      <SavedListingsProvider>{children}</SavedListingsProvider>
    </ToastProvider>
  );
}
