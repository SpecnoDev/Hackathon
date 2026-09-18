'use client';

import { useEffect, useState } from 'react';
import type { TripSummary } from '@/shared/dto';

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
  onAdded: (trip: TripSummary) => void;
}) {
  const [trips, setTrips] = useState<TripSummary[] | null>(null);
  const [mode, setMode] = useState<Mode>('existing');
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/v1/trips')
      .then((res) => res.json())
      .then((body) => {
        setTrips(body.data);
        if (body.data.length === 0) setMode('new');
      });
  }, []);

  const selectedTrip = trips?.find((t) => t.id === selectedTripId);
  const canConfirm = mode === 'existing' ? !!selectedTrip : name.trim() && startDate && endDate;

  const addBlockToTrip = async (trip: TripSummary) => {
    await fetch(`/api/v1/trips/${trip.id}/blocks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: crypto.randomUUID(),
        offeringId,
        day: trip.startDate,
      }),
    });
    onAdded(trip);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      if (mode === 'existing' && selectedTrip) {
        await addBlockToTrip(selectedTrip);
        return;
      }

      const createRes = await fetch('/api/v1/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: crypto.randomUUID(), name: name.trim(), startDate, endDate }),
      });
      const { data: newTrip } = await createRes.json();
      await addBlockToTrip(newTrip);
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
          {trips === null ? (
            <p className="text-body-sm text-muted">Loading your trips…</p>
          ) : (
            <>
              {trips.length > 0 && (
                <div className="flex rounded-full bg-surface-soft p-1">
                  <button
                    type="button"
                    onClick={() => setMode('existing')}
                    className={`flex-1 rounded-full py-2 text-body-sm ${
                      mode === 'existing' ? 'bg-canvas text-ink shadow-lift' : 'text-muted'
                    }`}
                  >
                    Existing trip
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('new')}
                    className={`flex-1 rounded-full py-2 text-body-sm ${
                      mode === 'new' ? 'bg-canvas text-ink shadow-lift' : 'text-muted'
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
            className="h-12 w-full rounded-full bg-primary text-button-md text-on-primary disabled:bg-primary-disabled"
          >
            {isSubmitting ? 'Adding…' : mode === 'existing' ? 'Add to trip' : 'Create trip & add'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AddToTrip({
  offeringId,
  offeringTitle,
  trigger,
}: {
  offeringId: string;
  offeringTitle: string;
  trigger: 'sidebar' | 'sticky-bar';
}) {
  const [open, setOpen] = useState(false);
  const [addedTrip, setAddedTrip] = useState<TripSummary | null>(null);

  if (addedTrip) {
    return (
      <div
        className={`flex items-center justify-between rounded-lg bg-primary-tint px-4 py-3 ${trigger === 'sidebar' ? 'mt-4' : ''}`}
      >
        <span className="text-body-sm text-primary-text">
          ✓ Added to <strong>{addedTrip.name}</strong>
        </span>
        <button
          type="button"
          onClick={() => setAddedTrip(null)}
          className="text-caption text-primary-text underline"
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <>
      {trigger === 'sidebar' ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 h-12 w-full rounded-full bg-primary text-button-md text-on-primary"
        >
          Book
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="h-12 rounded-full bg-primary px-6 text-button-md text-on-primary"
        >
          Book
        </button>
      )}

      {open && (
        <TripSheet
          offeringId={offeringId}
          offeringTitle={offeringTitle}
          onClose={() => setOpen(false)}
          onAdded={setAddedTrip}
        />
      )}
    </>
  );
}
