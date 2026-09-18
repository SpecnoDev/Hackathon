'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Banner, Button, Icon } from '@/shared/components';
import { whatsAppLink } from '@/shared/utils';
import { HostScreen, TierBadge } from '../../components';
import { HOST_COPY, HOST_ROUTES, SUPPORT_WHATSAPP_NUMBER } from '../../constants';
import { useHostApp, useHostAppReady } from '../../hooks';
import type { HostAppState, VerificationState, VerificationTier } from '../../interfaces';
import { hostAppStore, selectHost } from '../../services';

const RESULT_ICON_PX = 48;
const copy = HOST_COPY.verify.result;
const selectOutcome = (state: HostAppState): VerificationState => state.verification.state;
const selectTier = (state: HostAppState): VerificationTier => selectHost(state).tier;

export const VerificationResultPage = () => {
  const router = useRouter();
  const outcome = useHostApp(selectOutcome);
  const tier = useHostApp(selectTier);
  const failed = outcome === 'FAILED';
  const ready = useHostAppReady();

  // Opened directly, or from an old notification, before any check has finished: never claim a result that does not exist.
  useEffect(() => {
    if (!ready) return;
    if (outcome === 'CHECKING') router.replace(HOST_ROUTES.verify.checking);
    else if (outcome === 'IDLE' && tier === 'REGISTERED') router.replace(HOST_ROUTES.verify.why);
  }, [ready, outcome, tier, router]);

  const tryAgain = (): void => {
    hostAppStore.retryVerification();
    router.push(HOST_ROUTES.verify.documentPhoto);
  };

  return (
    <HostScreen
      barTitle={HOST_COPY.verify.flowTitle}
      footer={
        failed ? (
          <>
            <Button onClick={tryAgain}>{HOST_COPY.common.tryAgain}</Button>
            <Button variant="secondary" icon="message" href={whatsAppLink(SUPPORT_WHATSAPP_NUMBER, HOST_COPY.common.helpMessage)}>
              {HOST_COPY.common.getHelp}
            </Button>
          </>
        ) : (
          <Button href={HOST_ROUTES.offerings.list}>{copy.verifiedCta}</Button>
        )
      }
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <span className={`flex size-24 items-center justify-center rounded-full ${failed ? 'bg-error-tint text-error' : 'bg-primary-tint text-primary-text'}`}>
          <Icon name={failed ? 'alert' : 'shield-check'} size={RESULT_ICON_PX} />
        </span>
        <h1 className="font-display text-display-lg text-ink">{failed ? copy.failedTitle : copy.verifiedTitle}</h1>
        {failed ? (
          <Banner tone="error">{copy.failedReason}</Banner>
        ) : (
          <>
            <TierBadge tier={tier} />
            <p className="text-body-host text-ink">{copy.verifiedBody}</p>
          </>
        )}
      </div>
    </HostScreen>
  );
};
