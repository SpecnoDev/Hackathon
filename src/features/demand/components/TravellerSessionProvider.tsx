'use client';

import { createContext, useContext, type ReactNode } from 'react';

export interface TravellerSession {
  name: string;
}

const TravellerSessionContext = createContext<TravellerSession | null>(null);

/** Null for a visitor who has not signed in, and outside the traveller layout (the sign-in page). */
export const useTravellerSession = (): TravellerSession | null => useContext(TravellerSessionContext);

/** The layout resolves the session once per request; the client frame reads it here instead of fetching. */
export const TravellerSessionProvider = ({ traveller, children }: { traveller: TravellerSession | null; children: ReactNode }) => (
  <TravellerSessionContext.Provider value={traveller}>{children}</TravellerSessionContext.Provider>
);
