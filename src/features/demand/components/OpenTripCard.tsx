import Link from 'next/link';
import { Icon } from '@/shared/components';
import type { TripSummary } from '@/shared/dto';
import { TRAVELLER_ROUTES } from '../constants';

/** A trip still being co-created: no photo of its own yet, since it may hold several offerings. */
export const OpenTripCard = ({ trip }: { trip: TripSummary }) => (
  <Link
    href={TRAVELLER_ROUTES.trips.detail(trip.id)}
    className="flex items-center gap-4 rounded-lg border border-hairline p-5 text-ink active:bg-surface-soft"
  >
    <span aria-hidden className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-soft">
      <Icon name="route" />
    </span>
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <p className="text-title-sm text-ink">{trip.name}</p>
      <p className="text-body-sm text-muted">
        {trip.startDate} – {trip.endDate}
      </p>
    </div>
    <Icon name="chevron-right" className="shrink-0 text-muted" />
  </Link>
);
