import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ROUTES } from '@/core/constants';
import { requireTravellerPage } from '@/core/guards';
import { COPY_COMMON, COPY_LISTING, TRAVELLER_ROUTES } from '@/features/demand/constants';
import { getTravellerBooking } from '@/features/demand/services';
import { formatDayAndTime } from '@/features/demand/utils';
import { Banner, Button, DetailFact } from '@/shared/components';
import { BookingStatusPill, TravellerScreen } from '@/features/demand/components';
import { formatRand } from '@/shared/utils';

const CANCELLABLE = ['REQUESTED', 'CONFIRMED'] as const;

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { traveller } = await requireTravellerPage();
  const { id } = await params;
  const booking = await getTravellerBooking(traveller.id, id);

  if (!booking) notFound();

  const canCancel = CANCELLABLE.includes(booking.status as (typeof CANCELLABLE)[number]);

  return (
    <TravellerScreen barTitle="Trip" backHref={ROUTES.trips} width="column">
      <div className="flex flex-col gap-8">
        <div className="flex items-start gap-4">
          <span className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-md bg-surface-soft">
            {booking.offeringPhoto ? <Image src={booking.offeringPhoto} alt="" fill className="object-cover" sizes="80px" /> : null}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <h1 className="text-title-lg text-ink">{booking.offeringTitle}</h1>
            <BookingStatusPill status={booking.status} />
          </div>
        </div>

        {booking.status === 'CANCELLED' ? (
          <Banner tone={booking.refundCents ? 'success' : 'info'}>
            {booking.refundCents ? `${formatRand(booking.refundCents)} refund is on its way.` : 'No refund on this booking.'}
          </Banner>
        ) : null}

        <ul className="flex flex-col gap-5">
          <DetailFact icon="calendar" title="When">
            <p>{formatDayAndTime(booking.date, booking.startTime)}</p>
            {booking.startTime ? null : <p className="text-body-sm text-muted">{COPY_COMMON.anyTime}</p>}
          </DetailFact>
          <DetailFact icon="users" title="Guests">
            {booking.groupSize === 1 ? '1 guest' : `${booking.groupSize} guests`}
          </DetailFact>
          <DetailFact icon="banknote" title="Total">
            {formatRand(booking.totalCents)}
          </DetailFact>
          <DetailFact icon="map-pin" title="Where you meet">
            <p>{booking.meetingPoint}</p>
            <p className="text-muted">{booking.offeringTown}</p>
          </DetailFact>
          <DetailFact icon="user" title="Host">
            <p>{booking.hostFirstName}</p>
            <Link href={TRAVELLER_ROUTES.host(booking.hostId)} className="flex min-h-12 items-center text-link text-primary-text underline">
              {COPY_LISTING.seeProfile(booking.hostFirstName)}
            </Link>
          </DetailFact>
        </ul>

        {canCancel ? (
          <Button variant="destructive" href={TRAVELLER_ROUTES.bookings.cancel(booking.id)}>
            Cancel this booking
          </Button>
        ) : null}

        <Link href={ROUTES.trips} className="text-link text-primary-text underline">
          Back to Trips
        </Link>
      </div>
    </TravellerScreen>
  );
}
