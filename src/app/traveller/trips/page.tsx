import { requireTravellerPage } from '@/core/guards';
import { BookingCard, OpenTripCard, TravellerScreen } from '@/features/demand/components';
import { listOpenTrips, listTravellerBookings } from '@/features/demand/services';
import { EmptyState } from '@/shared/components';

const PAST_STATUSES = ['COMPLETED', 'CANCELLED', 'DECLINED'] as const;

export const metadata = { title: 'Trips' };

export default async function TripsPage() {
  const { traveller } = await requireTravellerPage();
  const [openTrips, bookings] = await Promise.all([
    listOpenTrips(traveller.id),
    listTravellerBookings(traveller.id),
  ]);

  const upcoming = bookings.filter((booking) => !PAST_STATUSES.includes(booking.status as (typeof PAST_STATUSES)[number]));
  const past = bookings.filter((booking) => PAST_STATUSES.includes(booking.status as (typeof PAST_STATUSES)[number]));

  return (
    <TravellerScreen pageTitle="Trips" showNav>

      {openTrips.length + bookings.length === 0 ? (
        <EmptyState
          illustration="bookings"
          title="No trips yet"
          message="Add a listing to a trip to start planning, or book one to see it here."
          action={null}
        />
      ) : (
        <div className="flex flex-col gap-10">
          {openTrips.length > 0 ? (
            <section className="flex flex-col gap-4">
              <h2 className="text-title-lg text-ink">Planning</h2>
              <div className="flex flex-col gap-3">
                {openTrips.map((trip) => (
                  <OpenTripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </section>
          ) : null}

          <section className="flex flex-col gap-4">
            <h2 className="text-title-lg text-ink">Upcoming</h2>
            {upcoming.length === 0 ? (
              <p className="text-body-md text-muted">Nothing booked yet.</p>
            ) : (
              <ul className="grid grid-cols-1 gap-x-6 gap-y-8 tablet:grid-cols-2 desktop:grid-cols-3">
                {upcoming.map((booking) => (
                  <li key={booking.id}>
                    <BookingCard booking={booking} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          {past.length > 0 ? (
            <section className="flex flex-col gap-4">
              <h2 className="text-title-lg text-ink">Past</h2>
              <ul className="grid grid-cols-1 gap-x-6 gap-y-8 tablet:grid-cols-2 desktop:grid-cols-3">
                {past.map((booking) => (
                  <li key={booking.id}>
                    <BookingCard booking={booking} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      )}
    </TravellerScreen>
  );
}
