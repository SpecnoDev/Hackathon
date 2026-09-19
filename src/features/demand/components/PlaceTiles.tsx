import Image from 'next/image';
import Link from 'next/link';
import { PatternField } from '@/shared/components';
import { COPY_COMMON, COPY_EXPLORE, PLACES, TRAVELLER_ROUTES } from '../constants';
import type { RegionWithSample } from '../services';

const PLACE_TILE_SIZES = '224px';

/**
 * DESIGN.md `place-tile`: a poster rather than a thumbnail. The photo sits on a green panel that carries the brand
 * pattern and the name, so a place reads as a place and not as another card.
 */
export const PlaceTiles = ({ regions }: { regions: RegionWithSample[] }) => {
  const live = PLACES.filter((place) => regions.some((region) => region.region === place.name));
  if (live.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-title-lg text-ink">{COPY_EXPLORE.rails.places}</h2>
      <ul className="-mx-4 flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] tablet:-mx-6 tablet:scroll-px-6 tablet:px-6 [&::-webkit-scrollbar]:hidden">
        {live.map((place) => (
          <li key={place.slug} className="w-56 shrink-0 snap-start">
            <Link href={TRAVELLER_ROUTES.place(place.slug)} className="flex flex-col overflow-hidden rounded-lg active:opacity-80">
              <span className="relative aspect-4/3 bg-surface-soft">
                <Image src={place.photo} alt="" fill className="object-cover" sizes={PLACE_TILE_SIZES} />
              </span>
              <span className="relative flex flex-col gap-1 bg-primary-deep px-4 py-4">
                <PatternField />
                <span className="relative text-title-sm text-on-dark">{place.name}</span>
                <span className="relative text-body-sm text-on-dark/70">{`${place.region} · ${COPY_COMMON.hosts(regions.find((region) => region.region === place.name)?.count ?? 0)}`}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
