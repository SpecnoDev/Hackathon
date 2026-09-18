'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { connectivityService } from '@/core/services/client';
import { Button, Icon, OptionTile, ToggleRow, type IconName } from '@/shared/components';
import { formatRand } from '@/shared/utils';
import { HostScreen } from '../../components';
import { DEMO_REJECTED_OTP, GUIDED_FORM_FIELDS, HOST_COPY, HOST_ROUTES, PAYOUT_CHANNELS } from '../../constants';
import { useHostApp } from '../../hooks';
import type { HostAppState } from '../../interfaces';
import { hostAppStore, selectBookingSections, selectHost, selectOfferings, selectPayouts } from '../../services';

/** Team tooling, not product: the copy here is for us, so it lives with the page rather than in HOST_COPY. */
interface ScreenLink {
  number: string;
  name: string;
  href: string;
}

interface Targets {
  offeringId?: string;
  liveOfferingId?: string;
  requestId?: string;
  confirmedId?: string;
  bookingId?: string;
  payoutId?: string;
  sentPayoutId?: string;
  sentPayoutText?: string;
  hostId: string;
  hostName: string;
}

const selectTargets = (state: HostAppState): Targets => {
  const offerings = selectOfferings(state);
  const sections = selectBookingSections(state);
  const payouts = selectPayouts(state);
  const sent = payouts.find((payout) => payout.status === 'SENT');
  const host = selectHost(state);
  return {
    offeringId: offerings[0]?.id,
    liveOfferingId: offerings.find((offering) => offering.status === 'LIVE')?.id,
    requestId: sections.requests[0]?.id,
    confirmedId: sections.upcoming[0]?.id,
    bookingId: (sections.requests[0] ?? sections.upcoming[0] ?? sections.past[0])?.id,
    payoutId: payouts[0]?.id,
    sentPayoutId: sent?.id,
    sentPayoutText: sent ? HOST_COPY.earnings.payout.sent(formatRand(sent.amountCents), sent.destination) : undefined,
    hostId: host.id,
    hostName: host.firstName,
  };
};

const selectPersonas = (state: HostAppState): Array<{ id: string; label: string }> =>
  state.hosts.map((host) => ({ id: host.id, label: `${host.firstName} · ${HOST_COPY.verify.why.tiers[host.tier].name} · ${host.town || 'new host'}` }));

const selectOutcome = (state: HostAppState): boolean => state.demo.verificationOutcome === 'FAILED';

