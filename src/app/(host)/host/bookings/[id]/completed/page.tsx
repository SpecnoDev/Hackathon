import { BookingCompletedPage } from '@/features/supply/pages/bookings';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <BookingCompletedPage bookingId={(await params).id} />;
}
