import { OFFERING_LIST_MAX_TAKE } from '@/core/constants';
import type { OfferingSort } from '@/shared/dto';

export const RAIL_CARDS = 8;
export const GUESTS_MIN = 1;
export const GUESTS_MAX = 20;
export const RECENT_SEARCHES_KEPT = 4;
export const RECENT_SEARCHES_KEY = 'traveller.recentSearches';
export const SEARCH_FORM_ID = 'traveller-search';
/** `?sheet=filters` opens the filter sheet on the results page, so the sheet has a link of its own. */
export const SHEET_PARAM = 'sheet';
export const FILTERS_SHEET = 'filters';
export const PRICE_FILTER_STEPS_CENTS = [20_000, 35_000, 50_000, 100_000] as const;
export const DURATION_FILTER_STEPS_MIN = [60, 120, 180, 240] as const;
export const DEFAULT_SORT: OfferingSort = 'recommended';
export const DEFAULT_GUESTS = 2;
/** Results and place pages show everything that matches, up to the API's own ceiling. */
export const OFFERING_LIST_MAX_TAKE_FOR_RESULTS = OFFERING_LIST_MAX_TAKE;
