import { EditOfferingPage } from '@/features/supply/pages/offerings';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <EditOfferingPage offeringId={(await params).id} />;
}
