'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Banner, Button, OtpInput, useToast } from '@/shared/components';
import { TravellerScreen } from '../../components';
import { COPY_ACCOUNT, MS_PER_SECOND, OTP_LENGTH, OTP_RESEND_SECONDS, TRAVELLER_ROUTES } from '../../constants';
import { useTravellerApp, useTravellerReady } from '../../hooks';
import type { SignInProgress, TravellerAppState } from '../../interfaces';
import { travellerAppStore } from '../../services/client';
import { displayPhone } from '../../utils';

const copy = COPY_ACCOUNT.signIn;
const selectSignIn = (state: TravellerAppState): SignInProgress => state.signIn;

const secondsUntilResend = (codeSentAt: string | undefined): number =>
  codeSentAt ? Math.max(0, OTP_RESEND_SECONDS - Math.floor((Date.now() - Date.parse(codeSentAt)) / MS_PER_SECOND)) : 0;

/** Screen 22, second half: the host app's code screen. A right code goes back to wherever sign-in was asked for. */
export const SignInCodePage = () => {
  const router = useRouter();
  const toast = useToast();
  const ready = useTravellerReady();
  const { phone, codeSentAt } = useTravellerApp(selectSignIn);
  const [code, setCode] = useState('');
  const [wrong, setWrong] = useState(false);
  const [wait, setWait] = useState(0);
  const leaving = useRef(false);

  useEffect(() => {
    if (ready && !phone && !leaving.current) router.replace(TRAVELLER_ROUTES.signIn.phone);
  }, [ready, phone, router]);

  useEffect(() => {
    setWait(secondsUntilResend(codeSentAt));
    const timer = setInterval(() => setWait(secondsUntilResend(codeSentAt)), MS_PER_SECOND);
    return () => clearInterval(timer);
  }, [codeSentAt]);

  const confirm = (entered: string): void => {
    const next = travellerAppStore.confirmCode(entered, TRAVELLER_ROUTES.profile);
    if (!next) {
      setWrong(true);
      setCode('');
      return;
    }
    // A right code clears the number from the store, which would trip the guard above before the route changes.
    leaving.current = true;
    toast(copy.code.signedIn);
    router.replace(next);
  };

  const resend = (): void => {
    if (phone) travellerAppStore.sendCode(phone);
    setWrong(false);
    toast(copy.code.resent);
  };

  return (
    <TravellerScreen
      barTitle={copy.flowTitle}
      backHref={TRAVELLER_ROUTES.signIn.phone}
      heading={copy.code.title}
      helper={phone ? copy.code.helper(OTP_LENGTH, displayPhone(phone)) : undefined}
      width="column"
    >
      <div className="flex flex-col gap-6">
        <OtpInput
          length={OTP_LENGTH}
          value={code}
          invalid={wrong}
          digitLabel={(position) => copy.code.digit(position, OTP_LENGTH)}
          onChange={(value) => {
            setCode(value);
            setWrong(false);
          }}
          onComplete={confirm}
        />
        {wrong ? <Banner tone="error">{copy.code.wrong}</Banner> : null}
        <div className="flex flex-col items-start gap-1">
          {wait > 0 ? (
            <p className="flex min-h-12 items-center px-2 text-caption text-muted">{copy.code.resendIn(wait)}</p>
          ) : (
            <Button variant="tertiary" onClick={resend}>
              {copy.code.resend}
            </Button>
          )}
          <Button variant="tertiary" href={TRAVELLER_ROUTES.signIn.phone}>
            {copy.code.change}
          </Button>
        </div>
      </div>
    </TravellerScreen>
  );
};
