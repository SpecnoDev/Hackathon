'use client';

import { useCallback, useEffect, useState } from 'react';

const flip = (ids: Set<string>, offeringId: string): Set<string> => {
  const next = new Set(ids);
  next.has(offeringId) ? next.delete(offeringId) : next.add(offeringId);
  return next;
};

/**
 * Fetches this traveller's saved offering ids once, then toggles optimistically against the real `/api/v1/saved` route.
 * A refused toggle (signed out) is put back and reported, so the heart never lies.
 */
export const useSavedListings = (onRejected?: () => void) => {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('/api/v1/saved')
      .then((res) => res.json())
      .then((body: { data?: string[] }) => setSavedIds(new Set(body.data ?? [])))
      .catch(() => undefined);
  }, []);

  const toggleSaved = useCallback(
    (offeringId: string) => {
      setSavedIds((current) => flip(current, offeringId));

      fetch(`/api/v1/saved/${offeringId}`, { method: 'POST' })
        .then((res) => res.json())
        .then((body: { data?: { saved: boolean } }) => {
          if (body.data === undefined) throw new Error();
          setSavedIds((current) => {
            const next = new Set(current);
            body.data!.saved ? next.add(offeringId) : next.delete(offeringId);
            return next;
          });
        })
        .catch(() => {
          setSavedIds((current) => flip(current, offeringId));
          onRejected?.();
        });
    },
    [onRejected],
  );

  return { savedIds, toggleSaved };
};
