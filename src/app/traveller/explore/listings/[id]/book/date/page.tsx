import { notFound } from 'next/navigation';
import { ChooseDateStep } from '@/features/demand/components';
import { getOfferingDetail } from '@/features/demand/services';

export const metadata = { title: 'Your booking' };

/** Step 1 of 4. `?block=&day=` means the booking was started from a stop on a trip plan. */
export default async function BookDatePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ block?: string; day?: string }> }) {
  const [{ id }, { block, day }] = await Promise.all([params, searchParams]);
  const offering = await getOfferingDetail(id);
  if (!offering) notFound();

  return <ChooseDateStep offering={offering} block={block && day ? { id: block, day } : undefined} />;
}
