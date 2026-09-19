import type { ReactNode } from 'react';
import { USER_ROLES } from '@/core/constants';
import { currentUser, forbidHostOnTravellerRoutes } from '@/core/guards';
import { SavedListingsProvider, TravellerSessionProvider } from '@/features/demand/components';
import { SignedInToast, ToastProvider } from '@/shared/components';

export const metadata = { title: 'Explore' };

/** Browsing stays open to anonymous visitors; only a signed-in host is turned away. Each page owns its own TravellerScreen. */
export default async function TravellerLayout({ children }: { children: ReactNode }) {
  await forbidHostOnTravellerRoutes();
  const user = await currentUser();
  const traveller = user?.role === USER_ROLES.traveller ? { name: user.traveller.name } : null;

  return (
    <ToastProvider>
      <SignedInToast />
      <TravellerSessionProvider traveller={traveller}>
        <SavedListingsProvider>{children}</SavedListingsProvider>
      </TravellerSessionProvider>
    </ToastProvider>
  );
}
