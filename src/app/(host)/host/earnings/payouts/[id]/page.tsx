import { PayoutPage } from '@/features/supply/pages/earnings';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <PayoutPage payoutId={(await params).id} />;
}
