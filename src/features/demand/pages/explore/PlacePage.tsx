'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button, EmptyState, VerifiedBadge } from '@/shared/components';
import { ListingRail, TravellerScreen } from '../../components';
import { CATEGORIES, COPY_COMMON, COPY_EXPLORE, HOSTS, TRAVELLER_ROUTES } from '../../constants';
import { badgeFor, findPlace, listingsInPlace } from '../../services/client';

const copy = COPY_EXPLORE.place;

/** Screen 4: the PRD's "browse by place" entry. The town first, then the people, then what they offer by category. */
export const PlacePage = ({ slug }: { slug: string }) => {
  const place = findPlace(slug);
  const listings = place ? listingsInPlace(place.slug) : [];
  const hosts = HOSTS.filter((host) => listings.some((listing) => listing.hostId === host.id));

  if (!place || listings.length === 0) {
    return (
      <TravellerScreen barTitle={place?.name ?? COPY_COMMON.notFoundTitle} backHref={TRAVELLER_ROUTES.home} showNav>
        <EmptyState
          illustration="missing"
          title={copy.emptyTitle}
          message={copy.empty}
          action={
            <Button size="md" variant="secondary" href={TRAVELLER_ROUTES.home}>
              {copy.explore}
            </Button>
          }
        />
      </TravellerScreen>
    );
  }

  return (
    <TravellerScreen
      barTitle={place.region}
      backHref={TRAVELLER_ROUTES.home}
      showNav
      lead={
        <div className="relative aspect-video max-h-96 w-full bg-surface-soft">
          <Image src={place.photo} alt="" fill priority className="object-cover" sizes="100vw" />
        </div>
      }
    >
      <div className="flex flex-col gap-10">
        <div className="flex max-w-2xl flex-col gap-3">
          <h1 className="font-display text-display-xl text-ink">{place.name}</h1>
          <p className="text-body-md text-body">{place.blurb}</p>
        </div>

        <section className="flex flex-col gap-4">
          <h2 className="text-title-lg text-ink">{copy.hosts(place.name)}</h2>
          <ul className="grid grid-cols-2 gap-4 tablet:grid-cols-3 desktop:grid-cols-4">
            {hosts.map((host) => {
              const badge = badgeFor(host);
              return (
                <li key={host.id}>
                  <Link href={TRAVELLER_ROUTES.host(host.id)} className="flex h-full flex-col items-center gap-3 rounded-lg bg-surface-soft p-5 text-center active:opacity-80">
                    <span className="relative size-20 overflow-hidden rounded-full bg-surface-strong">
                      <Image src={host.portrait} alt="" fill className="object-cover" sizes="80px" />
                    </span>
                    <span className="text-title-sm text-ink">{host.firstName}</span>
                    {badge ? <VerifiedBadge label={badge} density="traveller" /> : <span className="text-caption text-muted">{COPY_COMMON.tierName[host.tier]}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {CATEGORIES.map(({ category }) => (
          <ListingRail key={category} title={COPY_COMMON.categories[category]} listings={listings.filter((listing) => listing.category === category)} />
        ))}
      </div>
    </TravellerScreen>
  );
};
