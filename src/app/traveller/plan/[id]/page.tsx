import { notFound } from 'next/navigation';
import { ROUTES } from '@/core/constants';
import { requireTravellerPage } from '@/core/guards';
import { TravellerShell } from '@/core/layout';
import { PlanBoard } from '@/features/planner/components';
import { PLANNER_COPY } from '@/features/planner/constants';
import { getPlannerTrip, listCandidateOfferings } from '@/features/planner/services';
import { TopBar } from '@/shared/components';

export const metadata = { title: PLANNER_COPY.bar.board };

export default async function PlanBoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { traveller } = await requireTravellerPage();
  const { id } = await params;
  const trip = await getPlannerTrip(traveller.id, id);
  if (!trip) notFound();

  const candidates = await listCandidateOfferings(trip.destination);

  return (
    <TravellerShell topBar={<TopBar title={PLANNER_COPY.bar.board} backHref={ROUTES.plan} backLabel={PLANNER_COPY.bar.back} />}>
      <PlanBoard trip={trip} candidates={candidates} />
    </TravellerShell>
  );
}
