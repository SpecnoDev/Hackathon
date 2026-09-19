'use client';

import { BottomNav } from '@/shared/components';
import { COPY_COMMON, TRAVELLER_NAV, TRAVELLER_ROUTES } from '../constants';
import { useTravellerSession } from './TravellerSessionProvider';

const initialOf = (name: string): string => name.charAt(0).toUpperCase();

/** The traveller tabs; once signed in, the Profile tab wears the traveller's initial. */
export const TravellerNav = () => {
  const session = useTravellerSession();
  const items = session
    ? TRAVELLER_NAV.map((item) => (item.href === TRAVELLER_ROUTES.profile ? { ...item, avatar: initialOf(session.name) } : item))
    : TRAVELLER_NAV;

  return <BottomNav items={items} label={COPY_COMMON.navLabel} />;
};
