'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Banner, Button, Icon, TextInput } from '@/shared/components';
import { formatRand, normalise } from '@/shared/utils';
import { ListingSummary, TravellerScreen, TripNotice } from '../../components';
import {
  BOOK_FLOW_STEPS,
  CARD_CVV_LENGTH,
  CARD_NUMBER_LENGTH,
  COPY_BOOK,
  COPY_COMMON,
  DEMO_DECLINED_CARD_ENDING,
  DEMO_PAYMENT_DELAY_MS,
  PAYMENT_METHODS,
  TRAVELLER_ROUTES,
} from '../../constants';
import { useBookingDraft, useOnline, useTravellerApp } from '../../hooks';
import type { TravellerAppState } from '../../interfaces';
import { hostOf, priceBooking, travellerAppStore } from '../../services/client';
import { formatDayAndTime } from '../../utils';

const PAY_STEP = 4;
const STATUS_ICON_PX = 48;
const NOTE_ICON_PX = 16;
const CARD_GROUP_SIZE = 4;
const EXPIRY_MONTH_DIGITS = 2;
const EXPIRY_DIGITS = 4;
const MONTHS_IN_YEAR = 12;
const CENTURY = 2000;
const NON_DIGITS = /\D/g;
const CARD_GROUPS = new RegExp(`(\\d{${CARD_GROUP_SIZE}})(?=\\d)`, 'g');

const copy = COPY_BOOK.pay;
const selectSignedIn = (state: TravellerAppState): boolean => state.profile.signedIn;

type Failure = keyof typeof copy.failure;

/** Offline is nobody's mistake, so it is a notice. The other two are errors. */
const FAILURE_TONE: Record<Failure, 'error' | 'warning'> = { DECLINED: 'error', OFFLINE: 'warning', UNKNOWN: 'error' };

interface CardFields {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}

const EMPTY_CARD: CardFields = { number: '', expiry: '', cvv: '', name: '' };

const digitsOf = (input: string): string => input.replace(NON_DIGITS, '');

const formatCardNumber = (input: string): string => digitsOf(input).slice(0, CARD_NUMBER_LENGTH).replace(CARD_GROUPS, '$1 ');

const formatExpiry = (input: string): string => {
  const digits = digitsOf(input).slice(0, EXPIRY_DIGITS);
  return digits.length > EXPIRY_MONTH_DIGITS ? `${digits.slice(0, EXPIRY_MONTH_DIGITS)}/${digits.slice(EXPIRY_MONTH_DIGITS)}` : digits;
};

/** A card is good to the end of the month printed on it, which is the day before the first of the next one. */
const isStillValid = (expiry: string, now: Date): boolean => {
  const digits = digitsOf(expiry);
  const month = Number(digits.slice(0, EXPIRY_MONTH_DIGITS));
  const year = CENTURY + Number(digits.slice(EXPIRY_MONTH_DIGITS));
  return digits.length === EXPIRY_DIGITS && month >= 1 && month <= MONTHS_IN_YEAR && new Date(year, month, 1).getTime() > now.getTime();
};

const cardIssues = (card: CardFields, now: Date): Partial<Record<keyof CardFields, string>> => ({
  number: digitsOf(card.number).length === CARD_NUMBER_LENGTH ? undefined : copy.errors.number(CARD_NUMBER_LENGTH),
  expiry: isStillValid(card.expiry, now) ? undefined : copy.errors.expiry,
  cvv: card.cvv.length === CARD_CVV_LENGTH ? undefined : copy.errors.cvv(CARD_CVV_LENGTH),
  name: normalise(card.name) ? undefined : copy.errors.name,
});

