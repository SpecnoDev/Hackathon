'use client';

import Link from 'next/link';
import { Button, EarningsCard, EmptyState, Icon, OptionTile, StatusPill } from '@/shared/components';
import { formatRand } from '@/shared/utils';
import { HostScreen } from '../../components';
import { HOST_COPY, HOST_ROUTES, PAYOUT_STATUS_PILL } from '../../constants';
import { useHostApp } from '../../hooks';
import type { Booking, HostAppState, Payout } from '../../interfaces';
import { selectEarnings, selectPayouts } from '../../services';
import { formatDay } from '../../utils';

const copy = HOST_COPY.earnings;
const goThere = <Icon name="chevron-right" className="shrink-0 text-muted" />;

const selectRows = (state: HostAppState): Array<{ payout: Payout; booking?: Booking }> =>
  selectPayouts(state)
    .map((payout) => ({ payout, booking: state.bookings.find((booking) => booking.id === payout.bookingId) }))
    .sort((a, b) => b.payout.expectedBy.localeCompare(a.payout.expectedBy));

export const EarningsPage = () => {
  const summary = useHostApp(selectEarnings);
  const rows = useHostApp(selectRows);

  return (
    <HostScreen pageTitle={copy.title} showNav mode="list">
      <div className="flex flex-col gap-10">
        {rows.length === 0 ? (
          // No dark card yet: a black box that says R0 three times tells a new host nothing and discourages them.
          <EmptyState
            illustration="earnings"
            title={copy.emptyTitle}
            message={copy.empty}
            action={
              <Button variant="secondary" href={HOST_ROUTES.earnings.payoutMethod}>
                {copy.emptyCta}
              </Button>
            }
          />
        ) : (
          <>
            <EarningsCard
              totalLabel={copy.total}
              totalCents={summary.totalCents}
              pendingLabel={copy.pending}
              pendingCents={summary.pendingCents}
              paidOutLabel={copy.paidOut}
              paidOutCents={summary.paidOutCents}
            />
            <section className="flex flex-col gap-1">
              <h2 className="text-title-lg text-ink">{copy.history}</h2>
              <ul className="flex flex-col">
                {rows.map(({ payout, booking }) => (
                  <li key={payout.id}>
                    <Link href={HOST_ROUTES.earnings.payout(payout.id)} className="flex min-h-16 items-center gap-3 border-b border-hairline-soft py-4 active:bg-surface-soft">
                      <span className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="text-title-md text-ink">{booking?.travellerName}</span>
                        <span className="text-caption text-muted">{booking ? formatDay(booking.date) : null}</span>
                      </span>
                      <span className="flex flex-col items-end gap-1">
                        <span className="text-title-md text-ink">{formatRand(payout.amountCents)}</span>
                        <StatusPill tone={PAYOUT_STATUS_PILL[payout.status].tone} icon={PAYOUT_STATUS_PILL[payout.status].icon} label={copy.payoutStatus[payout.status]} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}

        <div className="flex flex-col gap-3">
          {rows.length === 0 ? null : <OptionTile icon="wallet" title={copy.howPaid} href={HOST_ROUTES.earnings.payoutMethod} trailing={goThere} />}
          <OptionTile icon="info" title={copy.feeLink} href={HOST_ROUTES.earnings.fees} trailing={goThere} />
        </div>
      </div>
    </HostScreen>
  );
};
