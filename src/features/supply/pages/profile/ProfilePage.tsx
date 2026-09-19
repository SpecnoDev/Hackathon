'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Icon, useToast, type IconName } from '@/shared/components';
import { formatLocalPhone, whatsAppLink } from '@/shared/utils';
import { HostScreen, TierBadge } from '../../components';
import { HOST_COPY, HOST_ROUTES, SUPPORT_WHATSAPP_NUMBER, isDemoMode, languageName } from '../../constants';
import { useHostApp } from '../../hooks';
import type { Host, HostAppState } from '../../interfaces';
import { hostAppStore, selectHost } from '../../services';

const copy = HOST_COPY.profile;
const selectCurrentHost = (state: HostAppState): Host => selectHost(state);

const Row = ({ href, icon, label, children }: { href: string; icon: IconName; label: string; children: ReactNode }) => (
  <li>
    <Link href={href} className="flex min-h-16 items-center gap-4 border-b border-hairline-soft py-4 active:bg-surface-soft">
      <Icon name={icon} className="shrink-0 text-ink" />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-caption text-muted">{label}</span>
        <span className="text-body-host text-ink">{children}</span>
      </span>
      <Icon name="chevron-right" className="shrink-0 text-muted" />
    </Link>
  </li>
);

export const ProfilePage = () => {
  const router = useRouter();
  const host = useHostApp(selectCurrentHost);
  const toast = useToast();

  const handleSignOut = async (): Promise<void> => {
    const result = await hostAppStore.signOut();
    if (result === 'OFFLINE') toast(copy.signOutOffline);
    // useRedirectSignedOut (HostAppProvider) no-ops in demo mode so the auth bypass can open any
    // host route — this replaces the welcome redirect it would otherwise have done.
    else if (isDemoMode()) router.replace(HOST_ROUTES.welcome);
  };

  return (
    <HostScreen pageTitle={copy.title} showNav>
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-5">
          <span aria-hidden className="flex size-20 shrink-0 items-center justify-center rounded-full bg-surface-strong font-display text-display-lg text-ink">
            {host.firstName.charAt(0)}
          </span>
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="text-title-lg text-ink">{host.firstName}</h2>
            {host.town ? <p className="text-body-host text-muted">{host.town}</p> : null}
            <p className="text-body-host text-muted">{formatLocalPhone(host.phone)}</p>
          </div>
        </div>

        <ul className="flex flex-col border-t border-hairline-soft">
          <Row href={HOST_ROUTES.verify.why} icon="shield-check" label={copy.verification}>
            <span className="flex flex-wrap items-center gap-2">
              <TierBadge tier={host.tier} />
              {host.tier === 'COMMUNITY' ? null : <span className="text-link text-primary-text underline">{copy.moreVerified}</span>}
            </span>
          </Row>
          <Row href={HOST_ROUTES.profile.language} icon="globe" label={copy.language}>
            {languageName(host.language)}
          </Row>
          <Row href={HOST_ROUTES.profile.notifications} icon="bell" label={copy.contact}>
            {HOST_COPY.register.contact.options[host.contactChannel].title}
          </Row>
          <Row href={HOST_ROUTES.earnings.payoutMethod} icon="wallet" label={copy.payout}>
            {HOST_COPY.earnings.method.options[host.payoutChannel].title}
          </Row>
        </ul>

        <div className="flex flex-col gap-8 tablet:flex-row tablet:gap-3 tablet:[&>*]:w-auto">
          <Button variant="secondary" icon="message" href={whatsAppLink(SUPPORT_WHATSAPP_NUMBER, HOST_COPY.common.helpMessage)}>
            {copy.help}
          </Button>
          <Button variant="destructive" size="lg" onClick={() => void handleSignOut()}>
            {copy.signOut}
          </Button>
        </div>
      </div>
    </HostScreen>
  );
};
