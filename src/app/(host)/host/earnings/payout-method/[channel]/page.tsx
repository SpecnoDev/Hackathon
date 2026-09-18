import { notFound } from 'next/navigation';
import { payoutChannelFromSlug } from '@/features/supply/constants';
import { PayoutDetailsPage } from '@/features/supply/pages/earnings';

export default async function Page({ params }: { params: Promise<{ channel: string }> }) {
  const channel = payoutChannelFromSlug((await params).channel);
  if (!channel) notFound();
  return <PayoutDetailsPage channel={channel} />;
}
