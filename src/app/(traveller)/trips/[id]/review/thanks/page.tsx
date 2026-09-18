import { ReviewThanksPage } from '@/features/demand/pages/review';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ReviewThanksPage tripId={(await params).id} />;
}
