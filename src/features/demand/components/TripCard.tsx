import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/shared/components';
import { COPY_COMMON, COPY_TRIPS, TRAVELLER_ROUTES } from '../constants';
import type { Listing, Trip } from '../interfaces';
import { hostOf } from '../services/client';
import { formatDayAndTime } from '../utils';
import { TripStatusPill } from './TripStatusPill';

const FACT_ICON_PX = 16;
const CARD_SIZES = '(min-width: 1128px) 33vw, (min-width: 744px) 50vw, 100vw';

/**
 * A booking on the Trips tab, drawn like the host's offering card: the photo is the card and the status floats on it.
 * The review prompt is a second link under the card rather than inside it, because a link cannot hold a link.
 */
export const TripCard = ({ trip, listing }: { trip: Trip; listing: Listing }) => (
  <article className="flex flex-col">
    <Link href={TRAVELLER_ROUTES.trips.detail(trip.id)} className="flex flex-col gap-3 text-ink active:opacity-80">
      <div className="relative aspect-4/3 overflow-hidden rounded-md bg-surface-soft">
        {listing.photos[0] ? <Image src={listing.photos[0]} alt="" fill className="object-cover" sizes={CARD_SIZES} /> : null}
        <span className="absolute left-3 top-3 rounded-full shadow-lift">
          <TripStatusPill status={trip.status} />
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-title-sm text-ink">{listing.title}</h3>
        <p className="text-body-sm text-muted">{COPY_COMMON.hostedBy(hostOf(listing).firstName)}</p>
        <p className="flex items-center gap-2 pt-1 text-body-sm text-ink">
          <Icon name="calendar" size={FACT_ICON_PX} className="shrink-0 text-muted" />
          {formatDayAndTime(trip.date, trip.time)}
        </p>
        <p className="flex items-center gap-2 text-body-sm text-ink">
          <Icon name="users" size={FACT_ICON_PX} className="shrink-0 text-muted" />
          {COPY_COMMON.guests(trip.guests)}
        </p>
      </div>
    </Link>
    {trip.status === 'COMPLETED' && !trip.reviewed ? (
      <Link href={TRAVELLER_ROUTES.trips.review(trip.id)} className="flex min-h-12 items-center gap-2 self-start text-link text-primary-text underline">
        <Icon name="star" size={FACT_ICON_PX} className="shrink-0" />
        {COPY_TRIPS.leaveReview}
      </Link>
    ) : null}
  </article>
);
