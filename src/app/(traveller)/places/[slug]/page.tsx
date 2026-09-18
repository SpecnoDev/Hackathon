import { PlacePage } from '@/features/demand/pages/explore';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PlacePage slug={slug} />;
}
