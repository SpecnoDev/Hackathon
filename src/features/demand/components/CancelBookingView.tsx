'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { BookingSummary } from '@/shared/dto';
import { Banner, Button, OptionTile } from '@/shared/components';
import { formatRand } from '@/shared/utils';
import { CANCEL_REASON_LABEL, CANCEL_REASONS, TRAVELLER_ROUTES, type CancelReason } from '../constants';
import type { Refund } from '../services';

/** Why, then exactly what comes back, before the one button that cannot be undone. */
export const CancelBookingView = ({ booking, refund }: { booking: BookingSummary; refund: Refund }) => {
  const router = useRouter();
  const [reason, setReason] = useState<CancelReason>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  const confirm = async (): Promise<void> => {
    if (!reason) return;
    setBusy(true);
    setError(undefined);
    try {
      const res = await fetch(`/api/v1/bookings/${booking.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: CANCEL_REASON_LABEL[reason] }),
      });
      if (!res.ok) throw new Error();
      router.replace(TRAVELLER_ROUTES.bookings.detail(booking.id));
    } catch {
      setError('Could not cancel this booking. Try again in a moment.');
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-display-lg text-ink">Cancel this booking?</h1>
        <p className="mt-2 text-body-md text-muted">Tell us why, so we can pass it on.</p>
      </div>

      <div role="radiogroup" aria-label="Reason" className="flex flex-col gap-3">
        {CANCEL_REASONS.map((option) => (
          <OptionTile key={option} title={CANCEL_REASON_LABEL[option]} selected={reason === option} onSelect={() => setReason(option)} />
        ))}
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-title-lg text-ink">What you get back</h2>
        <Banner tone={refund.kind === 'FULL' ? 'success' : refund.kind === 'PARTIAL' ? 'warning' : 'info'}>
          <p className="text-title-sm">{refund.kind === 'NONE' ? 'No refund' : `${formatRand(refund.cents)} refund`}</p>
        </Banner>
      </section>

      {error ? <Banner tone="error">{error}</Banner> : null}

      <div className="flex flex-col gap-3">
        <Button variant="destructive" disabled={!reason || busy} onClick={() => void confirm()}>
          {busy ? 'Cancelling…' : 'Cancel booking'}
        </Button>
        <Button variant="secondary" href={TRAVELLER_ROUTES.bookings.detail(booking.id)}>
          Keep booking
        </Button>
      </div>
    </div>
  );
};
