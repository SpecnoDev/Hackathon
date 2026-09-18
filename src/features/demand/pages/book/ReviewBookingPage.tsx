'use client';

import { useId, useRef, useState, type ReactNode, type Ref } from 'react';
import { useRouter } from 'next/navigation';
import { FREE_CANCELLATION_WINDOW_HOURS } from '@/core/constants';
import { Banner, Button, Icon, OptionTile, TextInput, ToggleRow } from '@/shared/components';
import { formatLocalPhone, formatRand, isSaMobile, normalise } from '@/shared/utils';
import { BookingPrice, DetailFact, ListingSummary, TravellerScreen, TripNotice } from '../../components';
import { BOOK_FLOW_STEPS, COPY_BOOK, COPY_COMMON, LANGUAGES, PAYMENT_METHODS, TRAVELLER_ROUTES } from '../../constants';
import { type ScheduledDraft, useBookingDraft, useTravellerApp } from '../../hooks';
import type { GuestDetails, Listing, TravellerAppState, TravellerProfile } from '../../interfaces';
import { priceBooking, travellerAppStore } from '../../services/client';
import { formatDayAndTime, isTravellerPhone, normalisePhone } from '../../utils';

const REVIEW_STEP = 3;
/** The same rule as sign-in: how people write a number down is not part of it. TODO: share one phone helper with the sign-in screen. */
const copy = COPY_BOOK.review;
const selectProfile = (state: TravellerAppState): TravellerProfile => state.profile;

/** What the traveller told us last time, else what their profile holds. WhatsApp updates start off: that is theirs to turn on. */
const startingGuest = (draft: ScheduledDraft, profile: TravellerProfile): GuestDetails => {
  const guest = draft.guest ?? { name: profile.firstName, phone: profile.phone, whatsAppOptIn: false, language: profile.language };
  return { ...guest, phone: isSaMobile(guest.phone) ? formatLocalPhone(guest.phone) : guest.phone };
};

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

