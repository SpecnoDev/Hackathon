import { CategoryStrip, ExploreHero, ListingRail, PlaceTiles, TravellerScreen } from '@/features/demand/components';
import { COPY_EXPLORE, FEATURED_PLACE_SLUG, NEAR_YOU_PLACE_SLUG, RAIL_CARDS, TRAVELLER_ROUTES, findPlace } from '@/features/demand/constants';
import { listLiveOfferings, listRegionsWithSample } from '@/features/demand/services';
import { exploreQueryFromParams } from '@/features/demand/utils';
import { Button, EmptyState } from '@/shared/components';

type RawParams = Record<string, string | string[] | undefined>;

const homeHref = (category: string | undefined): string => (category ? `${TRAVELLER_ROUTES.home}?category=${category}` : TRAVELLER_ROUTES.home);

/** Screen 1: the hero and search pill, the category strip, then editorial rails. A category narrows every rail at once. */
export default async function ExplorePage({ searchParams }: { searchParams: Promise<RawParams> }) {
  const { category } = exploreQueryFromParams(await searchParams);
  const nearYou = findPlace(NEAR_YOU_PLACE_SLUG);
  const featured = findPlace(FEATURED_PLACE_SLUG);
  const rail = { category, take: RAIL_CARDS };

  const [near, loved, justAdded, hostsIn, regions] = await Promise.all([
    nearYou ? listLiveOfferings({ ...rail, region: nearYou.name }) : [],
    listLiveOfferings({ ...rail, sort: 'top_rated' }),
    listLiveOfferings({ ...rail, sort: 'newest' }),
    featured ? listLiveOfferings({ ...rail, region: featured.name }) : [],
    listRegionsWithSample(),
  ]);
  const nothingInCategory = near.length + loved.length + justAdded.length + hostsIn.length === 0;

  return (
    <TravellerScreen lead={<ExploreHero />} showNav>
      <div className="flex flex-col gap-10">
        <CategoryStrip active={category} hrefFor={homeHref} />
        {nothingInCategory ? (
          <EmptyState
            illustration="missing"
            title={COPY_EXPLORE.emptyTitle}
            message={COPY_EXPLORE.empty}
            action={
              <Button size="md" variant="secondary" href={TRAVELLER_ROUTES.home}>
                {COPY_EXPLORE.seeEverything}
              </Button>
            }
          />
        ) : null}
        {nearYou ? <ListingRail title={COPY_EXPLORE.rails.nearYou} offerings={near} moreHref={TRAVELLER_ROUTES.place(nearYou.slug)} moreLabel={COPY_EXPLORE.rails.seeAll} /> : null}
        <ListingRail title={COPY_EXPLORE.rails.loved} offerings={loved} />
        <PlaceTiles regions={regions} />
        <ListingRail title={COPY_EXPLORE.rails.justAdded} offerings={justAdded} />
        {featured ? <ListingRail title={COPY_EXPLORE.rails.hostsIn(featured.name)} offerings={hostsIn} moreHref={TRAVELLER_ROUTES.place(featured.slug)} moreLabel={COPY_EXPLORE.rails.seeAll} /> : null}
      </div>
    </TravellerScreen>
  );
}
