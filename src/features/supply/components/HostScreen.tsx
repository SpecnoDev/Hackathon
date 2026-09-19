'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { HostShell, WebHeader } from '@/core/layout';
import { BottomNav, OfflineBanner, Skeleton, StepIndicator, TopBar, useToast, type BottomNavItem } from '@/shared/components';
import { HOST_COPY, HOST_ROUTES, isDemoMode } from '../constants';
import { useHostApp, useHostAppReady, useOnline } from '../hooks';
import { hostAppStore, selectIsSignedIn } from '../services';

const NAV_ITEMS: BottomNavItem[] = [
  { href: HOST_ROUTES.offerings.list, label: HOST_COPY.common.nav.offerings, icon: 'tag' },
  { href: HOST_ROUTES.bookings.list, label: HOST_COPY.common.nav.bookings, icon: 'calendar-check' },
  { href: HOST_ROUTES.earnings.home, label: HOST_COPY.common.nav.earnings, icon: 'banknote' },
  { href: HOST_ROUTES.profile.home, label: HOST_COPY.common.nav.profile, icon: 'user' },
];

interface HostScreenProps {
  /** The centred bar for screens inside a flow. Omit on tab roots (use `pageTitle`) and on bare screens. */
  barTitle?: string;
  barTitleIsHeading?: boolean;
  backHref?: string;
  action?: ReactNode;
  step?: { current: number; total: number };
  /** A tab root opens with its name large and left-aligned, with air around it and no bar above. */
  pageTitle?: string;
  /** The one question this screen asks. */
  heading?: string;
  helper?: string;
  /** The primary action, pinned to the bottom. */
  footer?: ReactNode;
  showNav?: boolean;
  children: ReactNode;
}

/** Skeletons take the shape of what is coming: cards under a tab title, tiles under a question. */
const LoadingBlocks = ({ cards }: { cards: boolean }) => (
  <div role="status" aria-label={HOST_COPY.common.loading} className="flex flex-col gap-3">
    <Skeleton className={cards ? 'mb-5 h-9 w-1/2' : 'mb-3 h-8 w-2/3'} />
    <Skeleton className={cards ? 'h-56 w-full' : 'h-16 w-full'} />
    <Skeleton className={cards ? 'h-6 w-3/4' : 'h-16 w-full'} />
    <Skeleton className={cards ? 'h-6 w-1/3' : 'h-16 w-full'} />
  </div>
);

/**
 * Every host screen: one question, one set of controls, one primary button pinned to the bottom,
 * and the offline banner whenever there is no signal. Content waits for the saved state so nothing flashes.
 */
export const HostScreen = ({ barTitle, barTitleIsHeading, backHref, action, step, pageTitle, heading, helper, footer, showNav = false, children }: HostScreenProps) => {
  const router = useRouter();
  const online = useOnline();
  const ready = useHostAppReady();
  const toast = useToast();
  const signedIn = useHostApp(selectIsSignedIn);

  const handleSignOut = async (): Promise<void> => {
    const result = await hostAppStore.signOut();
    if (result === 'OFFLINE') toast(HOST_COPY.profile.signOutOffline);
    // useRedirectSignedOut (HostAppProvider) no-ops in demo mode so the auth bypass can open any
    // host route — this replaces the welcome redirect it would otherwise have done.
    else if (isDemoMode()) router.replace(HOST_ROUTES.welcome);
  };

  return (
    <HostShell
      header={
        <WebHeader
          navItems={signedIn ? NAV_ITEMS : undefined}
          signOutLabel={signedIn ? HOST_COPY.profile.signOut : undefined}
          onSignOut={signedIn ? () => void handleSignOut() : undefined}
        />
      }
      topBar={
        barTitle ? (
          <TopBar title={barTitle} titleIsHeading={barTitleIsHeading} backHref={backHref} backLabel={HOST_COPY.common.back} action={action} />
        ) : null
      }
      progress={step ? <StepIndicator current={step.current} total={step.total} label={HOST_COPY.common.stepOf(step.current, step.total)} /> : null}
      banner={online ? null : <OfflineBanner message={HOST_COPY.common.offline} />}
      footer={ready ? footer : null}
      nav={showNav ? <BottomNav items={NAV_ITEMS} label={HOST_COPY.common.nav.label} /> : null}
    >
      {ready ? (
        <>
          {pageTitle ? <h1 className="mb-8 pt-4 font-display text-display-xl text-ink">{pageTitle}</h1> : null}
          {heading ? (
            <div className="mb-6 flex flex-col gap-2">
              <h1 className="font-display text-display-lg text-ink">{heading}</h1>
              {helper ? <p className="text-caption text-muted">{helper}</p> : null}
            </div>
          ) : null}
          {children}
        </>
      ) : (
        <LoadingBlocks cards={Boolean(pageTitle)} />
      )}
    </HostShell>
  );
};
