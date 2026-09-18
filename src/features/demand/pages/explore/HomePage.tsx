'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button, EmptyState } from '@/shared/components';
import { CategoryStrip, ListingRail, SearchPillLink, TravellerScreen } from '../../components';
import { COPY_EXPLORE, FEATURED_PLACE_SLUG, LISTINGS, NEAR_YOU_PLACE_SLUG, PLACES, TRAVELLER_ROUTES } from '../../constants';
import type { Listing, ListingCategory } from '../../interfaces';
import { findPlace, justAdded, listingsInPlace, topRated } from '../../services/client';

const copy = COPY_EXPLORE;
const PLACE_TILE_SIZES = '224px';

/** DESIGN.md dark-hero: the wordmark, one display headline, one line, and the search pill. One of only two dark surfaces. */
const Hero = () => (
  <header className="bg-surface-dark">
    <div className="mx-auto flex max-w-page flex-col gap-6 px-4 pb-8 pt-8 tablet:px-6 tablet:pb-12 tablet:pt-12">
      <p className="font-display text-display-md text-primary">{copy.wordmark}</p>
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-display-xl text-on-dark">{copy.headline}</h1>
        <p className="max-w-xl text-body-md text-on-dark/70">{copy.sub}</p>
      </div>
      <div className="max-w-xl">
        <SearchPillLink label={copy.searchPill} />
      </div>
    </div>
  </header>
);

export const HomePage = () => {
  const [category, setCategory] = useState<ListingCategory>();
  const only = (listings: Listing[]): Listing[] => (category ? listings.filter((listing) => listing.category === category) : listings);
  const featured = findPlace(FEATURED_PLACE_SLUG);
  const nothingInCategory = only([...LISTINGS]).length === 0;

  return (
    <TravellerScreen lead={<Hero />} showNav>
      <div className="flex flex-col gap-10">
        <CategoryStrip active={category} onChange={setCategory} />
        {nothingInCategory ? (
          <EmptyState
            illustration="missing"
            title={copy.emptyTitle}
            message={copy.empty}
            action={
              <Button size="md" variant="secondary" onClick={() => setCategory(undefined)}>
                {copy.seeEverything}
              </Button>
            }
          />
        ) : null}
        <ListingRail title={copy.rails.nearYou} listings={only(listingsInPlace(NEAR_YOU_PLACE_SLUG))} moreHref={TRAVELLER_ROUTES.place(NEAR_YOU_PLACE_SLUG)} moreLabel={copy.rails.seeAll} />
        <ListingRail title={copy.rails.loved} listings={only(topRated())} />

        <section className="flex flex-col gap-4">
          <h2 className="text-title-lg text-ink">{copy.rails.places}</h2>
          <ul className="-mx-4 flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] tablet:-mx-6 tablet:scroll-px-6 tablet:px-6 [&::-webkit-scrollbar]:hidden">
            {PLACES.map((place) => (
              <li key={place.slug} className="w-56 shrink-0 snap-start">
                <Link href={TRAVELLER_ROUTES.place(place.slug)} className="flex flex-col gap-2 text-ink active:opacity-80">
                  <span className="relative aspect-4/3 overflow-hidden rounded-md bg-surface-soft">
                    <Image src={place.photo} alt="" fill className="object-cover" sizes={PLACE_TILE_SIZES} />
                  </span>
                  <span className="text-title-sm text-ink">{place.name}</span>
                  <span className="text-body-sm text-muted">{place.region}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <ListingRail title={copy.rails.justAdded} listings={only(justAdded())} />
        {featured ? (
          <ListingRail title={copy.rails.hostsIn(featured.name)} listings={only(listingsInPlace(featured.slug))} moreHref={TRAVELLER_ROUTES.place(featured.slug)} moreLabel={copy.rails.seeAll} />
        ) : null}
      </div>
    </TravellerScreen>
  );
};
