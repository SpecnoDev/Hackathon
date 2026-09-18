'use client';

import { useCallback, useEffect, useState } from 'react';
import type { GuestDetails, PaymentMethod } from '@/shared/dto';
import { bookingDraftKey } from '../constants';

export interface BookingDraft {
  /** "YYYY-MM-DD". */
  date?: string;
  /** "HH:MM", or null when the host will confirm a time. */
  time?: string | null;
  guests: number;
  guest?: GuestDetails;
  paymentMethod?: PaymentMethod;
  /** The trip stop this booking is for, when it was started from a plan. */
  blockId?: string;
}

const read = (key: string, guests: number): BookingDraft => {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? { guests, ...(JSON.parse(raw) as Partial<BookingDraft>) } : { guests };
  } catch {
    return { guests };
  }
};

/**
 * What the four booking steps share, kept on this phone for the length of the tab so a sign-in in the middle of the
 * flow does not lose it. Card details never go in here. `ready` is false until the saved draft has been read after mount.
 */
export const useBookingDraft = (offeringId: string, defaultGuests: number) => {
  const key = bookingDraftKey(offeringId);
  const [draft, setDraft] = useState<BookingDraft>({ guests: defaultGuests });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDraft(read(key, defaultGuests));
    setReady(true);
  }, [key, defaultGuests]);

  const patch = useCallback(
    (change: Partial<BookingDraft>) =>
      setDraft((current) => {
        const next = { ...current, ...change };
        try {
          window.sessionStorage.setItem(key, JSON.stringify(next));
        } catch {
          return next;
        }
        return next;
      }),
    [key],
  );

  const clear = useCallback(() => {
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      return;
    }
  }, [key]);

  return { draft, patch, clear, ready };
};
