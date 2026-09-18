import Image from 'next/image';
import Link from 'next/link';
import { COPY_COMMON, COPY_EXPLORE, PLACES, TRAVELLER_ROUTES } from '../constants';
import type { RegionWithSample } from '../services';

const PLACE_TILE_SIZES = '224px';

/** DESIGN.md "browse by place": the editorial places, in the brief's order, with how many hosts are live in each. */
export const PlaceTiles = ({ regions }: { regions: RegionWithSample[] }) => {
  const live = PLACES.filter((place) => regions.some((region) => region.region === place.name));
  if (live.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-title-lg text-ink">{COPY_EXPLORE.rails.places}</h2>
      <ul className="-mx-4 flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] tablet:-mx-6 tablet:scroll-px-6 tablet:px-6 [&::-webkit-scrollbar]:hidden">
        {live.map((place) => (
          <li key={place.slug} className="w-56 shrink-0 snap-start">
            <Link href={TRAVELLER_ROUTES.place(place.slug)} className="flex flex-col gap-2 text-ink active:opacity-80">
              <span className="relative aspect-4/3 overflow-hidden rounded-md bg-surface-soft">
                <Image src={place.photo} alt="" fill className="object-cover" sizes={PLACE_TILE_SIZES} />
              </span>
              <span className="text-title-sm text-ink">{place.name}</span>
              <span className="text-body-sm text-muted">{`${place.region} · ${COPY_COMMON.hosts(regions.find((region) => region.region === place.name)?.count ?? 0)}`}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
