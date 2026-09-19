'use client';

import { useId, useRef, useState, type ReactNode, type Ref } from 'react';
import { useRouter } from 'next/navigation';
import { FREE_CANCELLATION_WINDOW_HOURS, LANGUAGE_LABELS } from '@/core/constants';
import { Banner, Button, Icon, OptionTile, TextInput, ToggleRow } from '@/shared/components';
import { LANGUAGE_CODES, PAYMENT_METHODS, type GuestDetails, type OfferingDetail, type PaymentMethod } from '@/shared/dto';
import { formatRand, normalise } from '@/shared/utils';
import { BOOK_FLOW_STEPS, BOOK_STEP, COPY_BOOK, COPY_COMMON, PAYMENT_METHOD_ICON, TRAVELLER_PHONE_PATTERN, TRAVELLER_ROUTES, normalisePhone } from '../constants';
import { useBookingDraft } from '../hooks';
import { formatDayAndTime, priceBooking } from '../utils';
import { BookingNotice } from './BookingNotice';
import { BookingPrice } from './BookingPrice';
import { ListingSummary } from './ListingSummary';
import { TravellerScreen } from './TravellerScreen';

const copy = COPY_BOOK.review;

/** What the signed-in traveller's profile already holds, to start the form from. */
export interface GuestDefaults {
  name: string;
  phone: string;
  language: GuestDetails['language'];
}

interface ReviewStepProps {
  offering: OfferingDetail;
  signedIn: boolean;
  defaults?: GuestDefaults;
}

/** The scroll margin clears the sticky bar and step indicator when a section is brought into view. */
const Section = ({ title, ref, children }: { title: string; ref: Ref<HTMLElement>; children: ReactNode }) => (
  <section ref={ref} className="flex scroll-mt-28 flex-col gap-4 border-t border-hairline-soft pt-6">
    <h2 className="text-title-lg text-ink">{title}</h2>
    {children}
  </section>
);

/** "Change" twice on one screen tells a screen reader nothing, so each link also says what it changes. */
const ChangeLink = ({ href, label }: { href: string; label: string }) => (
  <Button variant="tertiary" href={href}>
    <span aria-hidden>{copy.change}</span>
    <span className="sr-only">{label}</span>
  </Button>
);

