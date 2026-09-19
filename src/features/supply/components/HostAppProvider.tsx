'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ToastProvider, useToast } from '@/shared/components';
import { formatRand } from '@/shared/utils';
import { HOST_COPY, HOST_ROUTES, isDemoMode } from '../constants';
import { useHostApp, useHostAppReady, useOnline } from '../hooks';
import type { HostAppState, Payout } from '../interfaces';
import { hostAppStore, selectIsSignedIn, selectPayouts } from '../services';

const selectCheckDueAt = (state: HostAppState): string | undefined =>
  state.verification.state === 'CHECKING' ? state.verification.resolveAt : undefined;

const selectScheduledPayouts = (state: HostAppState): Array<Payout & { autoSendAt: string }> =>
  selectPayouts(state).filter((payout): payout is Payout & { autoSendAt: string } => payout.status === 'PENDING' && Boolean(payout.autoSendAt));

const msUntil = (iso: string): number => Math.max(0, Date.parse(iso) - Date.now());

/** Routes a visitor with no active host must still be able to reach: landing, registration, and the demo persona switcher. */
const SIGNED_OUT_PREFIXES = [HOST_ROUTES.welcome, `${HOST_ROUTES.home}/register`, HOST_ROUTES.flows];

/** A fresh device (or one just reset) has no active host until registration or /flows switches a demo persona in. */
const useRedirectSignedOut = (): void => {
  const router = useRouter();
  const pathname = usePathname();
  const ready = useHostAppReady();
  const signedIn = useHostApp(selectIsSignedIn);

  useEffect(() => {
    // Demo mode has no signed-in host by design; this is UI navigation, not authz, so it no-ops here.
    if (!ready || signedIn || isDemoMode()) return;
    if (SIGNED_OUT_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return;
    router.replace(HOST_ROUTES.welcome);
  }, [ready, signedIn, pathname, router]);
};

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

  useRedirectSignedOut();

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
      }, msUntil(payout.autoSendAt)),
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
