'use client';

import { useEffect, type ReactNode } from 'react';
import { ToastProvider } from '@/shared/components';
import { travellerAppStore } from '../services/client';

const LoadSavedState = () => {
  useEffect(() => {
    void travellerAppStore.hydrate();
  }, []);
  return null;
};

/** Loads what this traveller saved on the device, and gives every screen the same toast the host app uses. */
export const TravellerAppProvider = ({ children }: { children: ReactNode }) => (
  <ToastProvider>
    <LoadSavedState />
    {children}
  </ToastProvider>
);