/** Screen 11. A mock gateway: it waits, then says yes, or says no to a card ending in DEMO_DECLINED_CARD_ENDING. */
export const PaymentPage = ({ listingId }: { listingId: string }) => {
  const router = useRouter();
  const online = useOnline();
  const signedIn = useTravellerApp(selectSignedIn);
  const { listing, draft, scheduled } = useBookingDraft(listingId);
  // SECURITY: card details live in this component's state and die with it. Never the store, IndexedDB, the URL or a log.
  const [card, setCard] = useState(EMPTY_CARD);
  const [attempted, setAttempted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [failure, setFailure] = useState<Failure>();
  const gateway = useRef<number | undefined>(undefined);
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => () => window.clearTimeout(gateway.current), []);

  if (!listing) return <TripNotice barTitle={COPY_BOOK.flowTitle} {...COPY_BOOK.notice.listing} backHref={TRAVELLER_ROUTES.home} />;

  const instant = listing.bookingMode === 'INSTANT';
  const step = { current: PAY_STEP, total: BOOK_FLOW_STEPS };

  // Checked before the draft: a booking that goes through clears the draft, and this stays up until the next screen takes over.
  if (processing) {
    return (
      <TravellerScreen
        barTitle={COPY_BOOK.flowTitle}
        step={step}
        width="column"
        footer={
          <Button size="md" disabled>
            {copy.working}
          </Button>
        }
      >
        <div role="status" className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <span className="flex size-24 animate-pulse items-center justify-center rounded-full bg-primary-tint text-primary-text motion-reduce:animate-none">
            <Icon name="clock" size={STATUS_ICON_PX} />
          </span>
          <h1 className="font-display text-display-lg text-ink">{instant ? copy.processing.title : copy.processing.requestTitle(hostOf(listing).firstName)}</h1>
          <p className="text-body-md text-body">{copy.processing.body}</p>
        </div>
      </TravellerScreen>
    );
  }

  if (!draft) return <TravellerScreen barTitle={COPY_BOOK.flowTitle} width="column">{null}</TravellerScreen>;
  if (!scheduled?.guest || !scheduled.paymentMethod || !signedIn) {
    return <TripNotice barTitle={COPY_BOOK.flowTitle} {...COPY_BOOK.notice.details} backHref={TRAVELLER_ROUTES.book.review(listing.id)} />;
  }

  const method = scheduled.paymentMethod;
  const total = formatRand(priceBooking(listing, scheduled.guests).totalCents);
  const issues = attempted && method === 'CARD' ? cardIssues(card, new Date()) : {};
  const patchCard = (patch: Partial<CardFields>): void => setCard((current) => ({ ...current, ...patch }));

  // The button is pinned, so whatever stopped the payment may be off the screen.
  const showTop = (): void => top.current?.scrollIntoView();

  const pay = (): void => {
    setAttempted(true);
    setFailure(undefined);
    if (method === 'CARD' && Object.values(cardIssues(card, new Date())).some(Boolean)) return showTop();
    if (!online) {
      setFailure('OFFLINE');
      return showTop();
    }
    // TODO: stand-in for the payment gateway. Only a yes or a no leaves this function; the card itself never does.
    const declined = method === 'CARD' && digitsOf(card.number).endsWith(DEMO_DECLINED_CARD_ENDING);
    setProcessing(true);
    gateway.current = window.setTimeout(() => {
      const trip = declined ? undefined : travellerAppStore.confirmBooking();
      if (trip) return router.replace(trip.status === 'CONFIRMED' ? TRAVELLER_ROUTES.book.confirmed(trip.id) : TRAVELLER_ROUTES.book.requested(trip.id));
      setProcessing(false);
      setFailure(declined ? 'DECLINED' : 'UNKNOWN');
    }, DEMO_PAYMENT_DELAY_MS);
  };

  return (
    <TravellerScreen
      barTitle={COPY_BOOK.flowTitle}
      backHref={TRAVELLER_ROUTES.book.review(listing.id)}
      step={step}
      heading={instant ? copy.title : copy.requestTitle}
      width="column"
      footer={
        <Button size="md" onClick={pay}>
          {instant ? COPY_BOOK.cta.pay(total) : COPY_BOOK.cta.sendRequest}
        </Button>
      }
    >
      <div ref={top} className="flex scroll-mt-28 flex-col gap-6">
        {failure ? <Banner tone={FAILURE_TONE[failure]}>{copy.failure[failure]}</Banner> : null}

        <ListingSummary listing={listing}>
          <p className="text-body-sm text-muted">{COPY_BOOK.summary(formatDayAndTime(scheduled.date, scheduled.time), COPY_COMMON.guests(scheduled.guests))}</p>
        </ListingSummary>
        <p className="flex items-baseline justify-between gap-4 border-y border-hairline-soft py-4 text-title-md text-ink">
          <span>{COPY_BOOK.price.total}</span>
          <span>{total}</span>
        </p>

        {method === 'CARD' ? (
          <>
            {instant ? null : <Banner tone="info">{copy.onRequestCard}</Banner>}
            <TextInput
              label={copy.card.number}
              value={card.number}
              onChange={(value) => patchCard({ number: formatCardNumber(value) })}
              error={issues.number}
              placeholder={copy.card.numberPlaceholder}
              inputMode="numeric"
              autoComplete="cc-number"
            />
            <TextInput
              label={copy.card.expiry}
              value={card.expiry}
              onChange={(value) => patchCard({ expiry: formatExpiry(value) })}
              error={issues.expiry}
              placeholder={copy.card.expiryPlaceholder}
              inputMode="numeric"
              autoComplete="cc-exp"
            />
            <TextInput
              label={copy.card.cvv}
              value={card.cvv}
              onChange={(value) => patchCard({ cvv: digitsOf(value).slice(0, CARD_CVV_LENGTH) })}
              helper={copy.card.cvvHelper(CARD_CVV_LENGTH)}
              error={issues.cvv}
              inputMode="numeric"
              autoComplete="cc-csc"
            />
            <TextInput label={copy.card.name} value={card.name} onChange={(value) => patchCard({ name: value })} error={issues.name} autoComplete="cc-name" />
          </>
        ) : (
          <Banner tone="info" icon={PAYMENT_METHODS.find((option) => option.method === method)?.icon}>
            {copy.next[listing.bookingMode][method]}
          </Banner>
        )}

        <p className="flex items-start gap-2 text-caption text-muted">
          <Icon name="lock" size={NOTE_ICON_PX} className="mt-0.5 shrink-0" />
          {copy.demo}
        </p>
        <Button variant="tertiary" href={TRAVELLER_ROUTES.book.review(listing.id)}>
          {copy.another}
        </Button>
      </div>
    </TravellerScreen>
  );
};
