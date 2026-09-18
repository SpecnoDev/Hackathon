import { notFound } from 'next/navigation';
import { NEW_DRAFT_KEY, isDraftRowId } from '@/features/supply/constants';
import { DraftRowPage } from '@/features/supply/pages/create';

export default async function Page({ params }: { params: Promise<{ field: string }> }) {
  const { field } = await params;
  if (!isDraftRowId(field)) notFound();
  return <DraftRowPage draftKey={NEW_DRAFT_KEY} row={field} />;
}
