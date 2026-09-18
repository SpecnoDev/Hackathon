'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Banner, Button, OtpInput, useToast } from '@/shared/components';
import { formatLocalPhone } from '@/shared/utils';
import { HostScreen } from '../../components';
import { HOST_COPY, HOST_ROUTES, MS_PER_SECOND, OTP_LENGTH, OTP_RESEND_SECONDS, REGISTER_FLOW_STEPS } from '../../constants';
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
  const { phone, codeSentAt } = useHostApp(selectRegistration);
  const [code, setCode] = useState('');
  const [wrong, setWrong] = useState(false);
  const [wait, setWait] = useState(0);

  useEffect(() => {
    if (ready && !phone) router.replace(HOST_ROUTES.register.phone);
  }, [ready, phone, router]);

  useEffect(() => {
    setWait(secondsUntilResend(codeSentAt));
    const timer = setInterval(() => setWait(secondsUntilResend(codeSentAt)), MS_PER_SECOND);
    return () => clearInterval(timer);
  }, [codeSentAt]);

  const confirm = async (entered: string): Promise<void> => {
    const result = await hostAppStore.confirmCode(entered);
    if (result === 'RETURNING') router.replace(HOST_ROUTES.offerings.list);
    else if (result === 'NEW_HOST') router.push(HOST_ROUTES.register.name);
    else {
      setWrong(true);
      setCode('');
    }
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
      step={{ current: CODE_STEP, total: REGISTER_FLOW_STEPS }}
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
