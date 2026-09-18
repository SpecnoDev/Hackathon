import { notFound } from 'next/navigation';
import { ROUTES } from '@/core/constants';
import { requireTravellerPage } from '@/core/guards';
import { TravellerScreen, TripDetailView } from '@/features/demand/components';
import { getTripDetail } from '@/features/demand/services';

export default async function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { traveller } = await requireTravellerPage();
  const { id } = await params;
  const trip = await getTripDetail(traveller.id, id);

  if (!trip) notFound();

  return (
    <TravellerScreen barTitle="Trip" backHref={ROUTES.trips} width="column">
      <TripDetailView trip={trip} />
    </TravellerScreen>
  );
}
