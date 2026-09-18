'use client';

import { useEffect, useState } from 'react';
import type { OfferingSummary } from '@/shared/dto';
import { Button, EmptyState } from '@/shared/components';
import { TRAVELLER_ROUTES } from '../constants';
import { ListingCardLink } from './ListingCardLink';

/** Saved ids come back fast from `/api/v1/saved`, but the offerings behind them need their own fetch since that route only returns ids. */
export const SavedFeed = () => {
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

  const removeSaved = (offeringId: string): void => {
    setOfferings((current) => current?.filter((offering) => offering.id !== offeringId) ?? current);
    fetch(`/api/v1/saved/${offeringId}`, { method: 'POST' }).catch(() => undefined);
  };

  if (offerings === null) return <p className="py-8 text-center text-body-md text-muted">Loading…</p>;

  if (offerings.length === 0) {
    return (
      <div className="mx-auto w-full max-w-host">
        <EmptyState
          illustration="offerings"
          title="Nothing saved yet"
          message="Tap the heart on a listing to keep it here for later."
          action={
            <Button size="md" variant="secondary" href={TRAVELLER_ROUTES.home}>
              Explore listings
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-10 tablet:grid-cols-2 desktop:grid-cols-3">
      {offerings.map((offering, index) => (
        <li key={offering.id}>
          <ListingCardLink offering={offering} saved onToggleSave={removeSaved} priority={index === 0} />
        </li>
      ))}
    </ul>
  );
};
