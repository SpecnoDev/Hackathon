import Image from 'next/image';
import Link from 'next/link';
import type { RegionWithSample } from '../services';

const PLACE_TILE_SIZES = '224px';

/** DESIGN.md "browse by place": each tile is a live region, not a hand-curated Place — see offering.service.ts. */
export const PlacesSection = ({ regions }: { regions: RegionWithSample[] }) =>
  regions.length === 0 ? null : (
    <section className="flex flex-col gap-4">
      <h2 className="text-title-lg text-ink">Browse by place</h2>
      <ul className="-mx-4 flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] tablet:-mx-6 tablet:scroll-px-6 tablet:px-6 [&::-webkit-scrollbar]:hidden">
        {regions.map((place) => (
          <li key={place.region} className="w-56 shrink-0 snap-start">
            <Link href={`/traveller/explore?region=${encodeURIComponent(place.region)}`} className="flex flex-col gap-2 text-ink active:opacity-80">
              <span className="relative aspect-4/3 overflow-hidden rounded-md bg-surface-soft">
                {place.samplePhoto ? (
                  <Image src={place.samplePhoto} alt="" fill className="object-cover" sizes={PLACE_TILE_SIZES} />
                ) : null}
              </span>
              <span className="text-title-sm text-ink">{place.region}</span>
              <span className="text-body-sm text-muted">
                {place.count === 1 ? '1 host' : `${place.count} hosts`}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
