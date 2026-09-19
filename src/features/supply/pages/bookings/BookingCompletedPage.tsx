'use client';

import { useCallback } from 'react';
import { Button, Icon } from '@/shared/components';
import { formatRand } from '@/shared/utils';
import { HostScreen, MissingNotice } from '../../components';
import { HOST_COPY, HOST_ROUTES } from '../../constants';
import { useHostApp, useHostAppReady } from '../../hooks';
import type { HostAppState } from '../../interfaces';
import { selectPayouts } from '../../services';
import { formatDayAndTime } from '../../utils';

const RESULT_ICON_PX = 48;
const copy = HOST_COPY.bookings.completed;

export const BookingCompletedPage = ({ bookingId }: { bookingId: string }) => {
  const ready = useHostAppReady();
  const payout = useHostApp(useCallback((state: HostAppState) => selectPayouts(state).find((item) => item.bookingId === bookingId), [bookingId]));

  if (ready && !payout) {
    return (
      <MissingNotice
        barTitle={HOST_COPY.bookings.detail.title}
        message={HOST_COPY.bookings.detail.notFound}
        backHref={HOST_ROUTES.bookings.list}
        backLabel={HOST_COPY.bookings.detail.backToList}
      />
    );
  }
  if (!payout) return <HostScreen barTitle={HOST_COPY.bookings.detail.title}>{null}</HostScreen>;

  return (
    <HostScreen
      barTitle={HOST_COPY.bookings.detail.title}
      footer={
        <>
          <Button variant="accent" icon="banknote" href={HOST_ROUTES.earnings.payout(payout.id)}>
            {copy.cta}
          </Button>
          <Button variant="secondary" href={HOST_ROUTES.bookings.list}>
            {copy.back}
          </Button>
        </>
      }
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <span className="flex size-24 items-center justify-center rounded-full bg-accent-tint text-ink">
          <Icon name="banknote" size={RESULT_ICON_PX} />
        </span>
        <h1 className="text-title-lg text-ink">{copy.title}</h1>
        <p className="font-display text-display-xl text-ink">{formatRand(payout.amountCents)}</p>
        <p className="text-body-host text-ink">
          {payout.expectedBy ? copy.timing(payout.destination, formatDayAndTime(payout.expectedBy)) : copy.timingNoEta(payout.destination)}
        </p>
      </div>
    </HostScreen>
  );
};
