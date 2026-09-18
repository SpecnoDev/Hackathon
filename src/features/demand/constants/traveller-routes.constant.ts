const BOOK = '/book';
const TRIPS = '/trips';
const PLANS = '/plans';

/** Every traveller URL in one place. Sheets that need a link of their own are opened with `?sheet=`. */
export const TRAVELLER_ROUTES = {
  home: '/explore',
  search: '/search',
  results: '/results',
  resultsFilters: '/results?sheet=filters',
  place: (slug: string): string => `/places/${slug}`,
  listing: (id: string): string => `/listings/${id}`,
  listingShare: (id: string): string => `/listings/${id}?sheet=share`,
  listingPlan: (id: string): string => `/listings/${id}?sheet=plan`,
  listingReviews: (id: string): string => `/listings/${id}/reviews`,
  host: (id: string): string => `/hosts/${id}`,
  book: {
    date: (id: string): string => `${BOOK}/${id}/date`,
    guests: (id: string): string => `${BOOK}/${id}/guests`,
    review: (id: string): string => `${BOOK}/${id}/review`,
    pay: (id: string): string => `${BOOK}/${id}/pay`,
    confirmed: (tripId: string): string => `${BOOK}/${tripId}/confirmed`,
    requested: (tripId: string): string => `${BOOK}/${tripId}/requested`,
  },
  trips: {
    list: TRIPS,
    detail: (id: string): string => `${TRIPS}/${id}`,
    safety: (id: string): string => `${TRIPS}/${id}?sheet=safety`,
    cancel: (id: string): string => `${TRIPS}/${id}/cancel`,
    review: (id: string): string => `${TRIPS}/${id}/review`,
    reviewThanks: (id: string): string => `${TRIPS}/${id}/review/thanks`,
  },
  saved: '/saved',
  plans: {
    list: PLANS,
    detail: (id: string): string => `${PLANS}/${id}`,
  },
  profile: '/profile',
  signIn: { phone: '/sign-in', code: '/sign-in/code' },
  /** The host app, for "Become a host". */
  becomeHost: '/host/welcome',
} as const;

export type TravellerSheet = 'filters' | 'share' | 'plan' | 'safety';
