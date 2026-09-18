import { notFound } from 'next/navigation';
import { GUIDED_FORM_FIELDS } from '@/features/supply/constants';
import { GuidedFormPage } from '@/features/supply/pages/create';

export default async function Page({ params }: { params: Promise<{ step: string }> }) {
  const step = Number((await params).step);
  if (!Number.isInteger(step) || step < 1 || step > GUIDED_FORM_FIELDS.length) notFound();
  return <GuidedFormPage step={step} />;
}
