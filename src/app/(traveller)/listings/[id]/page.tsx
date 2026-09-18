import { ListingDetailPage } from '@/features/demand/pages/listing';

export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ sheet?: string }> }) {
  const [{ id }, { sheet }] = await Promise.all([params, searchParams]);
  return <ListingDetailPage listingId={id} initialSheet={sheet === 'share' || sheet === 'plan' ? sheet : undefined} />;
}
