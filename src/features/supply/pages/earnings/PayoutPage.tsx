'use client';

import { useCallback, useState } from 'react';
import { Button, Sheet, StatusPill } from '@/shared/components';
import { formatRand } from '@/shared/utils';
import { HostScreen, MissingNotice } from '../../components';
import { HOST_COPY, HOST_ROUTES, PAYOUT_STATUS_PILL } from '../../constants';
import { useHostApp, useHostAppReady } from '../../hooks';
import type { HostAppState } from '../../interfaces';
import { selectPayouts } from '../../services';
import { formatDayAndTime } from '../../utils';

const copy = HOST_COPY.earnings.payout;

/** Screen 30, DESIGN.md's payout-confirmation: the impact screen for the pitch. */
export const PayoutPage = ({ payoutId }: { payoutId: string }) => {
  const ready = useHostAppReady();
  const payout = useHostApp(useCallback((state: HostAppState) => selectPayouts(state).find((item) => item.id === payoutId), [payoutId]));
  const [showHow, setShowHow] = useState(false);

  if (ready && !payout) {
    return <MissingNotice barTitle={copy.title} message={copy.notFound} backHref={HOST_ROUTES.earnings.home} backLabel={copy.backToEarnings} />;
  }
  if (!payout) return <HostScreen barTitle={copy.title}>{null}</HostScreen>;

  const amount = formatRand(payout.amountCents);
  const sent = payout.status === 'SENT';

  return (
    <HostScreen
      barTitle={copy.title}
      backHref={HOST_ROUTES.earnings.home}
      footer={
        <Button variant="secondary" href={HOST_ROUTES.bookings.detail(payout.bookingId)}>
          {copy.forBooking}
        </Button>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-earnings-display text-ink">{amount}</h1>
          <div>
            <StatusPill tone={PAYOUT_STATUS_PILL[payout.status].tone} icon={PAYOUT_STATUS_PILL[payout.status].icon} label={HOST_COPY.earnings.payoutStatus[payout.status]} />
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-lg bg-accent-tint p-5 text-body-host text-ink">
          <p>{sent ? copy.sent(amount, payout.destination) : copy.pending(amount, payout.destination, formatDayAndTime(payout.expectedBy))}</p>
          <p>{copy.collect[payout.channel]}</p>
          {payout.channel === 'CASH_SEND' ? (
            <div>
              <Button variant="tertiary" onClick={() => setShowHow(true)}>
                {copy.how}
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      {showHow ? (
        <Sheet title={copy.howTitle} closeLabel={HOST_COPY.common.close} onClose={() => setShowHow(false)} actions={<Button onClick={() => setShowHow(false)}>{HOST_COPY.common.close}</Button>}>
          <ol className="flex list-decimal flex-col gap-2 pl-6">
            {copy.howSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </Sheet>
      ) : null}
    </HostScreen>
  );
};
