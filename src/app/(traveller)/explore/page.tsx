import { ExploreFeed } from '@/features/demand/components';
import { listLiveOfferings, listLiveRegions } from '@/features/demand/services';

export default async function ExplorePage() {
  const [offerings, regions] = await Promise.all([listLiveOfferings({}), listLiveRegions()]);

  return <ExploreFeed initialOfferings={offerings} regions={regions} />;
}
