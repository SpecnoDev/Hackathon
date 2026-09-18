import Link from 'next/link';
import { RAIL_CARDS } from '../constants';
import type { Listing } from '../interfaces';
import { ListingCardLink } from './ListingCardLink';

const RAIL_CARD_SIZES = '288px';

interface ListingRailProps {
  title: string;
  listings: Listing[];
  moreHref?: string;
  moreLabel?: string;
}

/** An editorial row: a heading and cards that scroll sideways, bleeding to the screen edge so the next card peeks in. */
export const ListingRail = ({ title, listings, moreHref, moreLabel }: ListingRailProps) =>
  listings.length === 0 ? null : (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-title-lg text-ink">{title}</h2>
        {moreHref && moreLabel ? (
          <Link href={moreHref} className="flex min-h-12 items-center text-link text-primary-text underline">
            {moreLabel}
          </Link>
        ) : null}
      </div>
      <ul className="-mx-4 flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] tablet:-mx-6 tablet:scroll-px-6 tablet:px-6 [&::-webkit-scrollbar]:hidden">
        {listings.slice(0, RAIL_CARDS).map((listing) => (
          <li key={listing.id} className="w-72 shrink-0 snap-start">
            <ListingCardLink listing={listing} sizes={RAIL_CARD_SIZES} />
          </li>
        ))}
      </ul>
    </section>
  );
