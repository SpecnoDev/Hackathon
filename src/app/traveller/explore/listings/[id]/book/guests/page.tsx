import { notFound } from 'next/navigation';
import { GuestsStep } from '@/features/demand/components';
import { getOfferingDetail } from '@/features/demand/services';

export const metadata = { title: 'Your booking' };

export default async function BookGuestsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const offering = await getOfferingDetail(id);
  if (!offering) notFound();

  return <GuestsStep offering={offering} />;
}