const ReviewForm = ({ listing, draft, profile }: { listing: Listing; draft: ScheduledDraft; profile: TravellerProfile }) => {
  const router = useRouter();
  const languageId = useId();
  const detailsRef = useRef<HTMLElement>(null);
  const paymentRef = useRef<HTMLElement>(null);
  const [guest, setGuest] = useState(() => startingGuest(draft, profile));
  const [method, setMethod] = useState(draft.paymentMethod);
  const [attempted, setAttempted] = useState(false);

  const instant = listing.bookingMode === 'INSTANT';
  const name = normalise(guest.name);
  const phone = normalisePhone(guest.phone);
  const phoneOk = isTravellerPhone(guest.phone);
  const patchGuest = (patch: Partial<GuestDetails>): void => setGuest((current) => ({ ...current, ...patch }));

  const next = (): void => {
    setAttempted(true);
    // The button is pinned, so the first thing left to fix may be off the screen.
    if (!name || !phoneOk) return detailsRef.current?.scrollIntoView();
    if (!method) return paymentRef.current?.scrollIntoView();
    travellerAppStore.patchBooking({ guest: { ...guest, name, phone }, paymentMethod: method });
    if (profile.signedIn) return router.push(TRAVELLER_ROUTES.book.pay(listing.id));
    // Guests can book: sign-in waits until there is something to pay for, then brings them back here.
    travellerAppStore.startSignIn(TRAVELLER_ROUTES.book.review(listing.id));
    router.push(TRAVELLER_ROUTES.signIn.phone);
  };

  return (
    <TravellerScreen
      barTitle={COPY_BOOK.flowTitle}
      backHref={TRAVELLER_ROUTES.book.guests(listing.id)}
      step={{ current: REVIEW_STEP, total: BOOK_FLOW_STEPS }}
      heading={instant ? copy.title : copy.requestTitle}
      width="column"
      footer={
        <>
          {instant ? null : <p className="text-center text-caption text-muted">{copy.requestNote}</p>}
          {profile.signedIn ? null : <p className="text-center text-caption text-muted">{copy.signInNote}</p>}
          <Button size="md" onClick={next}>
            {instant ? COPY_BOOK.cta.pay(formatRand(priceBooking(listing, draft.guests).totalCents)) : COPY_BOOK.cta.request}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <ListingSummary listing={listing} />

        <ul className="flex flex-col gap-2">
          <DetailFact icon="calendar" title={COPY_BOOK.facts.when}>
            <div className="flex flex-wrap items-center gap-x-2">
              <span>{formatDayAndTime(draft.date, draft.time)}</span>
              <ChangeLink href={TRAVELLER_ROUTES.book.date(listing.id)} label={copy.changeWhen} />
            </div>
            {draft.time === null ? <p className="text-body-sm text-muted">{COPY_COMMON.anyTime}</p> : null}
          </DetailFact>
          <DetailFact icon="users" title={COPY_BOOK.facts.guests}>
            <div className="flex flex-wrap items-center gap-x-2">
              <span>{COPY_COMMON.guests(draft.guests)}</span>
              <ChangeLink href={TRAVELLER_ROUTES.book.guests(listing.id)} label={copy.changeGuests} />
            </div>
          </DetailFact>
        </ul>

        <BookingPrice listing={listing} guests={draft.guests} />

        <p className="flex items-start gap-3 text-body-md text-body">
          <Icon name="calendar-x" className="shrink-0 text-ink" />
          {copy.cancelTerms(FREE_CANCELLATION_WINDOW_HOURS)}
        </p>

        <Section ref={detailsRef} title={copy.details.title}>
          <TextInput
            label={copy.details.name}
            value={guest.name}
            onChange={(value) => patchGuest({ name: value })}
            helper={copy.details.nameHelper}
            error={attempted && !name ? copy.errors.name : undefined}
            autoComplete="name"
          />
          <TextInput
            label={copy.details.phone}
            value={guest.phone}
            onChange={(value) => patchGuest({ phone: value })}
            helper={copy.details.phoneHelper}
            error={attempted && !phoneOk ? copy.errors.phone : undefined}
            placeholder={copy.details.phonePlaceholder}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
          />
          <ToggleRow
            icon="message"
            label={copy.details.whatsApp}
            checked={guest.whatsAppOptIn}
            onLabel={COPY_COMMON.on}
            offLabel={COPY_COMMON.off}
            onChange={(whatsAppOptIn) => patchGuest({ whatsAppOptIn })}
          />
          <div className="flex flex-col gap-2">
            <p id={languageId} className="text-caption text-ink">
              {copy.details.language}
            </p>
            <div role="radiogroup" aria-labelledby={languageId} className="flex flex-col gap-3">
              {LANGUAGES.map(({ code, name: language }) => (
                <OptionTile key={code} title={language} lang={code.toLowerCase()} selected={guest.language === code} onSelect={() => patchGuest({ language: code })} />
              ))}
            </div>
          </div>
        </Section>

        <Section ref={paymentRef} title={copy.payment.title}>
          <div role="radiogroup" aria-label={copy.payment.title} className="flex flex-col gap-3">
            {PAYMENT_METHODS.map(({ method: option, icon }) => (
              <OptionTile
                key={option}
                icon={icon}
                title={copy.payment.methods[option].title}
                description={copy.payment.methods[option].description}
                selected={method === option}
                onSelect={() => setMethod(option)}
              />
            ))}
          </div>
          {attempted && !method ? <Banner tone="error">{copy.errors.method}</Banner> : null}
        </Section>
      </div>
    </TravellerScreen>
  );
};

/** Screen 10. Everything the traveller is agreeing to, with the fees, before any payment details are asked for. */
export const ReviewBookingPage = ({ listingId }: { listingId: string }) => {
  const { listing, draft, scheduled } = useBookingDraft(listingId);
  const profile = useTravellerApp(selectProfile);

  if (!listing) return <TripNotice barTitle={COPY_BOOK.flowTitle} {...COPY_BOOK.notice.listing} backHref={TRAVELLER_ROUTES.home} />;
  if (!draft) return <TravellerScreen barTitle={COPY_BOOK.flowTitle} width="column">{null}</TravellerScreen>;
  if (!scheduled) return <TripNotice barTitle={COPY_BOOK.flowTitle} {...COPY_BOOK.notice.schedule} backHref={TRAVELLER_ROUTES.book.date(listing.id)} />;

  return <ReviewForm listing={listing} draft={scheduled} profile={profile} />;
};
