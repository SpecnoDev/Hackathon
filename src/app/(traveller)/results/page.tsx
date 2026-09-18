import { ResultsPage } from '@/features/demand/pages/explore';

export default async function Page({ searchParams }: { searchParams: Promise<{ sheet?: string }> }) {
  const { sheet } = await searchParams;
  return <ResultsPage filtersOpen={sheet === 'filters'} />;
}