const flows = (targets: Targets): Array<{ title: string; note?: string; screens: ScreenLink[] }> => {
  const offering = targets.offeringId;
  const booking = targets.bookingId;
  const needs = (id: string | undefined, href: (id: string) => string): string => (id ? href(id) : HOST_ROUTES.flows);
  return [
    { title: 'Flow 1 · Landing', screens: [{ number: '1', name: 'Landing page', href: HOST_ROUTES.welcome }] },
    {
      title: 'Flow 2 · Register',
      note: `Start from the landing page so it begins fresh. OTP is mocked: any 4 digits pass, ${DEMO_REJECTED_OTP} shows the error state. Finishing creates a new Registered host.`,
      screens: [
        { number: '1b', name: 'Choose your language', href: HOST_ROUTES.register.language },
        { number: '2', name: 'Phone number', href: HOST_ROUTES.register.phone },
        { number: '3', name: 'Enter code', href: HOST_ROUTES.register.code },
        { number: '4', name: 'Your name', href: HOST_ROUTES.register.name },
        { number: '5', name: 'How should we contact you', href: HOST_ROUTES.register.contact },
        { number: '6', name: 'You are in', href: HOST_ROUTES.register.done },
      ],
    },
    {
      title: 'Flow 3 · Verify identity',
      note: 'Checking resolves after a few seconds. Use the switch above to see "Could not verify".',
      screens: [
        { number: '7', name: 'Why verify', href: HOST_ROUTES.verify.why },
        { number: '8', name: 'Choose document', href: HOST_ROUTES.verify.document },
        { number: '9', name: 'Photo of your document', href: HOST_ROUTES.verify.documentPhoto },
        { number: '10', name: 'Take a selfie', href: HOST_ROUTES.verify.selfie },
        { number: '11', name: 'Checking', href: HOST_ROUTES.verify.checking },
        { number: '12', name: 'Verified, or could not verify', href: HOST_ROUTES.verify.result },
        { number: '13', name: 'Community verification', href: HOST_ROUTES.verify.community },
      ],
    },
    {
      title: 'Flow 4 · Create an offering',
      note: 'Screens 15 onwards need a draft: start at 14. They send you back there if there is none.',
      screens: [
        { number: '14', name: 'What do you offer', href: HOST_ROUTES.create.category },
        { number: '15', name: 'Tell us about it (voice)', href: HOST_ROUTES.create.voice },
        { number: '16', name: 'We drafted your listing', href: HOST_ROUTES.create.draft },
        ...GUIDED_FORM_FIELDS.map((field, index) => ({
          number: `16${String.fromCharCode('a'.charCodeAt(0) + index)}`,
          name: `Guided form · ${HOST_COPY.create.fields[field].question}`,
          href: HOST_ROUTES.create.form(index + 1),
        })),
        { number: '16·', name: 'Edit one field (price)', href: HOST_ROUTES.create.field('price') },
        { number: '16·', name: 'Edit one field (what you will do)', href: HOST_ROUTES.create.field('steps') },
        { number: '16·', name: 'Edit one field (what to bring)', href: HOST_ROUTES.create.field('whatToBring') },
        { number: '16·', name: 'Edit one field (how active it is)', href: HOST_ROUTES.create.field('difficulty') },
        { number: '17', name: 'Add photos', href: HOST_ROUTES.create.photos },
        { number: '18', name: 'When are you available', href: HOST_ROUTES.create.availability },
        { number: '19', name: 'Preview', href: HOST_ROUTES.create.preview },
        { number: '20', name: 'Published', href: HOST_ROUTES.create.published },
      ],
    },
    {
      title: 'Flow 5 · Manage offerings',
      screens: [
        { number: '21', name: 'My offerings (home tab)', href: HOST_ROUTES.offerings.list },
        { number: '22', name: 'Offering detail', href: needs(offering, HOST_ROUTES.offerings.detail) },
        { number: '23', name: 'Edit offering', href: needs(offering, HOST_ROUTES.offerings.edit) },
      ],
    },
    {
      title: 'Flow 6 · Bookings',
      screens: [
        { number: '24', name: 'Bookings tab', href: HOST_ROUTES.bookings.list },
        { number: '25', name: 'Booking detail', href: needs(booking, HOST_ROUTES.bookings.detail) },
        { number: '26', name: 'Decline', href: needs(targets.requestId, HOST_ROUTES.bookings.decline) },
        { number: '26', name: 'Cancel', href: needs(targets.confirmedId, HOST_ROUTES.bookings.cancel) },
        { number: '27', name: 'Completed (mark a confirmed booking as completed to reach it)', href: needs(targets.confirmedId, HOST_ROUTES.bookings.detail) },
      ],
    },
    {
      title: 'Flow 7 · Earnings and getting paid',
      screens: [
        { number: '28', name: 'Earnings tab', href: HOST_ROUTES.earnings.home },
        { number: '29', name: 'How you get paid', href: HOST_ROUTES.earnings.payoutMethod },
        ...PAYOUT_CHANNELS.map((option) => ({
          number: '29·',
          name: `Details · ${HOST_COPY.earnings.method.options[option.channel].title}`,
          href: HOST_ROUTES.earnings.payoutDetails(option.channel),
        })),
        { number: '30', name: 'Payout confirmation', href: needs(targets.sentPayoutId ?? targets.payoutId, HOST_ROUTES.earnings.payout) },
        { number: '31', name: 'Fee explainer', href: HOST_ROUTES.earnings.fees },
      ],
    },
    {
      title: 'Flow 8 · Profile and settings',
      screens: [
        { number: '32', name: 'Profile', href: HOST_ROUTES.profile.home },
        { number: '33', name: 'Language', href: HOST_ROUTES.profile.language },
        { number: '34', name: 'Notifications', href: HOST_ROUTES.profile.notifications },
      ],
    },
  ];
};

