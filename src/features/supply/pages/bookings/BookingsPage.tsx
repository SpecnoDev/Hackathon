'use client';

import { Button, EmptyState, useToast } from '@/shared/components';
import { BookingCard, HostScreen } from '../../components';
import { HOST_COPY, HOST_ROUTES } from '../../constants';
import { useHostApp, useOnline } from '../../hooks';
import type { Booking, HostAppState } from '../../interfaces';
import { hostAppStore, selectBookingSections, selectOfferings } from '../../services';

const copy = HOST_COPY.bookings;
const selectTitles = (state: HostAppState): Record<string, string> => Object.fromEntries(state.offerings.map((offering) => [offering.id, offering.title]));
const selectHasOfferings = (state: HostAppState): boolean => selectOfferings(state).length > 0;

interface SectionProps {
  title: string;
  empty: string;
  bookings: Booking[];
  titles: Record<string, string>;
  onAccept?: (booking: Booking) => void;
}

const Section = ({ title, empty, bookings, titles, onAccept }: SectionProps) => (
  <section className="flex flex-col gap-4">
    <h2 className="text-title-lg text-ink">{title}</h2>
    {bookings.length === 0 ? (
      <p className="text-body-host text-muted">{empty}</p>
    ) : (
      <ul className="flex flex-col gap-3">
        {bookings.map((booking) => (
          <li key={booking.id}>
            <BookingCard booking={booking} offeringTitle={titles[booking.offeringId] ?? ''} onAccept={onAccept ? () => onAccept(booking) : undefined} />
          </li>
        ))}
      </ul>
    )}
  </section>
);

export const BookingsPage = () => {
  const toast = useToast();
  const online = useOnline();
  const sections = useHostApp(selectBookingSections);
  const titles = useHostApp(selectTitles);
  const hasOfferings = useHostApp(selectHasOfferings);
  const nothingYet = sections.requests.length + sections.upcoming.length + sections.past.length === 0;

  const accept = (booking: Booking): void => {
    hostAppStore.acceptBooking(booking.id);
    toast(online ? copy.detail.accepted : copy.respond.queued);
  };

  return (
    <HostScreen pageTitle={copy.title} showNav>
      {nothingYet ? (
        // One designed empty state for the whole tab, not three empty sections.
        <EmptyState
          illustration="bookings"
          title={copy.emptyTitle}
          message={copy.empty}
          action={
            <Button variant="secondary" href={hasOfferings ? HOST_ROUTES.offerings.list : HOST_ROUTES.create.category}>
              {hasOfferings ? copy.emptyCtaList : copy.emptyCtaOffer}
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-10">
          <Section title={copy.requests} empty={copy.emptyRequests} bookings={sections.requests} titles={titles} onAccept={accept} />
          <Section title={copy.upcoming} empty={copy.emptyUpcoming} bookings={sections.upcoming} titles={titles} />
          <Section title={copy.past} empty={copy.emptyPast} bookings={sections.past} titles={titles} />
        </div>
      )}
    </HostScreen>
  );
};
