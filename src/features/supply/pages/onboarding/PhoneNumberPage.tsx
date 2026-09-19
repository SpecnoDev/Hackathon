'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SA_COUNTRY_CODE } from '@/core/constants';
import { Banner, Button, TextInput } from '@/shared/components';
import { HostScreen } from '../../components';
import { DEMO_PHONE_LOCAL, HOST_COPY, HOST_ROUTES, REGISTER_FLOW_STEPS, SIGN_IN_FLOW_STEPS, isDemoMode } from '../../constants';
import { firstIssue, phoneNumberSchema } from '../../dto';
import { useHostApp, useOnline } from '../../hooks';
import type { HostAppState, RegistrationIntent } from '../../interfaces';
import { hostAppStore } from '../../services';

const PHONE_STEP = 2;
const copy = HOST_COPY.register.phone;
const selectPhone = (state: HostAppState): string => state.registration.phone ?? '';
const selectIntent = (state: HostAppState): RegistrationIntent => state.registration.intent ?? 'JOIN';

export const PhoneNumberPage = () => {
  const router = useRouter();
  const online = useOnline();
  const phone = useHostApp(selectPhone);
  const intent = useHostApp(selectIntent);
  const isSignIn = intent === 'SIGN_IN';
  const [error, setError] = useState<string>();
  const [blockedOffline, setBlockedOffline] = useState(false);

  useEffect(() => {
    if (isDemoMode && !phone) hostAppStore.answerRegistration({ phone: DEMO_PHONE_LOCAL });
  }, [phone]);

  const sendCode = (): void => {
    const issue = firstIssue(phoneNumberSchema, phone);
    setError(issue);
    if (issue) return;
    // PRD: registration needs signal for the OTP; everything after it tolerates disconnection.
    setBlockedOffline(!online);
    if (!online) return;
    hostAppStore.sendCode(phone);
    router.push(HOST_ROUTES.register.code);
  };

  return (
    <HostScreen
      barTitle={isSignIn ? HOST_COPY.register.signInFlowTitle : HOST_COPY.register.flowTitle}
      backHref={isSignIn ? HOST_ROUTES.welcome : HOST_ROUTES.register.language}
      step={{ current: isSignIn ? 1 : PHONE_STEP, total: isSignIn ? SIGN_IN_FLOW_STEPS : REGISTER_FLOW_STEPS }}
      heading={copy.title}
      footer={<Button onClick={sendCode}>{copy.cta}</Button>}
    >
      <div className="flex flex-col gap-4">
        <TextInput
          label={copy.label}
          value={phone}
          onChange={(value) => hostAppStore.answerRegistration({ phone: value })}
          helper={copy.helper}
          error={error}
          placeholder={copy.placeholder}
          prefix={SA_COUNTRY_CODE}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          autoFocus
        />
        {blockedOffline && !online ? <Banner tone="warning">{copy.offline}</Banner> : null}
      </div>
    </HostScreen>
  );
};
