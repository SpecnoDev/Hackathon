import { notFound } from 'next/navigation';
import { isDraftRowId } from '@/features/supply/constants';
import { DraftRowPage } from '@/features/supply/pages/create';

export default async function Page({ params }: { params: Promise<{ id: string; field: string }> }) {
  const { id, field } = await params;
  if (!isDraftRowId(field)) notFound();
  return <DraftRowPage draftKey={id} row={field} />;
}
