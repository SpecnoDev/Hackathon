'use client';

import { useEffect, useState } from 'react';
import type { OfferingSummary } from '@/shared/dto';
import { Button, EmptyState } from '@/shared/components';
import { COPY_ACCOUNT, TRAVELLER_ROUTES } from '../constants';
import { ListingGrid } from './ListingGrid';
import { useSavedListings } from './SavedListingsProvider';

/** The provider holds the ids; the offerings behind them need their own fetch since `/api/v1/saved` only returns ids. */
export const SavedFeed = () => {
  const { savedIds } = useSavedListings();
  const [offerings, setOfferings] = useState<OfferingSummary[] | null>(null);

  useEffect(() => {
    fetch('/api/v1/saved')
      .then((res) => res.json())
      .then(async (body: { data?: string[] }) => {
        const ids = body.data ?? [];
        if (ids.length === 0) return setOfferings([]);
        const res = await fetch(`/api/v1/offerings?ids=${ids.join(',')}`);
        const { data } = (await res.json()) as { data: OfferingSummary[] };
        setOfferings(data);
      })
      .catch(() => setOfferings([]));
  }, []);

  if (offerings === null) return <p className="py-8 text-center text-body-md text-muted">{COPY_ACCOUNT.saved.loading}</p>;

  const shown = offerings.filter((offering) => savedIds.has(offering.id));

  if (shown.length === 0) {
    return (
      <div className="mx-auto w-full max-w-host">
        <EmptyState
          illustration="offerings"
          title={COPY_ACCOUNT.saved.emptyTitle}
          message={COPY_ACCOUNT.saved.empty}
          action={
            <Button size="md" variant="secondary" href={TRAVELLER_ROUTES.home}>
              {COPY_ACCOUNT.saved.explore}
            </Button>
          }
        />
      </div>
    );
  }

  return <ListingGrid offerings={shown} />;
};
