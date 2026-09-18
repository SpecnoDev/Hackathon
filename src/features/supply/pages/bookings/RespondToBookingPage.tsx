'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Banner, Button, OptionTile, useToast } from '@/shared/components';
import { ChoiceList, HostScreen } from '../../components';
import { HOST_COPY, HOST_ROUTES, RESPONSE_REASONS } from '../../constants';
import { useOnline } from '../../hooks';
import type { ResponseReason } from '../../interfaces';
import { hostAppStore } from '../../services';

const copy = HOST_COPY.bookings.respond;

/** Screen 26. Declining a request and cancelling a confirmed booking share the reasons; only cancelling costs ranking. */
export const RespondToBookingPage = ({ bookingId, mode }: { bookingId: string; mode: 'decline' | 'cancel' }) => {
  const router = useRouter();
  const toast = useToast();
  const online = useOnline();
  const [reason, setReason] = useState<ResponseReason>();
  const cancelling = mode === 'cancel';
  const title = cancelling ? copy.cancelTitle : copy.declineTitle;

  const confirm = (): void => {
    if (!reason) return;
    if (cancelling) hostAppStore.cancelBooking(bookingId, reason);
    else hostAppStore.declineBooking(bookingId, reason);
    toast(online ? (cancelling ? copy.cancelled : copy.declined) : copy.queued);
    router.replace(HOST_ROUTES.bookings.list);
  };

  return (
    <HostScreen
      barTitle={HOST_COPY.bookings.detail.title}
      backHref={HOST_ROUTES.bookings.detail(bookingId)}
      heading={title}
      footer={
        <Button variant="destructive" size="lg" onClick={confirm} disabled={!reason}>
          {cancelling ? copy.cancelCta : copy.declineCta}
        </Button>
      }
    >
      <div className="flex flex-col gap-6">
        <ChoiceList label={title}>
          {RESPONSE_REASONS.map((option) => (
            <OptionTile key={option} title={copy.reasons[option]} selected={reason === option} onSelect={() => setReason(option)} />
          ))}
        </ChoiceList>
        {cancelling ? (
          <Banner tone="warning">
            <p>{copy.ranking}</p>
            <p>{copy.refund}</p>
          </Banner>
        ) : null}
      </div>
    </HostScreen>
  );
};
