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

const copy = HOST_COPY.register.noAccount;
const selectRegistration = (state: HostAppState): RegistrationProgress => state.registration;

/**
 * SIGN_IN + NEW_HOST lands here instead of being registered silently (see EnterCodePage): the OTP
 * proved the phone, but the person came in on the Sign in path, so they choose rather than getting
 * swept into creating an account. Reachable only right after a verify, like EnterCodePage's own
 * `!phone` guard — a cold landing (no `codeConfirmed`) sends them back to start over.
 */
export const NoAccountPage = () => {
  const router = useRouter();
  const toast = useToast();
  const ready = useHostAppReady();
  const { phone, codeConfirmed } = useHostApp(selectRegistration);

  useEffect(() => {
    if (ready && !codeConfirmed) router.replace(HOST_ROUTES.register.phone);
  }, [ready, codeConfirmed, router]);

  /**
   * The code already verified this phone, so joining continues straight to the language step
   * instead of asking for phone and code again — `codeConfirmed`/`hostId`/`phone` all carry over
   * (see startRegistration/switchActiveHost), and LanguageStepPage sends a verified registration
   * on to name, skipping phone/code entirely.
   */
  const join = (): void => {
    hostAppStore.answerRegistration({ intent: 'JOIN' });
    router.push(HOST_ROUTES.register.language);
  };

  const useDifferentNumber = async (): Promise<void> => {
    if ((await hostAppStore.signOut()) === 'OFFLINE') {
      toast(HOST_COPY.profile.signOutOffline);
      return;
    }
    hostAppStore.startRegistration('SIGN_IN');
    router.push(HOST_ROUTES.register.phone);
  };

  return (
    <HostScreen
      heading={copy.title}
      helper={copy.helper(formatLocalPhone(phone ?? ''))}
      footer={
        <>
          <Button onClick={join}>{copy.join}</Button>
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
