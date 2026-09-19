import Image from 'next/image';
import Link from 'next/link';
import type { BookingSummary } from '@/shared/dto';
import { Icon } from '@/shared/components';
import { formatRand } from '@/shared/utils';
import { TRAVELLER_ROUTES } from '../constants';
import { BookingStatusPill } from './TripStatusPill';

const CARD_SIZES = '(min-width: 1128px) 33vw, (min-width: 744px) 50vw, 100vw';
const FACT_ICON_PX = 16;

/** A booking on the Trips tab, drawn like a listing card with the status floating on the photo. */
export const BookingCard = ({ booking }: { booking: BookingSummary }) => (
  <Link href={TRAVELLER_ROUTES.bookings.detail(booking.id)} className="flex flex-col gap-3 text-ink active:opacity-80">
    <div className="relative aspect-4/3 overflow-hidden rounded-md bg-surface-soft">
      {booking.offeringPhoto ? <Image src={booking.offeringPhoto} alt="" fill className="object-cover" sizes={CARD_SIZES} /> : null}
      <span className="absolute left-3 top-3 rounded-xs shadow-lift">
        <BookingStatusPill status={booking.status} />
      </span>
    </div>
    <div className="flex flex-col gap-1">
      <h3 className="text-title-sm text-ink">{booking.offeringTitle}</h3>
      <p className="flex items-center gap-2 pt-1 text-body-sm text-ink">
        <Icon name="calendar" size={FACT_ICON_PX} className="shrink-0 text-muted" />
        {new Date(booking.date).toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' })}
      </p>
      <p className="flex items-center gap-2 text-body-sm text-ink">
        <Icon name="users" size={FACT_ICON_PX} className="shrink-0 text-muted" />
        {booking.groupSize === 1 ? '1 guest' : `${booking.groupSize} guests`}
      </p>
      <p className="text-body-sm text-muted">{formatRand(booking.totalCents)}</p>
    </div>
  </Link>
);
