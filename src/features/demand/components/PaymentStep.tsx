'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HTTP_STATUS } from '@/core/constants';
import { Banner, Button, Icon, TextInput } from '@/shared/components';
import type { BookingSummary, OfferingDetail } from '@/shared/dto';
import { formatRand, normalise } from '@/shared/utils';
import {
  BOOK_FLOW_STEPS,
  BOOK_STEP,
  CARD_CVV_LENGTH,
  CARD_NUMBER_LENGTH,
  COPY_BOOK,
  COPY_COMMON,
  DEMO_DECLINED_CARD_ENDING,
  DEMO_PAYMENT_DELAY_MS,
  PAYMENT_METHOD_ICON,
  TRAVELLER_ROUTES,
} from '../constants';
import { useBookingDraft, useOnline } from '../hooks';
import { formatDayAndTime, priceBooking } from '../utils';
import { BookingNotice } from './BookingNotice';
import { ListingSummary } from './ListingSummary';
import { TravellerScreen } from './TravellerScreen';

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

type Failure = keyof typeof copy.failure;

/** Offline is nobody's mistake, so it is a notice. The others are errors. */
const FAILURE_TONE: Record<Failure, 'error' | 'warning'> = { DECLINED: 'error', OFFLINE: 'warning', SIGNED_OUT: 'error', UNKNOWN: 'error' };

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

/**
 * Screen 11. A mock gateway in front of the real booking: it waits, says no to a card ending in DEMO_DECLINED_CARD_ENDING,
 * otherwise posts the booking. Only a yes or a no leaves this component; the card itself never does.
 */
