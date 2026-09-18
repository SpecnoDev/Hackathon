'use client';

import { useCallback, useEffect, useState } from 'react';
import { RECENT_SEARCHES_KEPT, RECENT_SEARCHES_KEY } from '../constants';

const read = (): string[] => {
  try {
    const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
};

/** A per-phone convenience, so it lives in localStorage and never leaves the device. Reads after mount so the server and client agree. */
export const useRecentSearches = () => {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => setRecent(read()), []);

  const remember = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const next = [trimmed, ...read().filter((item) => item !== trimmed)].slice(0, RECENT_SEARCHES_KEPT);
    try {
      window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
    } catch {
      return;
    }
    setRecent(next);
  }, []);

  return { recent, remember };
};
