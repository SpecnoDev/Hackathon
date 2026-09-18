import { notFound } from 'next/navigation';
import { requireTravellerPage } from '@/core/guards';
import { CancelBookingView, TravellerScreen } from '@/features/demand/components';
import { TRAVELLER_ROUTES } from '@/features/demand/constants';
import { getTravellerBooking, refundFor } from '@/features/demand/services';

const CANCELLABLE = ['REQUESTED', 'CONFIRMED'] as const;

export default async function CancelBookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { traveller } = await requireTravellerPage();
  const { id } = await params;
  const booking = await getTravellerBooking(traveller.id, id);

  if (!booking || !CANCELLABLE.includes(booking.status as (typeof CANCELLABLE)[number])) notFound();

  const refund = refundFor(booking, new Date());

  return (
    <TravellerScreen barTitle="Trip" backHref={TRAVELLER_ROUTES.bookings.detail(booking.id)} width="column">
      <CancelBookingView booking={booking} refund={refund} />
    </TravellerScreen>
  );
}
