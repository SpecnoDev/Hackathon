import { notFound } from 'next/navigation';
import { requireTravellerPage } from '@/core/guards';
import { BookingConfirmedActions, BookingNotice, ListingSummary, TravellerScreen } from '@/features/demand/components';
import { COPY_BOOK, COPY_COMMON, TRAVELLER_ROUTES } from '@/features/demand/constants';
import { getTravellerBooking } from '@/features/demand/services';
import { formatDayAndTime } from '@/features/demand/utils';
import { Banner, Button, DetailFact } from '@/shared/components';
import { formatRand } from '@/shared/utils';

export const metadata = { title: 'You are booked' };

/** Screen 12. An instant booking went through: the receipt, where to be, and the three things worth doing next. */
export default async function BookingConfirmedPage({ params }: { params: Promise<{ id: string }> }) {
  const { traveller } = await requireTravellerPage();
  const { id } = await params;
  const booking = await getTravellerBooking(traveller.id, id);
  if (!booking) notFound();
  if (booking.status !== 'CONFIRMED') {
    return <BookingNotice barTitle={COPY_BOOK.flowTitle} {...COPY_BOOK.notice.changed} backHref={TRAVELLER_ROUTES.bookings.detail(booking.id)} />;
  }

  const copy = COPY_BOOK.confirmed;

  return (
    <TravellerScreen
      barTitle={COPY_BOOK.flowTitle}
      heading={copy.title}
      width="column"
      footer={
        <Button size="md" href={TRAVELLER_ROUTES.trips.list}>
          {COPY_BOOK.viewTrips}
        </Button>
      }
    >
      <div className="flex flex-col gap-6">
        <Banner tone="success">{copy.banner(formatRand(booking.totalCents), booking.hostFirstName)}</Banner>
        <ListingSummary title={booking.offeringTitle} photo={booking.offeringPhoto ?? undefined} meta={`${COPY_COMMON.hostedBy(booking.hostFirstName)} · ${booking.offeringTown}`} />

        <ul className="flex flex-col gap-5">
          <DetailFact icon="calendar" title={COPY_BOOK.facts.when}>
            <p>{formatDayAndTime(booking.date, booking.startTime)}</p>
            {booking.startTime ? null : <p className="text-body-sm text-muted">{COPY_COMMON.anyTime}</p>}
          </DetailFact>
          <DetailFact icon="users" title={COPY_BOOK.facts.guests}>
            {COPY_COMMON.guests(booking.groupSize)}
          </DetailFact>
          <DetailFact icon="banknote" title={COPY_BOOK.facts.total}>
            {formatRand(booking.totalCents)}
          </DetailFact>
          <DetailFact icon="map-pin" title={COPY_BOOK.facts.meet}>
            {`${booking.meetingPoint}, ${booking.offeringTown}`}
          </DetailFact>
        </ul>

        <BookingConfirmedActions booking={booking} />
      </div>
    </TravellerScreen>
  );
}