export const PaymentStep = ({ offering, signedIn }: { offering: OfferingDetail; signedIn: boolean }) => {
  const router = useRouter();
  const online = useOnline();
  const { draft, clear, ready } = useBookingDraft(offering.id, offering.groupMin);
  // SECURITY: card details live in this component's state and die with it. Never the draft, storage, the URL or a log.
  const [card, setCard] = useState(EMPTY_CARD);
  const [attempted, setAttempted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [failure, setFailure] = useState<Failure>();
  // Minted once, so a retry after a network wobble replays the same booking instead of making a second one.
  const bookingId = useRef<string>(undefined);
  const gateway = useRef<number>(undefined);
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => () => window.clearTimeout(gateway.current), []);

  const instant = offering.bookingMode === 'INSTANT';
  const step = { current: BOOK_STEP.pay, total: BOOK_FLOW_STEPS };
  const hostFirstName = offering.host.fullName.split(' ')[0];

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
          <h1 className="font-display text-display-lg text-ink">{instant ? copy.processing.title : copy.processing.requestTitle(hostFirstName)}</h1>
          <p className="text-body-md text-body">{copy.processing.body}</p>
        </div>
      </TravellerScreen>
    );
  }

  if (!ready) return <TravellerScreen barTitle={COPY_BOOK.flowTitle} width="column">{null}</TravellerScreen>;
  if (!draft.date || draft.time === undefined || !draft.guest || !draft.paymentMethod || !signedIn) {
    return <BookingNotice barTitle={COPY_BOOK.flowTitle} {...COPY_BOOK.notice.details} backHref={TRAVELLER_ROUTES.book.review(offering.id)} />;
  }

  const { date, time, guests, guest, paymentMethod: method, blockId } = draft;
  const total = formatRand(priceBooking(offering, guests).totalCents);
  const issues = attempted && method === 'CARD' ? cardIssues(card, new Date()) : {};
  const patchCard = (change: Partial<CardFields>): void => setCard((current) => ({ ...current, ...change }));
  const showTop = (): void => top.current?.scrollIntoView();

  const submitBooking = async (): Promise<void> => {
    bookingId.current ??= crypto.randomUUID();
    const res = await fetch('/api/v1/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: bookingId.current, offeringId: offering.id, date, startTime: time, groupSize: guests, guest, paymentMethod: method, blockId }),
    });
    if (res.status === HTTP_STATUS.unauthorized) throw new Error('SIGNED_OUT');
    const body = (await res.json()) as { data?: BookingSummary; error?: { message: string } };
    if (!body.data) throw new Error('UNKNOWN');
    clear();
    router.replace(body.data.status === 'CONFIRMED' ? TRAVELLER_ROUTES.book.confirmed(body.data.id) : TRAVELLER_ROUTES.book.requested(body.data.id));
  };

  const pay = (): void => {
    setAttempted(true);
    setFailure(undefined);
    if (method === 'CARD' && Object.values(cardIssues(card, new Date())).some(Boolean)) return showTop();
    if (!online) {
      setFailure('OFFLINE');
      return showTop();
    }
    // TODO: stand-in for the payment gateway. A card ending in DEMO_DECLINED_CARD_ENDING is declined so the error state can be shown.
    const declined = method === 'CARD' && digitsOf(card.number).endsWith(DEMO_DECLINED_CARD_ENDING);
    setProcessing(true);
    gateway.current = window.setTimeout(() => {
      if (declined) {
        setProcessing(false);
        setFailure('DECLINED');
        return;
      }
      submitBooking().catch((error: Error) => {
        setProcessing(false);
        setFailure(error.message === 'SIGNED_OUT' ? 'SIGNED_OUT' : 'UNKNOWN');
      });
    }, DEMO_PAYMENT_DELAY_MS);
  };

  return (
    <TravellerScreen
      barTitle={COPY_BOOK.flowTitle}
      backHref={TRAVELLER_ROUTES.book.review(offering.id)}
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

        <ListingSummary title={offering.title} photo={offering.photos[0]} meta={`${COPY_COMMON.hostedBy(hostFirstName)} · ${offering.town}`}>
          <p className="text-body-sm text-muted">{COPY_BOOK.summary(formatDayAndTime(date, time), COPY_COMMON.guests(guests))}</p>
        </ListingSummary>
        <p className="flex items-baseline justify-between gap-4 border-y border-hairline-soft py-4 text-title-md text-ink">
          <span>{COPY_BOOK.price.total}</span>
          <span>{total}</span>
        </p>

        {method === 'CARD' ? (
          <>
            {instant ? null : <Banner tone="info">{copy.onRequestCard}</Banner>}
            <TextInput label={copy.card.number} value={card.number} onChange={(value) => patchCard({ number: formatCardNumber(value) })} error={issues.number} placeholder={copy.card.numberPlaceholder} inputMode="numeric" autoComplete="cc-number" />
            <TextInput label={copy.card.expiry} value={card.expiry} onChange={(value) => patchCard({ expiry: formatExpiry(value) })} error={issues.expiry} placeholder={copy.card.expiryPlaceholder} inputMode="numeric" autoComplete="cc-exp" />
            <TextInput label={copy.card.cvv} value={card.cvv} onChange={(value) => patchCard({ cvv: digitsOf(value).slice(0, CARD_CVV_LENGTH) })} helper={copy.card.cvvHelper(CARD_CVV_LENGTH)} error={issues.cvv} inputMode="numeric" autoComplete="cc-csc" />
            <TextInput label={copy.card.name} value={card.name} onChange={(value) => patchCard({ name: value })} error={issues.name} autoComplete="cc-name" />
          </>
        ) : (
          <Banner tone="info" icon={PAYMENT_METHOD_ICON[method]}>
            {copy.next[offering.bookingMode][method]}
          </Banner>
        )}

        <p className="flex items-start gap-2 text-caption text-muted">
          <Icon name="lock" size={NOTE_ICON_PX} className="mt-0.5 shrink-0" />
          {copy.demo}
        </p>
        <Button variant="tertiary" href={TRAVELLER_ROUTES.book.review(offering.id)}>
          {copy.another}
        </Button>
      </div>
    </TravellerScreen>
  );
};
