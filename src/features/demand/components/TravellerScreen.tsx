'use client';

import type { ReactNode } from 'react';
import { TravellerShell } from '@/core/layout';
import { BottomNav, OfflineBanner, Skeleton, StepIndicator, TopBar } from '@/shared/components';
import { COPY_COMMON, TRAVELLER_NAV } from '../constants';
import { useOnline, useTravellerReady } from '../hooks';

interface TravellerScreenProps {
  /** Tab roots: the tab's name, large and top-left, with no bar above (DESIGN.md page-title). */
  pageTitle?: string;
  /** Inner screens: the 56px top bar with a back chevron. */
  barTitle?: string;
  backHref?: string;
  action?: ReactNode;
  /** Where the traveller is in a flow with a fixed number of steps, e.g. booking. */
  step?: { current: number; total: number };
  /** The question or name of an inner screen, under the bar. */
  heading?: string;
  helper?: string;
  /** Edge-to-edge content above the column: the dark hero, a photo carousel. */
  lead?: ReactNode;
  /** The one action for this screen, pinned above the nav. */
  footer?: ReactNode;
  showNav?: boolean;
  /** `page` for browsing grids, `column` for forms, receipts and anything read top to bottom. */
  width?: 'page' | 'column';
  children: ReactNode;
}

const SHIMMER = 'animate-pulse motion-reduce:animate-none';

/** DESIGN.md: a slow shimmer on the traveller side, shaped like what is coming. */
const LoadingBlocks = () => (
  <div role="status" aria-label={COPY_COMMON.loading} className="flex flex-col gap-3">
    <Skeleton className={`mb-4 h-9 w-1/2 ${SHIMMER}`} />
    <Skeleton className={`aspect-4/3 w-full max-w-host ${SHIMMER}`} />
    <Skeleton className={`h-5 w-3/4 max-w-host ${SHIMMER}`} />
    <Skeleton className={`h-5 w-1/3 max-w-host ${SHIMMER}`} />
  </div>
);

/**
 * Every traveller screen: the host app's bars, page title and pinned action at traveller density.
 * Content waits for the saved state so a saved heart or a booked trip never flashes in late.
 */
export const TravellerScreen = ({ pageTitle, barTitle, backHref, action, step, heading, helper, lead, footer, showNav = false, width = 'page', children }: TravellerScreenProps) => {
  const online = useOnline();
  const ready = useTravellerReady();

  return (
    <TravellerShell
      width={width}
      topBar={
        barTitle || !online ? (
          <>
            {barTitle ? <TopBar title={barTitle} backHref={backHref} backLabel={COPY_COMMON.back} action={action} /> : null}
            {step ? <StepIndicator current={step.current} total={step.total} label={COPY_COMMON.stepOf(step.current, step.total)} /> : null}
            {online ? null : <OfflineBanner message={COPY_COMMON.offline} />}
          </>
        ) : undefined
      }
      lead={ready ? lead : undefined}
      footer={ready ? footer : undefined}
      nav={showNav ? <BottomNav items={TRAVELLER_NAV} label={COPY_COMMON.navLabel} /> : undefined}
    >
      {ready ? (
        <>
          {pageTitle ? <h1 className="mb-6 pt-2 font-display text-display-xl text-ink">{pageTitle}</h1> : null}
          {heading ? (
            <div className="mb-6 flex flex-col gap-2">
              <h1 className="font-display text-display-lg text-ink">{heading}</h1>
              {helper ? <p className="text-body-md text-muted">{helper}</p> : null}
            </div>
          ) : null}
          {children}
        </>
      ) : (
        <LoadingBlocks />
      )}
    </TravellerShell>
  );
};
