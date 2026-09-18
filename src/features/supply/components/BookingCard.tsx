'use client';

import Link from 'next/link';
import { Button, Icon, StatusPill } from '@/shared/components';
import { formatRand } from '@/shared/utils';
import { BOOKING_STATUS_PILL, HOST_COPY, HOST_ROUTES } from '../constants';
import type { Booking } from '../interfaces';
import { formatDayAndTime, formatTime } from '../utils';

const LINE_ICON_PX = 20;
const copy = HOST_COPY.bookings;

export const BookingStatusPill = ({ booking }: { booking: Booking }) =>
  booking.pendingSync ? (
    <StatusPill tone="review" icon="cloud-off" label={HOST_COPY.common.waitingToUpload} />
  ) : (
    <StatusPill tone={BOOKING_STATUS_PILL[booking.status].tone} icon={BOOKING_STATUS_PILL[booking.status].icon} label={copy.status[booking.status]} />
  );

/** PRD: a group fills a shared pot, so a host can see whether the money is all in before saying yes. */
export const GroupPaymentLine = ({ booking }: { booking: Booking }) => {
  const { paid, of } = booking.groupPayment;
  return (
    <p className="flex items-start gap-2 text-caption text-ink">
      <Icon name={paid >= of ? 'check' : 'clock'} size={16} className="mt-0.5 shrink-0" />
      {paid >= of ? copy.card.paidInFull : copy.card.stillPaying(paid, of)}
    </p>
  );
};

interface BookingCardProps {
  booking: Booking;
  offeringTitle: string;
  onAccept?: () => void;
}

/**
 * DESIGN.md: the most important host card after earnings. It reads in the order a host decides:
 * who is coming, when, what it pays, then the answer.
 */
export const BookingCard = ({ booking, offeringTitle, onAccept }: BookingCardProps) => {
  const isRequest = booking.status === 'REQUESTED';
  const received = booking.status === 'COMPLETED';
  return (
    <article className="flex flex-col gap-4 rounded-lg border border-hairline bg-canvas p-5">
      <Link href={HOST_ROUTES.bookings.detail(booking.id)} className="flex flex-col gap-4 active:opacity-80">
        <div className="flex items-center gap-3">
          <span aria-hidden className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-strong font-display text-title-lg text-ink">
            {booking.travellerName.charAt(0)}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <h3 className="text-title-md text-ink">{`${booking.travellerName} · ${HOST_COPY.common.people(booking.groupSize)}`}</h3>
            <p className="truncate text-caption text-muted">{offeringTitle}</p>
          </div>
        </div>
        <p className="flex items-center gap-2 text-body-host text-ink">
          <Icon name="calendar" size={LINE_ICON_PX} className="shrink-0 text-muted" />
          {formatDayAndTime(booking.date)}
        </p>
        <p className="flex items-center gap-2 text-title-md text-ink">
          <span aria-hidden className="flex w-5 shrink-0 justify-center">
            <span className="size-2.5 rounded-full bg-accent" />
          </span>
          {received ? copy.card.received(formatRand(booking.hostReceivesCents)) : copy.card.receive(formatRand(booking.hostReceivesCents))}
        </p>
        {isRequest ? null : (
          <div>
            <BookingStatusPill booking={booking} />
          </div>
        )}
      </Link>
      {isRequest ? (
        <>
          <div className="flex flex-col gap-1 border-t border-hairline-soft pt-4">
            <GroupPaymentLine booking={booking} />
            <p className="flex items-center gap-2 text-caption text-muted">
              <Icon name="clock" size={16} className="shrink-0" />
              {copy.card.answerBy(formatTime(booking.respondBy))}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button size="md" onClick={onAccept}>
              {copy.card.accept}
            </Button>
            <Button size="md" variant="secondary" href={HOST_ROUTES.bookings.decline(booking.id)}>
              {copy.card.decline}
            </Button>
          </div>
        </>
      ) : null}
    </article>
  );
};
