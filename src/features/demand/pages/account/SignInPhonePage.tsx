'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Banner, Button, TextInput } from '@/shared/components';
import { TravellerScreen } from '../../components';
import { COPY_ACCOUNT, TRAVELLER_ROUTES } from '../../constants';
import { useOnline, useTravellerApp } from '../../hooks';
import type { SignInProgress, TravellerAppState } from '../../interfaces';
import { travellerAppStore } from '../../services/client';
import { isTravellerPhone, normalisePhone } from '../../utils';

const copy = COPY_ACCOUNT.signIn;
const selectSignIn = (state: TravellerAppState): SignInProgress => state.signIn;

/** Screen 22, first half: the host app's phone question, open to numbers from any country. */
export const SignInPhonePage = () => {
  const router = useRouter();
  const online = useOnline();
  const { phone: sentTo, returnTo } = useTravellerApp(selectSignIn);
  const [phone, setPhone] = useState(sentTo ?? '');
  const [error, setError] = useState<string>();
  const [blockedOffline, setBlockedOffline] = useState(false);

  const sendCode = (event?: FormEvent): void => {
    event?.preventDefault();
    const number = normalisePhone(phone);
    const valid = isTravellerPhone(phone);
    setError(valid ? undefined : copy.phone.invalid);
    // A code cannot arrive without signal, so this step waits for a connection, the same as it does for hosts.
    setBlockedOffline(valid && !online);
    if (!valid || !online) return;
    travellerAppStore.sendCode(number);
    router.push(TRAVELLER_ROUTES.signIn.code);
  };

  return (
    <TravellerScreen
      barTitle={copy.flowTitle}
      backHref={returnTo ?? TRAVELLER_ROUTES.profile}
      heading={copy.phone.title}
      helper={copy.phone.helper}
      width="column"
      footer={
        <Button size="md" onClick={() => sendCode()}>
          {copy.phone.cta}
        </Button>
      }
    >
      <form onSubmit={sendCode} className="flex flex-col gap-4">
        <TextInput
          label={copy.phone.label}
          value={phone}
          onChange={setPhone}
          error={error}
          placeholder={copy.phone.placeholder}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          autoFocus
        />
        {blockedOffline && !online ? <Banner tone="warning">{copy.phone.offline}</Banner> : null}
      </form>
    </TravellerScreen>
  );
};
