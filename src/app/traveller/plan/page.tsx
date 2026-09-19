import { ROUTES } from '@/core/constants';
import { requireTravellerPage } from '@/core/guards';
import { TravellerShell } from '@/core/layout';
import { PlanTripForm, TripSummaryCard } from '@/features/planner/components';
import { PLANNER_COPY } from '@/features/planner/constants';
import { listDestinations, listPlannerTrips } from '@/features/planner/services';
import { addDays, toIsoDate } from '@/features/planner/utils';
import { TopBar } from '@/shared/components';

export const metadata = { title: PLANNER_COPY.bar.plan };

export default async function PlanPage() {
  const { traveller } = await requireTravellerPage();
  const [trips, destinations] = await Promise.all([listPlannerTrips(traveller.id), listDestinations()]);
  const copy = PLANNER_COPY.create;

  return (
    <TravellerShell width="column" topBar={<TopBar title={PLANNER_COPY.bar.plan} backHref={ROUTES.trips} backLabel={PLANNER_COPY.bar.back} />}>
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="font-display text-display-lg text-ink">{copy.title}</h1>
        <p className="text-body-md text-muted">{copy.sub}</p>
      </div>
      <PlanTripForm defaultDate={toIsoDate(addDays(new Date(), 1))} destinations={destinations} />
      <section className="mt-10 flex flex-col gap-3">
        <h2 className="text-title-lg text-ink">{copy.yourTrips}</h2>
        {trips.length ? trips.map((trip) => <TripSummaryCard key={trip.id} trip={trip} />) : <p className="text-body-md text-muted">{copy.noTrips}</p>}
      </section>
    </TravellerShell>
  );
}
