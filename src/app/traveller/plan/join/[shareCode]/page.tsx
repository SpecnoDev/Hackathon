import { notFound, redirect } from 'next/navigation';
import { ROUTES } from '@/core/constants';
import { requireTravellerPage } from '@/core/guards';
import { joinPlannerTrip } from '@/features/planner/services';

/** The invite link. Joining is the whole page, so it lands the traveller on the board straight away. */
export default async function JoinPlanPage({ params }: { params: Promise<{ shareCode: string }> }) {
  const { traveller } = await requireTravellerPage();
  const { shareCode } = await params;
  const trip = await joinPlannerTrip(traveller.id, shareCode);
  if (!trip) notFound();

  redirect(`${ROUTES.plan}/${trip.id}`);
}
