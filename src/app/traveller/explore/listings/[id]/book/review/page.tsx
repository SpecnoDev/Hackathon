import { notFound } from 'next/navigation';
import { currentTravellerOrDemo } from '@/core/guards';
import { ReviewStep } from '@/features/demand/components';
import { getOfferingDetail } from '@/features/demand/services';

export const metadata = { title: 'Your booking' };

/** Step 3 of 4. Open to guests: sign-in waits until there is something to pay for. */
export default async function BookReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [offering, user] = await Promise.all([getOfferingDetail(id), currentTravellerOrDemo()]);
  if (!offering) notFound();

  const traveller = user?.traveller;

  return (
    <ReviewStep
      offering={offering}
      signedIn={Boolean(traveller)}
      defaults={traveller ? { name: traveller.name, phone: traveller.phone ?? '', language: traveller.language } : undefined}
    />
  );
}
