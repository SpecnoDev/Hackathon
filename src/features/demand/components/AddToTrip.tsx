'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { HTTP_STATUS, ROUTES, SYNC_COPY } from '@/core/constants';
import { submitWrite } from '@/core/offline';
import { Button } from '@/shared/components';
import type { TripSummary } from '@/shared/dto';
import { COPY_LISTING, TRAVELLER_ROUTES, TRIPS_PATH, tripBlocksPath } from '../constants';

type Mode = 'existing' | 'new';

function TripSheet({
  offeringId,
  offeringTitle,
  onClose,
  onAdded,
}: {
  offeringId: string;
  offeringTitle: string;
  onClose: () => void;
  onAdded: (trip: TripSummary, queued: boolean) => void;
}) {
  const [trips, setTrips] = useState<TripSummary[] | null>(null);
  const [signedOut, setSignedOut] = useState(false);
  const [mode, setMode] = useState<Mode>('existing');
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Offline the service worker answers from its cache, or with an OFFLINE envelope carrying no
    // data — either way the sheet has to open, so a traveller can still start a trip with no signal.
    const load = (data: TripSummary[]) => {
      setTrips(data);
      if (data.length === 0) setMode('new');
    };

    fetch(TRIPS_PATH)
      .then(async (res) => {
        if (res.status === HTTP_STATUS.unauthorized) return setSignedOut(true);
        load((await res.json()).data ?? []);
      })
      .catch(() => load([]));
  }, []);

  const selectedTrip = mode === 'existing' ? trips?.find((t) => t.id === selectedTripId) : undefined;
  const canConfirm = !signedOut && (mode === 'existing' ? !!selectedTrip : name.trim() && startDate && endDate);

  /**
   * Both writes go through the outbox, so the phone keeps them before the network sees them. A new
   * trip is built here rather than read back from the response: offline there is no response, and
   * both routes upsert by this id, so the replay that follows is a no-op rather than a duplicate.
   */
  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const trip: TripSummary = selectedTrip ?? {
        id: crypto.randomUUID(),
        name: name.trim(),
        startDate,
        endDate,
      };

      const tripSent = selectedTrip ? true : await submitWrite(TRIPS_PATH, 'POST', trip);
      const blockSent = await submitWrite(tripBlocksPath(trip.id), 'POST', {
        id: crypto.randomUUID(),
        offeringId,
        day: trip.startDate,
      });

      onAdded(trip, !tripSent || !blockSent);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-scrim/50" />
      <div className="relative flex max-h-[85vh] flex-col rounded-t-xl bg-canvas shadow-lift">
        <div className="flex shrink-0 items-center justify-between border-b border-hairline px-5 py-4">
          <h1 className="text-title-md text-ink">Add to a trip</h1>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full hover:bg-surface-soft"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <p className="px-5 pt-4 text-body-sm text-muted">{offeringTitle}</p>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {signedOut ? (
            <div className="flex flex-col items-start gap-3">
              <p className="text-body-sm text-muted">Sign in to add this to a trip.</p>
              <Link href={ROUTES.login} className="text-body-sm text-primary-text underline">
                Sign in
              </Link>
            </div>
          ) : trips === null ? (
            <p className="text-body-sm text-muted">Loading your trips…</p>
          ) : (
            <>
              {trips.length > 0 && (
                <div className="flex rounded-sm bg-surface-soft p-1">
                  <button
                    type="button"
                    onClick={() => setMode('existing')}
                    className={`flex-1 rounded-xs py-2 text-body-sm ${
                      mode === 'existing' ? 'bg-primary text-on-primary' : 'text-muted'
                    }`}
                  >
                    Existing trip
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('new')}
                    className={`flex-1 rounded-xs py-2 text-body-sm ${
                      mode === 'new' ? 'bg-primary text-on-primary' : 'text-muted'
                    }`}
                  >
                    New trip
                  </button>
                </div>
              )}

              {mode === 'existing' ? (
                <div className="mt-4 flex flex-col gap-2">
                  {trips.map((trip) => (
                    <button
                      key={trip.id}
                      type="button"
                      onClick={() => setSelectedTripId(trip.id)}
                      className={`rounded-lg border p-4 text-left ${
                        selectedTripId === trip.id ? 'border-primary bg-primary-tint' : 'border-hairline'
                      }`}
                    >
                      <p className="text-title-sm text-ink">{trip.name}</p>
                      <p className="mt-0.5 text-body-sm text-muted">
                        {trip.startDate} – {trip.endDate}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-4 flex flex-col gap-3">
                  <div>
                    <label className="block text-caption text-muted" htmlFor="trip-name">
                      Trip name
                    </label>
                    <input
                      id="trip-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Cape Town long weekend"
                      className="mt-1 h-11 w-full rounded-md border border-hairline px-3 text-body-md text-ink"
                    />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-caption text-muted" htmlFor="start-date">
                        Start
                      </label>
                      <input
                        id="start-date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mt-1 h-11 w-full rounded-md border border-hairline px-3 text-body-sm text-ink"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-caption text-muted" htmlFor="end-date">
                        End
                      </label>
                      <input
                        id="end-date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="mt-1 h-11 w-full rounded-md border border-hairline px-3 text-body-sm text-ink"
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="shrink-0 border-t border-hairline px-5 py-4">
          <button
            type="button"
            disabled={!canConfirm || isSubmitting}
            onClick={handleConfirm}
            className="h-12 w-full rounded-md bg-primary text-button-md text-on-primary disabled:bg-primary-disabled"
          >
            {isSubmitting ? 'Adding…' : mode === 'existing' ? 'Add to trip' : 'Create trip & add'}
          </button>
        </div>
      </div>
    </div>
  );
}

/** The listing's secondary action: put this on a co-created trip plan, to vote on and book later. */
export function AddToTrip({ offeringId, offeringTitle }: { offeringId: string; offeringTitle: string }) {
  const [open, setOpen] = useState(false);
  const [added, setAdded] = useState<{ trip: TripSummary; queued: boolean } | null>(null);

  if (added) {
    return (
      <div
        className="flex items-center justify-between gap-3 rounded-lg bg-primary-tint px-4 py-3"
      >
        <span className="text-body-sm text-primary-text">
          ✓ Added to <strong>{added.trip.name}</strong>
          {added.queued && <span className="block text-caption">{SYNC_COPY.queued}</span>}
        </span>
        <Link href={TRAVELLER_ROUTES.trips.detail(added.trip.id)} className="text-caption text-primary-text underline">
          View trip
        </Link>
      </div>
    );
  }

  return (
    <>
      <Button size="md" variant="secondary" icon="route" onClick={() => setOpen(true)}>
        {COPY_LISTING.addToTrip}
      </Button>

      {open && (
        <TripSheet
          offeringId={offeringId}
          offeringTitle={offeringTitle}
          onClose={() => setOpen(false)}
          onAdded={(trip, queued) => setAdded({ trip, queued })}
        />
      )}
    </>
  );
}
