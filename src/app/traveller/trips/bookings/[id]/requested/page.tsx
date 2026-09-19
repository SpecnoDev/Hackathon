import { notFound } from 'next/navigation';
import { HOST_RESPONSE_HOURS } from '@/core/constants';
import { requireTravellerPage } from '@/core/guards';
import { BookingNotice, ListingSummary, TravellerScreen } from '@/features/demand/components';
import { COPY_BOOK, COPY_COMMON, TRAVELLER_ROUTES } from '@/features/demand/constants';
import { getTravellerBooking } from '@/features/demand/services';
import { formatClockTime, formatDayAndTime } from '@/features/demand/utils';
import { Banner, Button, DetailFact } from '@/shared/components';
import { formatRand } from '@/shared/utils';

export const metadata = { title: 'Request sent' };

/** Screen 12b. A request is waiting on the host: how long they have, what happens if they are silent, and that no money has moved. */
export default async function BookingRequestedPage({ params }: { params: Promise<{ id: string }> }) {
  const { traveller } = await requireTravellerPage();
  const { id } = await params;
  const booking = await getTravellerBooking(traveller.id, id);
  if (!booking) notFound();
  if (booking.status !== 'REQUESTED') {
    return <BookingNotice barTitle={COPY_BOOK.flowTitle} {...COPY_BOOK.notice.changed} backHref={TRAVELLER_ROUTES.bookings.detail(booking.id)} />;
  }

  const copy = COPY_BOOK.requested;

  return (
    <TravellerScreen
      barTitle={COPY_BOOK.flowTitle}
      heading={copy.title(booking.hostFirstName)}
      helper={copy.helper}
      width="column"
      footer={
        <>
          <Button size="md" href={TRAVELLER_ROUTES.trips.list}>
            {COPY_BOOK.viewTrips}
          </Button>
          <Button size="md" variant="secondary" href={TRAVELLER_ROUTES.home}>
            {copy.explore}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <Banner tone="warning" icon="clock">
          <p>{copy.deadline(booking.hostFirstName, COPY_COMMON.hours(HOST_RESPONSE_HOURS))}</p>
          <p>{copy.until(formatClockTime(booking.respondBy))}</p>
        </Banner>

        <ul className="flex flex-col gap-5">
          <DetailFact icon="calendar-x" title={copy.noAnswerTitle}>
            {copy.noAnswer}
          </DetailFact>
          <DetailFact icon="banknote" title={copy.notChargedTitle}>
            {copy.notCharged(formatRand(booking.totalCents), booking.hostFirstName)}
          </DetailFact>
        </ul>

        <div className="border-t border-hairline-soft pt-6">
          <ListingSummary title={booking.offeringTitle} photo={booking.offeringPhoto ?? undefined} meta={`${COPY_COMMON.hostedBy(booking.hostFirstName)} · ${booking.offeringTown}`}>
            <p className="text-body-sm text-muted">{COPY_BOOK.summary(formatDayAndTime(booking.date, booking.startTime), COPY_COMMON.guests(booking.groupSize))}</p>
          </ListingSummary>
        </div>
      </div>
    </TravellerScreen>
  );
}
