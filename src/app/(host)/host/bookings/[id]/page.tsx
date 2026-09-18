import { BookingDetailPage } from '@/features/supply/pages/bookings';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <BookingDetailPage bookingId={(await params).id} />;
}
