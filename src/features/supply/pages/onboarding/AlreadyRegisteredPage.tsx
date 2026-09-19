'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, useToast } from '@/shared/components';
import { formatLocalPhone } from '@/shared/utils';
import { HostScreen } from '../../components';
import { HOST_COPY, HOST_ROUTES } from '../../constants';
import { useHostApp, useHostAppReady } from '../../hooks';
import type { HostAppState, RegistrationProgress } from '../../interfaces';
import { hostAppStore } from '../../services';

const copy = HOST_COPY.register.alreadyRegistered;
const selectRegistration = (state: HostAppState): RegistrationProgress => state.registration;

/**
 * JOIN + RETURNING lands here instead of being signed in silently (see EnterCodePage): the OTP
 * proved the phone, but the person came in on the Join path, so they choose rather than getting
 * swept into an existing account. Reachable only right after a verify, like EnterCodePage's own
 * `!phone` guard — a cold landing (no `codeConfirmed`) sends them back to start over.
 */
export const AlreadyRegisteredPage = () => {
  const router = useRouter();
  const toast = useToast();
  const ready = useHostAppReady();
  const { phone, codeConfirmed } = useHostApp(selectRegistration);

  useEffect(() => {
    if (ready && !codeConfirmed) router.replace(HOST_ROUTES.register.phone);
  }, [ready, codeConfirmed, router]);

  const useDifferentNumber = async (): Promise<void> => {
    if ((await hostAppStore.signOut()) === 'OFFLINE') {
      toast(HOST_COPY.profile.signOutOffline);
      return;
    }
    hostAppStore.startRegistration('JOIN');
    router.push(HOST_ROUTES.register.phone);
  };

  return (
    <HostScreen
      heading={copy.title}
      helper={copy.helper(formatLocalPhone(phone ?? ''))}
      footer={
        <>
          <Button onClick={() => router.replace(HOST_ROUTES.offerings.list)}>{copy.signIn}</Button>
          <Button variant="tertiary" onClick={() => void useDifferentNumber()}>
            {HOST_COPY.register.useDifferentNumber}
          </Button>
        </>
      }
    >
      {null}
    </HostScreen>
  );
};
