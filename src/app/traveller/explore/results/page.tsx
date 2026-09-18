import Link from 'next/link';
import { CategoryStrip, FilterSheet, ListingGrid, SearchPillLink, TravellerScreen } from '@/features/demand/components';
import { COPY_COMMON, COPY_EXPLORE, DEFAULT_GUESTS, FILTERS_SHEET, OFFERING_LIST_MAX_TAKE_FOR_RESULTS, SHEET_PARAM, TRAVELLER_ROUTES } from '@/features/demand/constants';
import { listLiveOfferings } from '@/features/demand/services';
import { countActiveFilters, exploreQueryFromParams, resultsHref, withoutFilters } from '@/features/demand/utils';
import { Button, EmptyState, Icon } from '@/shared/components';

type RawParams = Record<string, string | string[] | undefined>;

export const metadata = { title: 'Results' };

/** Screen 3: a compact summary that reopens the search, the chips, the filters, then the same cards as everywhere else. */
export default async function ResultsPage({ searchParams }: { searchParams: Promise<RawParams> }) {
  const params = await searchParams;
  const query = exploreQueryFromParams(params);
  const sheetOpen = params[SHEET_PARAM] === FILTERS_SHEET;
  const offerings = await listLiveOfferings({ ...query, take: OFFERING_LIST_MAX_TAKE_FOR_RESULTS });
  const activeFilters = countActiveFilters(query);

  const where = query.q ?? query.region ?? COPY_EXPLORE.results.anywhere;
  const summary = COPY_COMMON.guests(query.groupSize ?? DEFAULT_GUESTS);
  const searchHref = `${TRAVELLER_ROUTES.search}?${resultsHref(query).split('?')[1] ?? ''}`;

  return (
    <TravellerScreen barTitle={COPY_EXPLORE.results.title} backHref={TRAVELLER_ROUTES.home} showNav>
      <div className="flex flex-col gap-6">
        <div className="sticky top-14 z-10 -mx-4 flex flex-col gap-3 bg-canvas px-4 pb-3 tablet:-mx-6 tablet:px-6">
          <SearchPillLink href={searchHref} label={where} summary={summary} />
          <CategoryStrip active={query.category} hrefFor={(category) => resultsHref({ ...query, category })} />
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-body-md text-muted" aria-live="polite">
            {COPY_EXPLORE.results.count(offerings.length)}
          </p>
          <Link href={resultsHref(query, { [SHEET_PARAM]: FILTERS_SHEET })} scroll={false} className="flex h-12 shrink-0 items-center gap-2 rounded-full border border-hairline bg-canvas px-5 text-button-sm text-ink">
            <Icon name="sliders" size={16} />
            {activeFilters > 0 ? COPY_EXPLORE.results.filtersOn(activeFilters) : COPY_EXPLORE.results.filters}
          </Link>
        </div>

        {offerings.length === 0 ? (
          <EmptyState
            illustration="missing"
            title={COPY_EXPLORE.results.emptyTitle}
            message={COPY_EXPLORE.results.empty}
            action={
              <Button size="md" variant="secondary" href={resultsHref(withoutFilters(query))}>
                {COPY_EXPLORE.results.clear}
              </Button>
            }
          />
        ) : (
          <ListingGrid offerings={offerings} />
        )}
      </div>
      {sheetOpen ? <FilterSheet query={query} closeHref={resultsHref(query)} /> : null}
    </TravellerScreen>
  );
}
