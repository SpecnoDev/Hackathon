'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { TripDetail } from '@/shared/dto';
import { Banner, Button, Icon } from '@/shared/components';
import { formatRand } from '@/shared/utils';
import { COPY_TRIP, TRAVELLER_ROUTES } from '../constants';

const post = (path: string, body?: unknown): Promise<Response> =>
  fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });

/** The co-created itinerary: every block a member added, votes, and — for the organiser — locking it in for checkout. */
export const TripDetailView = ({ trip: initialTrip }: { trip: TripDetail }) => {
  const router = useRouter();
  const [trip, setTrip] = useState(initialTrip);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  const vote = async (blockId: string, up: boolean): Promise<void> => {
    setTrip((current) => ({
      ...current,
      blocks: current.blocks.map((block) =>
        block.id === blockId
          ? {
              ...block,
              upVotes: block.myVote === true ? block.upVotes - 1 : up ? block.upVotes + 1 : block.upVotes,
              downVotes: block.myVote === false ? block.downVotes - 1 : !up ? block.downVotes + 1 : block.downVotes,
              myVote: up,
            }
          : block,
      ),
    }));
    await post(`/api/v1/blocks/${blockId}/vote`, { up });
  };

  const removeBlock = async (blockId: string): Promise<void> => {
    setTrip((current) => ({ ...current, blocks: current.blocks.filter((block) => block.id !== blockId) }));
    await fetch(`/api/v1/blocks/${blockId}`, { method: 'DELETE' });
  };

  const lockAndCheckout = async (): Promise<void> => {
    setBusy(true);
    setError(undefined);
    try {
      const lockRes = await post(`/api/v1/trips/${trip.id}/lock`);
      if (!lockRes.ok) throw new Error();
      const checkoutRes = await post(`/api/v1/trips/${trip.id}/checkout`);
      const body = await checkoutRes.json();
      if (!checkoutRes.ok) throw new Error(body.error?.message);
      router.push(TRAVELLER_ROUTES.trips.list);
    } catch {
      setError('Could not check out this trip. Try again in a moment.');
      setBusy(false);
    }
  };

  const total = trip.blocks.reduce((sum, block) => sum + block.priceCents, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-display-lg text-ink">{trip.name}</h1>
        <p className="mt-1 text-body-sm text-muted">
          {trip.startDate} – {trip.endDate} · {trip.memberCount === 1 ? '1 traveller' : `${trip.memberCount} travellers`}
        </p>
      </div>

      {trip.locked ? <Banner tone="info">This trip is locked — no more changes, ready for checkout.</Banner> : null}
      {error ? <Banner tone="error">{error}</Banner> : null}

      {trip.blocks.length === 0 ? (
        <p className="text-body-md text-muted">No listings added yet. Add one from Explore.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {trip.blocks.map((block) => (
            <li key={block.id} className="flex flex-col gap-3 rounded-lg border border-hairline p-4">
              <div className="flex items-start gap-4">
                <span className="relative aspect-square w-16 shrink-0 overflow-hidden rounded-md bg-surface-soft">
                  {block.offeringPhoto ? <Image src={block.offeringPhoto} alt="" fill className="object-cover" sizes="64px" /> : null}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="text-title-sm text-ink">{block.offeringTitle}</p>
                  <p className="text-body-sm text-muted">{block.day} · {formatRand(block.priceCents)}</p>
                </div>
              </div>
              {block.bookingId ? (
                <Link href={TRAVELLER_ROUTES.bookings.detail(block.bookingId)} className="flex min-h-12 items-center gap-2 border-t border-hairline-soft pt-3 text-link text-primary-text underline">
                  <Icon name="circle-check" size={16} />
                  {COPY_TRIP.booked}
                </Link>
              ) : !trip.locked ? (
                <Link href={TRAVELLER_ROUTES.book.date(block.offeringId, { id: block.id, day: block.day })} className="flex min-h-12 items-center gap-2 border-t border-hairline-soft pt-3 text-link text-primary-text underline">
                  <Icon name="calendar-check" size={16} />
                  {COPY_TRIP.bookStop}
                </Link>
              ) : null}
              {!trip.locked ? (
                <div className="flex items-center justify-between border-t border-hairline-soft pt-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-pressed={block.myVote === true}
                      onClick={() => void vote(block.id, true)}
                      className={`flex items-center gap-1 text-body-sm ${block.myVote === true ? 'text-primary-text' : 'text-muted'}`}
                    >
                      <Icon name="arrow-up" size={16} /> {block.upVotes}
                    </button>
                    <button
                      type="button"
                      aria-pressed={block.myVote === false}
                      onClick={() => void vote(block.id, false)}
                      className={`flex items-center gap-1 text-body-sm ${block.myVote === false ? 'text-error' : 'text-muted'}`}
                    >
                      <Icon name="arrow-down" size={16} /> {block.downVotes}
                    </button>
                  </div>
                  <button type="button" aria-label={`Remove ${block.offeringTitle}`} onClick={() => void removeBlock(block.id)} className="text-muted">
                    <Icon name="trash" size={18} />
                  </button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      {trip.isOrganiser && !trip.locked && trip.blocks.length > 0 ? (
        <div className="flex flex-col gap-2 border-t border-hairline-soft pt-6">
          <p className="flex items-baseline justify-between text-title-md text-ink">
            <span>Total</span>
            <span>{formatRand(total)}</span>
          </p>
          <Button size="md" disabled={busy} onClick={() => void lockAndCheckout()}>
            {busy ? 'Checking out…' : 'Lock and check out'}
          </Button>
        </div>
      ) : null}
    </div>
  );
};
