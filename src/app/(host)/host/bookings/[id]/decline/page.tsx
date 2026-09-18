import { RespondToBookingPage } from '@/features/supply/pages/bookings';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <RespondToBookingPage bookingId={(await params).id} mode="decline" />;
}