/** Screen 10. Everything the traveller is agreeing to, with the fees, before any payment details are asked for. */
export const ReviewStep = ({ offering, signedIn, defaults }: ReviewStepProps) => {
  const router = useRouter();
  const languageId = useId();
  const detailsRef = useRef<HTMLElement>(null);
  const paymentRef = useRef<HTMLElement>(null);
  const { draft, patch, ready } = useBookingDraft(offering.id, offering.groupMin);
  const [guest, setGuest] = useState<GuestDetails>();
  const [method, setMethod] = useState<PaymentMethod>();
  const [attempted, setAttempted] = useState(false);

  if (!ready) return <TravellerScreen barTitle={COPY_BOOK.flowTitle} width="column">{null}</TravellerScreen>;
  if (!draft.date || draft.time === undefined) {
    return <BookingNotice barTitle={COPY_BOOK.flowTitle} {...COPY_BOOK.notice.schedule} backHref={TRAVELLER_ROUTES.book.date(offering.id)} />;
  }

  const form: GuestDetails = guest ?? draft.guest ?? { name: defaults?.name ?? '', phone: defaults?.phone ?? '', whatsAppOptIn: false, language: defaults?.language ?? 'EN' };
  const chosen = method ?? draft.paymentMethod;
  const instant = offering.bookingMode === 'INSTANT';
  const name = normalise(form.name);
  const phone = normalisePhone(form.phone);
  const phoneOk = TRAVELLER_PHONE_PATTERN.test(phone);
  const patchGuest = (change: Partial<GuestDetails>): void => setGuest({ ...form, ...change });

  const next = (): void => {
    setAttempted(true);
    // The button is pinned, so the first thing left to fix may be off the screen.
    if (!name || !phoneOk) return detailsRef.current?.scrollIntoView();
    if (!chosen) return paymentRef.current?.scrollIntoView();
    patch({ guest: { ...form, name, phone }, paymentMethod: chosen });
    // Guests can fill this in: sign-in waits until there is something to pay for. The draft stays on this phone meanwhile.
    router.push(signedIn ? TRAVELLER_ROUTES.book.pay(offering.id) : TRAVELLER_ROUTES.login);
  };

  return (
    <TravellerScreen
      barTitle={COPY_BOOK.flowTitle}
      backHref={TRAVELLER_ROUTES.book.guests(offering.id)}
      step={{ current: BOOK_STEP.review, total: BOOK_FLOW_STEPS }}
      heading={instant ? copy.title : copy.requestTitle}
      width="column"
      footer={
        <>
          {instant ? null : <p className="text-center text-caption text-muted">{copy.requestNote}</p>}
          {signedIn ? null : <p className="text-center text-caption text-muted">{copy.signInNote}</p>}
          <Button size="md" onClick={next}>
            {!signedIn ? COPY_BOOK.cta.signIn : instant ? COPY_BOOK.cta.pay(formatRand(priceBooking(offering, draft.guests).totalCents)) : COPY_BOOK.cta.request}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <ListingSummary title={offering.title} photo={offering.photos[0]} meta={`${COPY_COMMON.hostedBy(offering.host.fullName.split(' ')[0])} · ${offering.town}`} />

        <ul className="flex flex-col gap-2">
          <li className="flex flex-wrap items-center gap-x-2 text-body-md text-ink">
            <Icon name="calendar" className="shrink-0 text-muted" />
            <span>{formatDayAndTime(draft.date, draft.time)}</span>
            <ChangeLink href={TRAVELLER_ROUTES.book.date(offering.id)} label={copy.changeWhen} />
          </li>
          {draft.time === null ? <li className="pl-9 text-body-sm text-muted">{COPY_COMMON.anyTime}</li> : null}
          <li className="flex flex-wrap items-center gap-x-2 text-body-md text-ink">
            <Icon name="users" className="shrink-0 text-muted" />
            <span>{COPY_COMMON.guests(draft.guests)}</span>
            <ChangeLink href={TRAVELLER_ROUTES.book.guests(offering.id)} label={copy.changeGuests} />
          </li>
        </ul>

        <BookingPrice offering={offering} guests={draft.guests} />

        <p className="flex items-start gap-3 text-body-md text-body">
          <Icon name="calendar-x" className="shrink-0 text-ink" />
          {copy.cancelTerms(FREE_CANCELLATION_WINDOW_HOURS)}
        </p>

        <Section ref={detailsRef} title={copy.details.title}>
          <TextInput label={copy.details.name} value={form.name} onChange={(value) => patchGuest({ name: value })} helper={copy.details.nameHelper} error={attempted && !name ? copy.errors.name : undefined} autoComplete="name" />
          <TextInput
            label={copy.details.phone}
            value={form.phone}
            onChange={(value) => patchGuest({ phone: value })}
            helper={copy.details.phoneHelper}
            error={attempted && !phoneOk ? copy.errors.phone : undefined}
            placeholder={copy.details.phonePlaceholder}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
          />
          <ToggleRow icon="message" label={copy.details.whatsApp} checked={form.whatsAppOptIn} onLabel={COPY_COMMON.on} offLabel={COPY_COMMON.off} onChange={(whatsAppOptIn) => patchGuest({ whatsAppOptIn })} />
          <div className="flex flex-col gap-2">
            <p id={languageId} className="text-caption text-ink">
              {copy.details.language}
            </p>
            <div role="radiogroup" aria-labelledby={languageId} className="flex flex-col gap-3">
              {LANGUAGE_CODES.map((code) => (
                <OptionTile key={code} title={LANGUAGE_LABELS[code]} lang={code.toLowerCase()} selected={form.language === code} onSelect={() => patchGuest({ language: code })} />
              ))}
            </div>
          </div>
        </Section>

        <Section ref={paymentRef} title={copy.payment.title}>
          <div role="radiogroup" aria-label={copy.payment.title} className="flex flex-col gap-3">
            {PAYMENT_METHODS.map((option) => (
              <OptionTile key={option} icon={PAYMENT_METHOD_ICON[option]} title={copy.payment.methods[option].title} description={copy.payment.methods[option].description} selected={chosen === option} onSelect={() => setMethod(option)} />
            ))}
          </div>
          {attempted && !chosen ? <Banner tone="error">{copy.errors.method}</Banner> : null}
        </Section>
      </div>
    </TravellerScreen>
  );
};
