import Link from 'next/link';
import type { OfferingSummary } from '@/shared/dto';
import { RAIL_CARDS } from '../constants';
import { ListingCardLink } from './ListingCardLink';

const RAIL_CARD_SIZES = '288px';

interface ListingRailProps {
  title: string;
  offerings: OfferingSummary[];
  moreHref?: string;
  moreLabel?: string;
}

/** An editorial row: a heading and cards that scroll sideways, bleeding to the screen edge so the next card peeks in. */
export const ListingRail = ({ title, offerings, moreHref, moreLabel }: ListingRailProps) =>
  offerings.length === 0 ? null : (
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
        {offerings.slice(0, RAIL_CARDS).map((offering) => (
          <li key={offering.id} className="w-72 shrink-0 snap-start">
            <ListingCardLink offering={offering} sizes={RAIL_CARD_SIZES} />
          </li>
        ))}
      </ul>
    </section>
  );
