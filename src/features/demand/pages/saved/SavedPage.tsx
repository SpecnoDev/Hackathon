'use client';

import { Button, EmptyState } from '@/shared/components';
import { ListingGrid, TravellerScreen } from '../../components';
import { COPY_ACCOUNT, TRAVELLER_ROUTES } from '../../constants';
import { useTravellerApp } from '../../hooks';
import { selectSavedListings } from '../../services/client';

const copy = COPY_ACCOUNT.saved;

/** Screen 19: everything the traveller put a heart on, in the same cards as Explore. The heart on each card takes it off again. */
export const SavedPage = () => {
  const listings = useTravellerApp(selectSavedListings);

  return (
    <TravellerScreen pageTitle={copy.title} showNav>
      {listings.length === 0 ? (
        <div className="mx-auto w-full max-w-host">
          <EmptyState
            illustration="offerings"
            title={copy.emptyTitle}
            message={copy.empty}
            action={
              <Button size="md" variant="secondary" href={TRAVELLER_ROUTES.home}>
                {copy.explore}
              </Button>
            }
          />
        </div>
      ) : (
        <ListingGrid listings={listings} />
      )}
    </TravellerScreen>
  );
};
