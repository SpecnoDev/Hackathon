'use client';

import { useEffect, type ReactNode } from 'react';
import { ToastProvider, useToast } from '@/shared/components';
import { formatRand } from '@/shared/utils';
import { HOST_COPY, HOST_ROUTES } from '../constants';
import { useHostApp, useHostAppReady, useOnline } from '../hooks';
import type { HostAppState, Payout } from '../interfaces';
import { hostAppStore, selectPayouts } from '../services';

const selectCheckDueAt = (state: HostAppState): string | undefined =>
  state.verification.state === 'CHECKING' ? state.verification.resolveAt : undefined;

const selectScheduledPayouts = (state: HostAppState): Payout[] =>
  selectPayouts(state).filter((payout) => payout.status === 'PENDING' && payout.autoSendAt);

const msUntil = (iso: string): number => Math.max(0, Date.parse(iso) - Date.now());

/**
 * Everything that happens "later": saved state loading, queued writes going up when signal returns,
 * and the mocked provider callbacks. Each one lands as a notice that opens the right screen.
 */
const HostAppEffects = () => {
  const toast = useToast();
  const online = useOnline();
  const ready = useHostAppReady();
  const checkDueAt = useHostApp(selectCheckDueAt);
  const scheduledPayouts = useHostApp(selectScheduledPayouts);

  useEffect(() => {
    void hostAppStore.hydrate();
  }, []);

  useEffect(() => {
    if (ready && online && hostAppStore.flushOutbox() > 0) toast(HOST_COPY.common.backOnline);
  }, [ready, online, toast]);

  useEffect(() => {
    if (!ready || !online || !checkDueAt) return undefined;
    const timer = setTimeout(() => {
      const verified = hostAppStore.resolveVerification() === 'VERIFIED';
      toast(verified ? HOST_COPY.verify.result.verifiedNotice : HOST_COPY.verify.result.failedNotice, HOST_ROUTES.verify.result);
    }, msUntil(checkDueAt));
    return () => clearTimeout(timer);
  }, [ready, online, checkDueAt, toast]);

  useEffect(() => {
    if (!ready || !online) return undefined;
    const timers = scheduledPayouts.map((payout) =>
      setTimeout(() => {
        hostAppStore.markPayoutSent(payout.id);
        toast(HOST_COPY.earnings.sentNotice(formatRand(payout.amountCents), payout.destination), HOST_ROUTES.earnings.payout(payout.id));
      }, msUntil(payout.autoSendAt ?? payout.expectedBy)),
    );
    return () => timers.forEach(clearTimeout);
  }, [ready, online, scheduledPayouts, toast]);

  return null;
};

export const HostAppProvider = ({ children }: { children: ReactNode }) => (
  <ToastProvider>
    <HostAppEffects />
    {children}
  </ToastProvider>
);
