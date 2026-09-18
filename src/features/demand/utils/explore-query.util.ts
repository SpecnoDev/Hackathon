import { offeringListQuerySchema, type OfferingListQuery } from '@/shared/dto';
import { TRAVELLER_ROUTES } from '../constants';

type RawParams = Record<string, string | string[] | undefined>;

/** The results page reads its whole state from the URL; anything malformed falls back to "everything". */
export const exploreQueryFromParams = (params: RawParams): OfferingListQuery => {
  const parsed = offeringListQuerySchema.safeParse(params);
  return parsed.success ? parsed.data : {};
};

const isSet = (value: unknown): boolean => value !== undefined && value !== '' && value !== false;

/** Builds the results URL for a query. `take` and `ids` are the server's business and never travel in a link. */
export const resultsHref = (query: Partial<OfferingListQuery>, extra: Record<string, string> = {}): string => {
  const { take: _take, ids: _ids, ...linkable } = query;
  const params = new URLSearchParams();
  Object.entries({ ...linkable, ...extra }).forEach(([key, value]) => {
    if (isSet(value)) params.set(key, String(value));
  });
  const search = params.toString();
  return search ? `${TRAVELLER_ROUTES.results}?${search}` : TRAVELLER_ROUTES.results;
};

export const countActiveFilters = (query: OfferingListQuery): number =>
  [query.maxPriceCents, query.maxDurationMin, query.lang, query.verifiedOnly || undefined, query.sort].filter((value) => value !== undefined).length;

/** The filters a "Clear filters" link keeps: what the traveller searched for, not how they narrowed it. */
export const withoutFilters = ({ q, region, category, groupSize }: OfferingListQuery): OfferingListQuery => ({ q, region, category, groupSize });
