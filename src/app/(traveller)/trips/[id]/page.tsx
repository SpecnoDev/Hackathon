import type { TravellerSheet } from '@/features/demand/constants';
import { TripDetailPage } from '@/features/demand/pages/trips';

export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ sheet?: string }> }) {
  const [{ id }, { sheet }] = await Promise.all([params, searchParams]);
  return <TripDetailPage tripId={id} openSafety={sheet === ('safety' satisfies TravellerSheet)} />;
}
