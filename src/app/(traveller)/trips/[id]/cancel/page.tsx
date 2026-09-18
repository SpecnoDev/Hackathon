import { CancelTripPage } from '@/features/demand/pages/trips';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <CancelTripPage tripId={(await params).id} />;
}
