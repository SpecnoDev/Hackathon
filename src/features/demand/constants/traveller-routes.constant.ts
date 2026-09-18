import type { BottomNavItem } from '@/shared/components';
import { ROUTES } from '@/core/constants';

/** Every traveller URL beyond the four nav roots already in `core/constants/route.constant.ts`. */
export const TRAVELLER_ROUTES = {
  home: ROUTES.explore,
  listing: (id: string): string => `${ROUTES.explore}/listings/${id}`,
  listingReviews: (id: string): string => `${ROUTES.explore}/listings/${id}/reviews`,
  book: {
    date: (id: string): string => `${ROUTES.explore}/listings/${id}/book/date`,
    guests: (id: string): string => `${ROUTES.explore}/listings/${id}/book/guests`,
    review: (id: string): string => `${ROUTES.explore}/listings/${id}/book/review`,
    confirmed: (tripId: string): string => `${ROUTES.trips}/${tripId}/confirmed`,
    requested: (tripId: string): string => `${ROUTES.trips}/${tripId}/requested`,
  },
  trips: {
    list: ROUTES.trips,
    detail: (id: string): string => `${ROUTES.trips}/${id}`,
  },
  bookings: {
    detail: (id: string): string => `${ROUTES.trips}/bookings/${id}`,
    cancel: (id: string): string => `${ROUTES.trips}/bookings/${id}/cancel`,
  },
  saved: '/traveller/saved',
  profile: ROUTES.profile,
  login: ROUTES.login,
} as const;

/** Bookings has no tab of its own — it lives inside Trips. */
export const TRAVELLER_NAV: BottomNavItem[] = [
  { href: TRAVELLER_ROUTES.home, label: 'Explore', icon: 'search' },
  { href: TRAVELLER_ROUTES.trips.list, label: 'Trips', icon: 'route' },
  { href: TRAVELLER_ROUTES.saved, label: 'Saved', icon: 'heart' },
  { href: TRAVELLER_ROUTES.profile, label: 'Profile', icon: 'user' },
];
