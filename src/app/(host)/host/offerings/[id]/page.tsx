import { OfferingDetailPage } from '@/features/supply/pages/offerings';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <OfferingDetailPage offeringId={(await params).id} />;
}
