import { BookingConfirmedPage } from '@/features/demand/pages/book';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BookingConfirmedPage tripId={id} />;
}
