import { PlanDetailPage } from '@/features/demand/pages/plans';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PlanDetailPage planId={id} />;
}
