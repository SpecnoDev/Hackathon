'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SA_COUNTRY_CODE } from '@/core/constants';
import { Banner, Button, OptionTile, TextInput, useToast } from '@/shared/components';
import { formatLocalPhone, toE164 } from '@/shared/utils';
import { ChoiceList, HostScreen } from '../../components';
import { BANKS, HOST_COPY, HOST_ROUTES, PICKUP_SHOPS, WALLET_PROVIDERS } from '../../constants';
import { bankAccountSchema, firstIssue, payoutPhoneSchema } from '../../dto';
import { useHostApp, useHostAppReady } from '../../hooks';
import type { Host, HostAppState, PayoutChannel } from '../../interfaces';
import { hostAppStore, selectHost } from '../../services';

const copy = HOST_COPY.earnings;
const selectCurrentHost = (state: HostAppState): Host => selectHost(state);

const CHOICES: Partial<Record<PayoutChannel, readonly string[]>> = { BANK: BANKS, WALLET: WALLET_PROVIDERS, CASH_PICKUP: PICKUP_SHOPS };

/** The minimal details for one payout option: a number for cash send, and as little as possible for the rest. */
export const PayoutDetailsPage = ({ channel }: { channel: PayoutChannel }) => {
  const router = useRouter();
  const toast = useToast();
  const ready = useHostAppReady();
  const host = useHostApp(selectCurrentHost);
  const [phone, setPhone] = useState('');
  const [choice, setChoice] = useState<string>();
  const [account, setAccount] = useState('');
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!ready) return;
    const { payoutDetails } = host;
    setPhone(formatLocalPhone(payoutDetails.phone ?? host.phone));
    setAccount(payoutDetails.accountNumber ?? '');
    setChoice(channel === 'BANK' ? payoutDetails.bankName : channel === 'WALLET' ? payoutDetails.walletProvider : payoutDetails.pickupShop);
    // Prefill once the saved host has loaded; later edits belong to the person typing.
  }, [ready, channel]);

  const needsPhone = channel === 'CASH_SEND' || channel === 'WALLET';
  const choices = CHOICES[channel];

  const save = (): void => {
    const issue =
      (choices && !choice ? copy.fields.choose : undefined) ??
      (needsPhone ? firstIssue(payoutPhoneSchema, phone) : undefined) ??
      (channel === 'BANK' ? firstIssue(bankAccountSchema, account) : undefined);
    setError(issue);
    if (issue) return;
    hostAppStore.setPayoutMethod(channel, {
      phone: needsPhone ? (toE164(phone) ?? phone) : host.payoutDetails.phone,
      bankName: channel === 'BANK' ? choice : host.payoutDetails.bankName,
      accountNumber: channel === 'BANK' ? account.trim() : host.payoutDetails.accountNumber,
      walletProvider: channel === 'WALLET' ? choice : host.payoutDetails.walletProvider,
      pickupShop: channel === 'CASH_PICKUP' ? choice : host.payoutDetails.pickupShop,
    });
    toast(copy.method.saved);
    router.push(HOST_ROUTES.earnings.home);
  };

  return (
    <HostScreen
      barTitle={copy.title}
      backHref={HOST_ROUTES.earnings.payoutMethod}
      heading={copy.details[channel].title}
      helper={copy.details[channel].helper}
      footer={<Button onClick={save}>{HOST_COPY.common.save}</Button>}
    >
      <div className="flex flex-col gap-6">
        {choices ? (
          <ChoiceList label={copy.details[channel].title}>
            {choices.map((option) => (
              <OptionTile
                key={option}
                title={option}
                selected={choice === option}
                onSelect={() => {
                  setChoice(option);
                  setError(undefined);
                }}
              />
            ))}
          </ChoiceList>
        ) : null}
        {needsPhone ? (
          <TextInput label={copy.fields.phone} value={phone} onChange={setPhone} prefix={SA_COUNTRY_CODE} type="tel" inputMode="tel" autoComplete="tel-national" />
        ) : null}
        {channel === 'BANK' ? <TextInput label={copy.fields.account} value={account} onChange={setAccount} inputMode="numeric" /> : null}
        {error ? <Banner tone="error">{error}</Banner> : null}
      </div>
    </HostScreen>
  );
};
