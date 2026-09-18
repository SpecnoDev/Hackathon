import { COPY_COMMON, DRIVE_MINUTES, HOSTS, LISTINGS, PLACES, REVIEWS, VERIFIED_TIERS } from '../../constants';
import type { Filters, Listing, ListingCategory, Place, Review, SearchState, TravellerAppState, TravellerHost } from '../../interfaces';
import { formatDuration } from '../../utils';

/**
 * TODO: stand-in for GET /api/v1/offerings and /offerings/:id. The catalogue is seeded; the search below is
 * keyword matching, where the PRD wants natural-language search backed by AI.
 */
export const findListing = (id: string): Listing | undefined => LISTINGS.find((listing) => listing.id === id);
export const findHost = (id: string): TravellerHost | undefined => HOSTS.find((host) => host.id === id);
export const findPlace = (slug: string | undefined): Place | undefined => PLACES.find((place) => place.slug === slug);
export const hostOf = (listing: Listing): TravellerHost => findHost(listing.hostId) ?? HOSTS[0];
export const listingsByHost = (hostId: string): Listing[] => LISTINGS.filter((listing) => listing.hostId === hostId);
export const listingsInPlace = (slug: string): Listing[] => LISTINGS.filter((listing) => listing.placeSlug === slug);
export const isVerified = (host: TravellerHost): boolean => VERIFIED_TIERS.includes(host.tier);
export const badgeFor = (host: TravellerHost): string | undefined => (host.tier === 'REGISTERED' ? undefined : COPY_COMMON.badge[host.tier]);

const STAR_VALUES = [5, 4, 3, 2, 1] as const;

export interface RatingSummary {
  /** Null until the first review, so a new listing says "New" instead of showing zero stars. */
  average: number | null;
  count: number;
}

export const ratingOf = (listing: Listing): RatingSummary => {
  const count = listing.ratings.reduce((sum, votes) => sum + votes, 0);
  const total = listing.ratings.reduce((sum, votes, index) => sum + votes * STAR_VALUES[index], 0);
  return { average: count === 0 ? null : total / count, count };
};

/** Seeded reviews plus the ones this traveller wrote, newest first. */
export const reviewsFor = (state: TravellerAppState, listingId: string): Review[] =>
  [...state.reviews, ...REVIEWS].filter((item) => item.listingId === listingId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

const CATEGORY_HINTS: Record<ListingCategory, readonly string[]> = {
  FOOD: ['eat', 'food', 'lunch', 'supper', 'dinner', 'meal', 'taste', 'hungry'],
  GUIDE: ['walk', 'guide', 'tour', 'show', 'history', 'hike'],
  TRANSPORT: ['lift', 'airport', 'drive', 'driver', 'transfer', 'ride'],
  EXPERIENCE: ['morning', 'farm', 'stars', 'paddle', 'swim', 'do', 'slow'],
};

const words = (text: string): string[] => text.toLowerCase().match(/[a-z]+/g) ?? [];

/** What a free-text line is asking for: a place it names, and the categories its words hint at. */
const readQuery = (query: string): { placeSlug?: string; categories: ListingCategory[]; terms: string[] } => {
  const terms = words(query);
  const text = terms.join(' ');
  return {
    placeSlug: PLACES.find((place) => text.includes(place.name.toLowerCase()))?.slug,
    categories: (Object.keys(CATEGORY_HINTS) as ListingCategory[]).filter((category) => CATEGORY_HINTS[category].some((hint) => terms.includes(hint))),
    terms,
  };
};

const matchesQuery = (listing: Listing, query: string): boolean => {
  if (!query.trim()) return true;
  const asked = readQuery(query);
  if (asked.placeSlug && listing.placeSlug !== asked.placeSlug) return false;
  if (asked.categories.length > 0) return asked.categories.includes(listing.category);
  if (asked.placeSlug) return true;
  const haystack = words(`${listing.title} ${listing.town} ${listing.description}`);
  return asked.terms.some((term) => term.length > 3 && haystack.includes(term));
};

export const countActiveFilters = (filters: Filters): number =>
  [filters.maxPriceCents, filters.maxDurationMin, filters.language, filters.verifiedOnly || undefined, filters.instantOnly || undefined].filter((value) => value !== undefined).length;

export const searchListings = (search: SearchState, filters: Filters): Listing[] =>
  LISTINGS.filter(
    (listing) =>
      (!search.placeSlug || listing.placeSlug === search.placeSlug) &&
      matchesQuery(listing, search.query) &&
      listing.groupMax >= search.guests &&
      (!filters.category || listing.category === filters.category) &&
      (!filters.maxPriceCents || listing.priceCents <= filters.maxPriceCents) &&
      (!filters.maxDurationMin || listing.durationMin <= filters.maxDurationMin) &&
      (!filters.language || listing.languages.includes(filters.language)) &&
      (!filters.verifiedOnly || isVerified(hostOf(listing))) &&
      (!filters.instantOnly || listing.bookingMode === 'INSTANT'),
  );

export const topRated = (): Listing[] =>
  [...LISTINGS].filter((listing) => ratingOf(listing).count > 0).sort((a, b) => (ratingOf(b).average ?? 0) - (ratingOf(a).average ?? 0) || ratingOf(b).count - ratingOf(a).count);

export const justAdded = (): Listing[] => [...LISTINGS].sort((a, b) => b.addedAt.localeCompare(a.addedAt));

/** "About 3.5 hours by car from Montagu to Knysna", or a note that both stops are in one town. Undefined when we have no figure. */
export const driveBetween = (from: Listing, to: Listing): string | undefined => {
  if (from.placeSlug === to.placeSlug) return COPY_COMMON.sameTown;
  const minutes = DRIVE_MINUTES[[from.placeSlug, to.placeSlug].sort().join('|')];
  const [origin, destination] = [findPlace(from.placeSlug), findPlace(to.placeSlug)];
  return minutes && origin && destination ? COPY_COMMON.driveTime(formatDuration(minutes), origin.name, destination.name) : undefined;
};
