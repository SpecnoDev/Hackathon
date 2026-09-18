'use client';

import { Button, EmptyState, Icon, OptionTile } from '@/shared/components';
import { TravellerScreen, TripCard } from '../../components';
import { COPY_TRIPS, TRAVELLER_ROUTES } from '../../constants';
import { useTravellerApp } from '../../hooks';
import type { TravellerAppState } from '../../interfaces';
import { selectTripSections, type TripWithListing } from '../../services/client';

const copy = COPY_TRIPS.list;
const selectSections = (state: TravellerAppState): ReturnType<typeof selectTripSections> => selectTripSections(state, new Date());

const Section = ({ title, empty, trips }: { title: string; empty: string; trips: TripWithListing[] }) => (
  <section className="flex flex-col gap-4">
    <h2 className="text-title-lg text-ink">{title}</h2>
    {trips.length === 0 ? (
      <p className="text-body-md text-muted">{empty}</p>
    ) : (
      <ul className="grid grid-cols-1 gap-x-6 gap-y-8 tablet:grid-cols-2 desktop:grid-cols-3">
        {trips.map(({ trip, listing }) => (
          <li key={trip.id}>
            <TripCard trip={trip} listing={listing} />
          </li>
        ))}
      </ul>
    )}
  </section>
);

/** Screen 13: what is coming up, soonest first, then what has been. Trip plans hang off the bottom because they have no tab of their own. */
export const TripsPage = () => {
  const { upcoming, past } = useTravellerApp(selectSections);
  const plans = (
    <OptionTile
      icon="route"
      title={copy.plans}
      description={copy.plansHint}
      href={TRAVELLER_ROUTES.plans.list}
      trailing={<Icon name="chevron-right" className="shrink-0 text-muted" />}
    />
  );

  return (
    <TravellerScreen pageTitle={copy.title} showNav>
      {upcoming.length + past.length === 0 ? (
        // One designed empty state for the whole tab, not one per empty section.
        <div className="mx-auto flex w-full max-w-host flex-col gap-6">
          <EmptyState
            illustration="bookings"
            title={copy.emptyTitle}
            message={copy.empty}
            action={
              <Button size="md" variant="secondary" href={TRAVELLER_ROUTES.home}>
                {copy.emptyCta}
              </Button>
            }
          />
          {plans}
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          <Section title={copy.upcoming} empty={copy.emptyUpcoming} trips={upcoming} />
          <Section title={copy.past} empty={copy.emptyPast} trips={past} />
          <div className="w-full max-w-host">{plans}</div>
        </div>
      )}
    </TravellerScreen>
  );
};
