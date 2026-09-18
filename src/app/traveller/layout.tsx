import type { ReactNode } from 'react';
import { forbidHostOnTravellerRoutes } from '@/core/guards';
import { BottomNav } from '@/core/layout';

export const metadata = { title: 'Explore' };

/** Browsing stays open to anonymous visitors; only a signed-in host is turned away. */
export default async function TravellerLayout({ children }: { children: ReactNode }) {
  await forbidHostOnTravellerRoutes();

  return (
    <div className="pb-16">
      {children}
      <BottomNav />
    </div>
  );
}
