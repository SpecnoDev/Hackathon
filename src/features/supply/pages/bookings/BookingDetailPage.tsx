'use client';

import { useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Icon, useToast, type IconName } from '@/shared/components';
import { formatLocalPhone, formatRand, whatsAppLink } from '@/shared/utils';
import { BookingStatusPill, GroupPaymentLine, HostScreen, MissingNotice } from '../../components';
import { HOST_COPY, HOST_ROUTES } from '../../constants';
import { useHostApp, useHostAppReady, useOnline } from '../../hooks';
import type { HostAppState } from '../../interfaces';
import { hostAppStore, selectBookings } from '../../services';
import { formatDayAndTime } from '../../utils';

const copy = HOST_COPY.bookings;

const Fact = ({ icon, label, children }: { icon: IconName; label: string; children: ReactNode }) => (
  <div className="flex items-start gap-3 border-b border-hairline-soft py-4">
    <Icon name={icon} className="mt-0.5 shrink-0 text-muted" />
    <div className="flex min-w-0 flex-col gap-1">
      <dt className="text-caption text-muted">{label}</dt>
      <dd className="text-body-host text-ink">{children}</dd>
    </div>
  </div>
);

export const BookingDetailPage = ({ bookingId }: { bookingId: string }) => {
  const router = useRouter();
  const toast = useToast();
  const ready = useHostAppReady();
  const online = useOnline();
  const booking = useHostApp(useCallback((state: HostAppState) => selectBookings(state).find((item) => item.id === bookingId), [bookingId]));
  const offering = useHostApp(useCallback((state: HostAppState) => state.offerings.find((item) => item.id === booking?.offeringId), [booking?.offeringId]));

  if (ready && !booking) {
    return <MissingNotice barTitle={copy.detail.title} message={copy.detail.notFound} backHref={HOST_ROUTES.bookings.list} backLabel={copy.detail.backToList} />;
  }
  if (!booking) return <HostScreen barTitle={copy.detail.title}>{null}</HostScreen>;

  const accepted = booking.status === 'CONFIRMED' || booking.status === 'COMPLETED';

  const accept = (): void => {
    hostAppStore.acceptBooking(booking.id);
    toast(online ? copy.detail.accepted : copy.respond.queued);
  };

  const complete = (): void => {
    hostAppStore.completeBooking(booking.id);
    router.push(HOST_ROUTES.bookings.completed(booking.id));
  };

  const footer =
    booking.status === 'REQUESTED' ? (
      <>
        <Button onClick={accept}>{copy.card.accept}</Button>
        <Button variant="secondary" href={HOST_ROUTES.bookings.decline(booking.id)}>
          {copy.card.decline}
        </Button>
      </>
    ) : booking.status === 'CONFIRMED' ? (
      <>
        <Button icon="check" onClick={complete}>
          {copy.detail.complete}
        </Button>
        <Button variant="destructive" size="lg" href={HOST_ROUTES.bookings.cancel(booking.id)}>
          {copy.detail.cancel}
        </Button>
      </>
    ) : null;

  return (
    <HostScreen barTitle={copy.detail.title} backHref={HOST_ROUTES.bookings.list} footer={footer}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-display-md text-ink">{`${booking.travellerName} · ${HOST_COPY.common.people(booking.groupSize)}`}</h1>
          <p className="text-body-host text-muted">{offering?.title}</p>
          <div>
            <BookingStatusPill booking={booking} />
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-lg bg-accent-tint p-5">
          <p className="text-title-md text-ink">
            {booking.status === 'COMPLETED' ? copy.card.received(formatRand(booking.hostReceivesCents)) : copy.card.receive(formatRand(booking.hostReceivesCents))}
          </p>
          <GroupPaymentLine booking={booking} />
        </div>

        <dl className="flex flex-col">
          <Fact icon="calendar" label={copy.detail.when}>
            {formatDayAndTime(booking.date)}
          </Fact>
          <Fact icon="map-pin" label={copy.detail.meeting}>
            {[offering?.meetingPoint, offering?.town].filter(Boolean).join(', ')}
          </Fact>
          <Fact icon="phone" label={copy.detail.phone}>
            {accepted ? formatLocalPhone(booking.travellerPhone) : copy.detail.phoneHidden}
          </Fact>
        </dl>

        {accepted ? (
          <Button variant="secondary" icon="message" href={whatsAppLink(booking.travellerPhone, copy.detail.whatsappMessage(booking.travellerName))}>
            {copy.detail.whatsapp}
          </Button>
        ) : null}
      </div>
    </HostScreen>
  );
};
