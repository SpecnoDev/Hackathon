import { notFound } from 'next/navigation';
import { USER_ROLES } from '@/core/constants';
import { currentUser } from '@/core/guards';
import { PaymentStep } from '@/features/demand/components';
import { getOfferingDetail } from '@/features/demand/services';

export const metadata = { title: 'Your booking' };

export default async function BookPayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [offering, user] = await Promise.all([getOfferingDetail(id), currentUser()]);
  if (!offering) notFound();

  return <PaymentStep offering={offering} signedIn={user?.role === USER_ROLES.traveller} />;
}
