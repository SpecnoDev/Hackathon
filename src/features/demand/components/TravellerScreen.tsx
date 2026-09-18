import type { ReactNode } from 'react';
import { TravellerShell } from '@/core/layout';
import { BottomNav, StepIndicator, TopBar } from '@/shared/components';
import { COPY_COMMON, TRAVELLER_NAV } from '../constants';
import { TravellerOfflineBanner } from './TravellerOfflineBanner';

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

/**
 * Every traveller screen: the host app's bars, page title and pinned action at traveller density.
 * A Server Component, unlike HostScreen — traveller pages render their data on the server, so nothing waits on a store.
 */
export const TravellerScreen = ({ pageTitle, barTitle, backHref, action, step, heading, helper, lead, footer, showNav = false, width = 'page', children }: TravellerScreenProps) => (
  <TravellerShell
    width={width}
    topBar={
      <>
        {barTitle ? <TopBar title={barTitle} backHref={backHref} backLabel={COPY_COMMON.back} action={action} /> : null}
        {step ? <StepIndicator current={step.current} total={step.total} label={COPY_COMMON.stepOf(step.current, step.total)} /> : null}
        <TravellerOfflineBanner />
      </>
    }
    lead={lead}
    footer={footer}
    nav={showNav ? <BottomNav items={TRAVELLER_NAV} label={COPY_COMMON.navLabel} /> : undefined}
  >
    {pageTitle ? <h1 className="mb-6 pt-2 font-display text-display-xl text-ink">{pageTitle}</h1> : null}
    {heading ? (
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="font-display text-display-lg text-ink">{heading}</h1>
        {helper ? <p className="text-body-md text-muted">{helper}</p> : null}
      </div>
    ) : null}
    {children}
  </TravellerShell>
);
