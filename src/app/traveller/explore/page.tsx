import { ExploreFeed, ExploreHero, TravellerScreen } from '@/features/demand/components';
import { listLiveOfferings, listLiveRegions, listRegionsWithSample } from '@/features/demand/services';

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ region?: string }> }) {
  const { region } = await searchParams;
  const [offerings, regions, places] = await Promise.all([listLiveOfferings({ region }), listLiveRegions(), listRegionsWithSample()]);

  return (
    <TravellerScreen lead={<ExploreHero />} showNav>
      <ExploreFeed initialOfferings={offerings} regions={regions} places={places} initialRegion={region} />
    </TravellerScreen>
  );
}
