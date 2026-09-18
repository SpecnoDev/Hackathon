import { requireTravellerPage } from '@/core/guards';
import { SavedFeed, TravellerScreen } from '@/features/demand/components';

export const metadata = { title: 'Saved' };

export default async function SavedPage() {
  await requireTravellerPage();

  return (
    <TravellerScreen pageTitle="Saved" showNav>
      <SavedFeed />
    </TravellerScreen>
  );
}
