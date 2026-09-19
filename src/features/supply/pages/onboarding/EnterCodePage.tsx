'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Banner, Button, OtpInput, useToast } from '@/shared/components';
import { formatLocalPhone } from '@/shared/utils';
import { HostScreen } from '../../components';
import { HOST_COPY, HOST_ROUTES, MS_PER_SECOND, OTP_LENGTH, OTP_RESEND_SECONDS, REGISTER_FLOW_STEPS, SIGN_IN_FLOW_STEPS } from '../../constants';
import { useHostApp, useHostAppReady } from '../../hooks';
import type { HostAppState, RegistrationProgress } from '../../interfaces';
import { hostAppStore } from '../../services';

const CODE_STEP = 3;
const copy = HOST_COPY.register.code;
const selectRegistration = (state: HostAppState): RegistrationProgress => state.registration;

const secondsUntilResend = (codeSentAt: string | undefined): number =>
  codeSentAt ? Math.max(0, OTP_RESEND_SECONDS - Math.floor((Date.now() - Date.parse(codeSentAt)) / MS_PER_SECOND)) : 0;

export const EnterCodePage = () => {
  const router = useRouter();
  const toast = useToast();
  const ready = useHostAppReady();
  const { phone, codeSentAt, intent } = useHostApp(selectRegistration);
  const isSignIn = intent === 'SIGN_IN';
  const [code, setCode] = useState('');
  const [wrong, setWrong] = useState(false);
  const [wait, setWait] = useState(0);
  const pending = useRef(false);

  useEffect(() => {
    if (ready && !phone) router.replace(HOST_ROUTES.register.phone);
  }, [ready, phone, router]);

  useEffect(() => {
    setWait(secondsUntilResend(codeSentAt));
    const timer = setInterval(() => setWait(secondsUntilResend(codeSentAt)), MS_PER_SECOND);
    return () => clearInterval(timer);
  }, [codeSentAt]);

  /**
   * Guards against a second OTP submit (e.g. autofill firing alongside a manual entry) landing
   * while the first is still in flight. A ref, not state: two `onComplete` calls in the same React
   * batch would both still read the pre-batch `false` from state, since a `setState` call doesn't
   * update the closure until the next render — a ref is written synchronously, so the second call
   * always sees the first one's guard.
   */
  const confirm = async (entered: string): Promise<void> => {
    if (pending.current) return;
    pending.current = true;
    const result = await hostAppStore.confirmCode(entered);
    pending.current = false;
    if (result === 'WRONG_CODE') {
      setWrong(true);
      setCode('');
      return;
    }
    // Existence is only revealed after the OTP is verified, never at the phone step (no host-number
    // enumeration). JOIN + RETURNING must not silently sign in a number that already has an
    // account; SIGN_IN + NEW_HOST must not silently create one. Both stop at an in-between screen
    // instead of routing straight through.
    if (isSignIn) router.replace(result === 'RETURNING' ? HOST_ROUTES.offerings.list : HOST_ROUTES.register.noAccount);
    else router.push(result === 'RETURNING' ? HOST_ROUTES.register.alreadyRegistered : HOST_ROUTES.register.name);
  };

  const resend = (notice: string): void => {
    if (phone) hostAppStore.sendCode(phone);
    setWrong(false);
    toast(notice);
  };

  return (
    <HostScreen
      barTitle={HOST_COPY.register.flowTitle}
      backHref={HOST_ROUTES.register.phone}
      step={{ current: isSignIn ? 2 : CODE_STEP, total: isSignIn ? SIGN_IN_FLOW_STEPS : REGISTER_FLOW_STEPS }}
      heading={copy.title}
      helper={copy.helper(formatLocalPhone(phone ?? ''))}
    >
      <div className="flex flex-col gap-6">
        <OtpInput
          length={OTP_LENGTH}
          value={code}
          invalid={wrong}
          digitLabel={(position) => copy.digit(position, OTP_LENGTH)}
          onChange={(value) => {
            setCode(value);
            setWrong(false);
          }}
          onComplete={confirm}
        />
        {wrong ? <Banner tone="error">{copy.wrong}</Banner> : null}
        <div className="flex flex-col items-start gap-1">
          {wait > 0 ? (
            <p className="flex min-h-12 items-center px-2 text-caption text-muted">{copy.resendIn(wait)}</p>
          ) : (
            <Button variant="tertiary" onClick={() => resend(copy.resent)}>
              {copy.resend}
            </Button>
          )}
          <Button variant="tertiary" onClick={() => resend(copy.whatsappSent)}>
            {copy.whatsapp}
          </Button>
        </div>
      </div>
    </HostScreen>
  );
};