const notifications = (targets: Targets): Array<{ channel: string; icon: IconName; text: string; href?: string }> => [
  { channel: 'WhatsApp', icon: 'message', text: 'New booking request. Tap to answer.', href: targets.requestId ? HOST_ROUTES.bookings.detail(targets.requestId) : undefined },
  { channel: 'SMS', icon: 'smartphone', text: 'Booking confirmed. Tap to see where you meet.', href: targets.confirmedId ? HOST_ROUTES.bookings.detail(targets.confirmedId) : undefined },
  { channel: 'Push', icon: 'bell', text: HOST_COPY.verify.result.verifiedNotice, href: HOST_ROUTES.verify.result },
  { channel: 'WhatsApp', icon: 'message', text: 'Your listing is live. Tap to see it.', href: targets.liveOfferingId ? HOST_ROUTES.offerings.detail(targets.liveOfferingId) : undefined },
  { channel: 'SMS', icon: 'smartphone', text: targets.sentPayoutText ?? 'Payout sent.', href: targets.sentPayoutId ? HOST_ROUTES.earnings.payout(targets.sentPayoutId) : undefined },
];

export const FlowsIndexPage = () => {
  const targets = useHostApp(selectTargets);
  const personas = useHostApp(selectPersonas);
  const failVerification = useHostApp(selectOutcome);
  const simulatedOffline = useSyncExternalStore(connectivityService.subscribe, connectivityService.isSimulatedOffline, () => false);

  return (
    <HostScreen barTitle="Hosted · every host screen" barTitleIsHeading>
      <div className="flex flex-col gap-10">
        <section className="flex flex-col gap-3">
          <h2 className="text-title-lg text-ink">Demo controls</h2>
          <p className="text-caption text-muted">{`You are ${targets.hostName}. Data is seeded, saved on this device, and survives a reload.`}</p>
          <div role="radiogroup" aria-label="Host persona" className="flex flex-col gap-3">
            {personas.map((persona) => (
              <OptionTile key={persona.id} icon="user" title={persona.label} selected={persona.id === targets.hostId} onSelect={() => hostAppStore.switchPersona(persona.id)} />
            ))}
          </div>
          <ToggleRow icon="cloud-off" label="Pretend to be offline" checked={simulatedOffline} onLabel="On" offLabel="Off" onChange={(on) => connectivityService.setSimulatedOffline(on)} />
          <ToggleRow icon="alert" label="ID check fails" checked={failVerification} onLabel="On" offLabel="Off" onChange={(on) => hostAppStore.setVerificationOutcome(on ? 'FAILED' : 'VERIFIED')} />
          <Button variant="secondary" icon="retake" onClick={() => void hostAppStore.resetDemo()}>
            Reset the demo data
          </Button>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-title-lg text-ink">Notification entry points</h2>
          <p className="text-caption text-muted">Each message opens the screen it is about. WhatsApp and SMS are mocked on screen, as the PRD specifies.</p>
          <ul className="flex flex-col gap-3">
            {notifications(targets).map((notice) => (
              <li key={notice.text}>
                {notice.href ? (
                  <Link href={notice.href} className="flex items-start gap-3 rounded-lg bg-surface-soft p-4">
                    <Icon name={notice.icon} className="mt-0.5 shrink-0 text-ink" />
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="text-caption text-muted">{notice.channel}</span>
                      <span className="text-body-md text-ink">{notice.text}</span>
                    </span>
                  </Link>
                ) : (
                  <p className="rounded-lg bg-surface-soft p-4 text-caption text-muted">{`${notice.channel}: nothing to open for this host.`}</p>
                )}
              </li>
            ))}
          </ul>
        </section>

        {flows(targets).map((flow) => (
          <section key={flow.title} className="flex flex-col gap-2">
            <h2 className="text-title-lg text-ink">{flow.title}</h2>
            {flow.note ? <p className="text-caption text-muted">{flow.note}</p> : null}
            <ul className="flex flex-col">
              {flow.screens.map((screen) => (
                <li key={`${screen.number}-${screen.name}`}>
                  <Link href={screen.href} className="flex min-h-14 items-center gap-3 border-b border-hairline-soft py-3">
                    <span className="w-10 shrink-0 text-caption text-muted">{screen.number}</span>
                    <span className="min-w-0 flex-1 text-body-md text-ink">{screen.name}</span>
                    <span className="hidden text-caption text-muted tablet:inline">{screen.href}</span>
                    <Icon name="chevron-right" className="shrink-0 text-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </HostScreen>
  );
};
