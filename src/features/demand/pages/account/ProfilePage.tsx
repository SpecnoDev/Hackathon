'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Icon, OptionTile, TextInput, ToggleRow, useToast, type IconName } from '@/shared/components';
import { formatRand, whatsAppLink } from '@/shared/utils';
import { TravellerScreen } from '../../components';
import { APPROX_CURRENCIES, APPROX_SAMPLE_CENTS, COPY_ACCOUNT, COPY_COMMON, LANGUAGES, SUPPORT_WHATSAPP_NUMBER, TRAVELLER_ROUTES } from '../../constants';
import { useTravellerApp } from '../../hooks';
import type { NotificationSettings, TravellerAppState, TravellerProfile } from '../../interfaces';
import { travellerAppStore } from '../../services/client';
import { displayPhone, formatApprox } from '../../utils';

const copy = COPY_ACCOUNT.profile;
const selectProfile = (state: TravellerAppState): TravellerProfile => state.profile;

const NOTIFICATIONS: ReadonlyArray<{ key: keyof NotificationSettings; icon: IconName }> = [
  { key: 'bookings', icon: 'calendar-check' },
  { key: 'reminders', icon: 'bell' },
  { key: 'reviews', icon: 'star' },
];

const Section = ({ title, note, children }: { title: string; note: string; children: ReactNode }) => (
  <section className="flex flex-col gap-3">
    <div className="flex flex-col gap-1">
      <h2 className="text-title-lg text-ink">{title}</h2>
      <p className="text-body-sm text-muted">{note}</p>
    </div>
    {children}
  </section>
);

const Choices = ({ label, children }: { label: string; children: ReactNode }) => (
  <div role="radiogroup" aria-label={label} className="flex flex-col gap-3">
    {children}
  </div>
);

const linkChevron = <Icon name="chevron-right" className="shrink-0 text-muted" />;

/** Mounted only once the saved state has loaded, so the field starts from the saved name and not the seeded one. */
const NameForm = ({ firstName }: { firstName: string }) => {
  const toast = useToast();
  const [name, setName] = useState(firstName);
  const trimmed = name.trim();

  const save = (event: FormEvent): void => {
    event.preventDefault();
    travellerAppStore.patchProfile({ firstName: trimmed });
    toast(copy.saved);
  };

  return (
    <form onSubmit={save} className="flex flex-col gap-3">
      <TextInput label={copy.nameLabel} value={name} onChange={setName} helper={copy.nameHelper} error={trimmed ? undefined : copy.nameEmpty} autoComplete="given-name" />
      <div className="flex">
        <Button type="submit" size="md" variant="secondary" fullWidth={false} disabled={!trimmed || trimmed === firstName}>
          {COPY_COMMON.save}
        </Button>
      </div>
    </form>
  );
};

const Account = ({ profile }: { profile: TravellerProfile }) => (
  <>
    <div className="flex items-center gap-5">
      <span aria-hidden className="flex size-20 shrink-0 items-center justify-center rounded-full bg-surface-strong font-display text-display-lg text-ink">
        {profile.firstName.charAt(0).toUpperCase()}
      </span>
      <div className="flex min-w-0 flex-col gap-1">
        <h2 className="break-words text-title-lg text-ink">{profile.firstName}</h2>
        <p className="text-body-md text-muted">{displayPhone(profile.phone)}</p>
      </div>
    </div>

    <NameForm firstName={profile.firstName} />

    <Section title={copy.language.title} note={copy.language.note}>
      <Choices label={copy.language.title}>
        {LANGUAGES.map((language) => (
          <OptionTile
            key={language.code}
            title={language.name}
            // LanguageCode values are ISO 639-1 codes in capitals, so a screen reader can say each name in its own language.
            lang={language.code.toLowerCase()}
            selected={profile.language === language.code}
            onSelect={() => travellerAppStore.patchProfile({ language: language.code })}
          />
        ))}
      </Choices>
    </Section>

    <Section title={copy.currency.title} note={copy.currency.note}>
      <ToggleRow
        icon="globe"
        label={copy.currency.toggle}
        checked={profile.showApproxCurrency}
        onLabel={COPY_COMMON.on}
        offLabel={COPY_COMMON.off}
        onChange={(showApproxCurrency) => travellerAppStore.patchProfile({ showApproxCurrency })}
      />
      {profile.showApproxCurrency ? (
        <Choices label={copy.currency.choose}>
          {APPROX_CURRENCIES.map((currency) => (
            <OptionTile
              key={currency}
              title={copy.currency.names[currency]}
              description={copy.currency.sample(formatRand(APPROX_SAMPLE_CENTS), formatApprox(APPROX_SAMPLE_CENTS, currency))}
              selected={profile.approxCurrency === currency}
              onSelect={() => travellerAppStore.patchProfile({ approxCurrency: currency })}
            />
          ))}
        </Choices>
      ) : null}
    </Section>

    <Section title={copy.notifications.title} note={copy.notifications.note}>
      {NOTIFICATIONS.map(({ key, icon }) => (
        <ToggleRow
          key={key}
          icon={icon}
          label={copy.notifications.labels[key]}
          checked={profile.notifications[key]}
          onLabel={COPY_COMMON.on}
          offLabel={COPY_COMMON.off}
          onChange={(on) => travellerAppStore.setNotifications({ [key]: on })}
        />
      ))}
    </Section>
  </>
);

const GuestPanel = () => {
  const router = useRouter();

  const signIn = (): void => {
    travellerAppStore.startSignIn(TRAVELLER_ROUTES.profile);
    router.push(TRAVELLER_ROUTES.signIn.phone);
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-surface-soft p-6">
      <span aria-hidden className="flex size-12 items-center justify-center rounded-full bg-canvas text-ink">
        <Icon name="user" />
      </span>
      <div className="flex flex-col gap-2">
        <h2 className="text-title-lg text-ink">{copy.guest.title}</h2>
        <p className="text-body-md text-body">{copy.guest.body}</p>
      </div>
      <Button size="md" onClick={signIn}>
        {copy.guest.cta}
      </Button>
    </div>
  );
};

/** Screen 21: who the traveller is and how the app talks to them. Signed out, it says that browsing needs no account. */
export const ProfilePage = () => {
  const toast = useToast();
  const profile = useTravellerApp(selectProfile);

  const signOut = (): void => {
    travellerAppStore.signOut();
    toast(copy.signedOut);
  };

  return (
    <TravellerScreen pageTitle={copy.title} showNav width="column">
      <div className="flex flex-col gap-10">
        {profile.signedIn ? <Account profile={profile} /> : <GuestPanel />}

        <div className="flex flex-col gap-3">
          {profile.signedIn ? (
            <OptionTile icon="route" title={COPY_ACCOUNT.plans.list.title} description={copy.plansBody} href={TRAVELLER_ROUTES.plans.list} trailing={linkChevron} />
          ) : null}
          <OptionTile icon="store" title={copy.becomeHost.title} description={copy.becomeHost.body} href={TRAVELLER_ROUTES.becomeHost} trailing={linkChevron} />
        </div>

        <div className="flex flex-col gap-2">
          <Button size="md" variant="secondary" icon="message" href={whatsAppLink(SUPPORT_WHATSAPP_NUMBER, copy.helpMessage)}>
            {copy.help}
          </Button>
          {profile.signedIn ? (
            <Button variant="tertiary" onClick={signOut}>
              {copy.signOut}
            </Button>
          ) : null}
        </div>
      </div>
    </TravellerScreen>
  );
};
