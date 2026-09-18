import { ReviewBookingPage } from '@/features/demand/pages/book';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReviewBookingPage listingId={id} />;
}
