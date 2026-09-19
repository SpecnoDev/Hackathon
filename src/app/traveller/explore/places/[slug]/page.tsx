import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ListingRail, TravellerScreen } from '@/features/demand/components';
import { CATEGORY_LABEL, COPY_COMMON, COPY_EXPLORE, OFFERING_LIST_MAX_TAKE_FOR_RESULTS, TRAVELLER_ROUTES, findPlace } from '@/features/demand/constants';
import { listLiveOfferings, listPlaceHosts } from '@/features/demand/services';
import { OFFERING_CATEGORIES } from '@/shared/dto';
import { Button, EmptyState, VerifiedBadge } from '@/shared/components';

/** Screen 4: the PRD's "browse by place" entry. The town first, then the people, then what they offer by category. */
export default async function PlacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const place = findPlace(slug);
  if (!place) notFound();

  const [offerings, hosts] = await Promise.all([listLiveOfferings({ region: place.name, take: OFFERING_LIST_MAX_TAKE_FOR_RESULTS }), listPlaceHosts(place.name)]);

  if (offerings.length === 0) {
    return (
      <TravellerScreen barTitle={place.name} backHref={TRAVELLER_ROUTES.home} showNav>
        <EmptyState
          illustration="missing"
          title={COPY_EXPLORE.place.emptyTitle}
          message={COPY_EXPLORE.place.empty}
          action={
            <Button size="md" variant="secondary" href={TRAVELLER_ROUTES.home}>
              {COPY_EXPLORE.place.explore}
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
          <h2 className="text-title-lg text-ink">{COPY_EXPLORE.place.hosts(place.name)}</h2>
          <ul className="grid grid-cols-2 gap-4 tablet:grid-cols-3 desktop:grid-cols-4">
            {hosts.map((host) => (
              <li key={host.id}>
                <Link href={TRAVELLER_ROUTES.host(host.id)} className="flex h-full flex-col items-center gap-3 rounded-lg bg-surface-soft p-5 text-center active:opacity-80">
                <span className="relative size-20 overflow-hidden rounded-full bg-surface-strong">
                  {host.portrait ? (
                    <Image src={host.portrait} alt="" fill className="object-cover" sizes="80px" />
                  ) : (
                    <span aria-hidden className="flex size-full items-center justify-center font-display text-display-md text-ink">
                      {host.firstName.charAt(0)}
                    </span>
                  )}
                </span>
                <span className="text-title-sm text-ink">{host.firstName}</span>
                {host.tier === 'REGISTERED' ? <span className="text-caption text-muted">{COPY_COMMON.tierName[host.tier]}</span> : <VerifiedBadge label={COPY_COMMON.badge[host.tier]} density="traveller" />}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {OFFERING_CATEGORIES.map((category) => (
          <ListingRail key={category} title={CATEGORY_LABEL[category]} offerings={offerings.filter((offering) => offering.category === category)} />
        ))}
      </div>
    </TravellerScreen>
  );
}
