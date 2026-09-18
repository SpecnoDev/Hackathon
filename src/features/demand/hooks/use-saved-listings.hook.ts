'use client';

import { useCallback, useEffect, useState } from 'react';

const flip = (ids: Set<string>, offeringId: string): Set<string> => {
  const next = new Set(ids);
  next.has(offeringId) ? next.delete(offeringId) : next.add(offeringId);
  return next;
};

export interface SavedListingsState {
  savedIds: Set<string>;
  /** Resolves to the saved state the server settled on; undefined when it refused (signed out). */
  toggleSaved: (offeringId: string) => Promise<boolean | undefined>;
}

/**
 * Fetches this traveller's saved offering ids once, then toggles optimistically against the real `/api/v1/saved` route.
 * A refused toggle (signed out) is put back, so the heart never lies. Held once per app in SavedListingsProvider.
 */
export const useSavedListingsState = (): SavedListingsState => {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('/api/v1/saved')
      .then((res) => res.json())
      .then((body: { data?: string[] }) => setSavedIds(new Set(body.data ?? [])))
      .catch(() => undefined);
  }, []);

  const toggleSaved = useCallback(async (offeringId: string): Promise<boolean | undefined> => {
    setSavedIds((current) => flip(current, offeringId));
    try {
      const body = (await (await fetch(`/api/v1/saved/${offeringId}`, { method: 'POST' })).json()) as { data?: { saved: boolean } };
      if (body.data === undefined) throw new Error();
      const saved = body.data.saved;
      setSavedIds((current) => {
        const next = new Set(current);
        saved ? next.add(offeringId) : next.delete(offeringId);
        return next;
      });
      return saved;
    } catch {
      setSavedIds((current) => flip(current, offeringId));
      return undefined;
    }
  }, []);

  return { savedIds, toggleSaved };
};
