import { notFound } from 'next/navigation';
import { currentTravellerOrDemo } from '@/core/guards';
import { PaymentStep } from '@/features/demand/components';
import { getOfferingDetail } from '@/features/demand/services';

export const metadata = { title: 'Your booking' };

export default async function BookPayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [offering, user] = await Promise.all([getOfferingDetail(id), currentTravellerOrDemo()]);
  if (!offering) notFound();

  return <PaymentStep offering={offering} signedIn={Boolean(user)} />;
}
