import { AllReviewsPage } from '@/features/demand/pages/listing';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AllReviewsPage listingId={id} />;
}
