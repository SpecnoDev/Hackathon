'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Banner, Button, Icon } from '@/shared/components';
import { HostScreen } from '../../components';
import { HOST_COPY, HOST_ROUTES } from '../../constants';
import { useHostApp, useHostAppReady, useOnline } from '../../hooks';
import type { HostAppState, VerificationState } from '../../interfaces';
import { hostAppStore } from '../../services';

const CHECKING_ICON_PX = 48;
const copy = HOST_COPY.verify.checking;
const selectVerificationState = (state: HostAppState): VerificationState => state.verification.state;
const selectHasBothPhotos = (state: HostAppState): boolean => Boolean(state.verification.documentPhotoKey && state.verification.selfieKey);

export const CheckingPage = () => {
  const router = useRouter();
  const online = useOnline();
  const ready = useHostAppReady();
  const state = useHostApp(selectVerificationState);
  const hasPhotos = useHostApp(selectHasBothPhotos);

  // Sends the captures the first time the host lands here, so a reload does not send them twice.
  useEffect(() => {
    if (!ready || state !== 'IDLE') return;
    if (hasPhotos) hostAppStore.submitVerification();
    else router.replace(HOST_ROUTES.verify.document);
  }, [ready, state, hasPhotos, router]);

  useEffect(() => {
    if (state === 'VERIFIED' || state === 'FAILED') router.replace(HOST_ROUTES.verify.result);
  }, [state, router]);

  return (
    <HostScreen
      barTitle={HOST_COPY.verify.flowTitle}
      footer={<Button href={HOST_ROUTES.offerings.list}>{copy.cta}</Button>}
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <span className="flex size-24 items-center justify-center rounded-full bg-accent-tint text-ink">
          <Icon name="clock" size={CHECKING_ICON_PX} />
        </span>
        <h1 className="font-display text-display-lg text-ink">{copy.title}</h1>
        <p className="text-body-host text-ink">{copy.body}</p>
        {online ? null : <Banner tone="warning">{copy.offline}</Banner>}
      </div>
    </HostScreen>
  );
};
