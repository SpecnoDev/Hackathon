'use client';

import { useCallback, useState } from 'react';
import { APP_NAME } from '@/core/constants';
import { Banner, Button, Icon } from '@/shared/components';
import { formatRand, whatsAppLink } from '@/shared/utils';
import { DetailFact, ListingSummary, ShareSheet, TravellerScreen, TripNotice } from '../../components';
import { COPY_BOOK, COPY_COMMON, SUPPORT_WHATSAPP_NUMBER, TRAVELLER_ROUTES } from '../../constants';
import { useTravellerApp } from '../../hooks';
import type { TravellerAppState } from '../../interfaces';
import { hostOf, selectTrip, type TripWithListing } from '../../services/client';
import { formatDayAndTime } from '../../utils';

const CALENDAR_FILE = 'trip.ics';
const CALENDAR_DATA = 'data:text/calendar;charset=utf-8,';
const CALENDAR_LINE_BREAK = '\r\n';
const CALENDAR_SECONDS = '00';
/** iCalendar keeps backslashes, semicolons and commas for itself, so a title that has one must escape it. */
const CALENDAR_RESERVED = /[\\;,]/g;
/** Turns "2026-09-20", "09:30" and an ISO timestamp into the unpunctuated form iCalendar wants. */
const CALENDAR_PUNCTUATION = /[-:]|\.\d+/g;
const LINK_ICON_PX = 20;
/** TODO: Button cannot render a download link, so this anchor wears the secondary button's classes. Give Button a `download` prop and drop this. */
const DOWNLOAD_LINK =
  'inline-flex h-12 w-full select-none items-center justify-center gap-2 rounded-full border border-ink bg-canvas px-6 text-center text-button-md text-ink active:bg-surface-soft';

const copy = COPY_BOOK.confirmed;

const calendarText = (value: string): string => value.replace(CALENDAR_RESERVED, '\\$&');
const calendarStamp = (value: string): string => value.replace(CALENDAR_PUNCTUATION, '');

/**
 * The trip as an .ics file inside a link, so "Add to calendar" needs no server (RFC 5545). The start carries no time zone
 * on purpose: it means "09:30 wherever you are that day", which stays right for a visitor who books at home and flies in.
 */
const calendarHref = ({ trip, listing }: TripWithListing): string => {
  const day = calendarStamp(trip.date);
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${APP_NAME}//Traveller//EN`,
    'BEGIN:VEVENT',
    `UID:${trip.id}`,
    `DTSTAMP:${calendarStamp(trip.createdAt)}`,
    ...(trip.time ? [`DTSTART:${day}T${calendarStamp(trip.time)}${CALENDAR_SECONDS}`, `DURATION:PT${listing.durationMin}M`] : [`DTSTART;VALUE=DATE:${day}`]),
    `SUMMARY:${calendarText(listing.title)}`,
    `LOCATION:${calendarText(`${listing.meetingPoint}, ${listing.town}`)}`,
    `DESCRIPTION:${calendarText(copy.calendarNote(COPY_COMMON.hostedBy(hostOf(listing).firstName), COPY_COMMON.guests(trip.guests)))}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return `${CALENDAR_DATA}${encodeURIComponent(lines.join(CALENDAR_LINE_BREAK))}`;
};

/** Screen 12. An instant booking went through: the receipt, where to be, and the three things worth doing next. */
export const BookingConfirmedPage = ({ tripId }: { tripId: string }) => {
  const found = useTravellerApp(useCallback((state: TravellerAppState) => selectTrip(state, tripId), [tripId]));
  const [sharing, setSharing] = useState(false);

  if (!found) return <TripNotice barTitle={COPY_BOOK.flowTitle} {...COPY_BOOK.notice.trip} backHref={TRAVELLER_ROUTES.trips.list} backLabel={COPY_BOOK.viewTrips} />;

  const { trip, listing } = found;
  if (trip.status !== 'CONFIRMED') return <TripNotice barTitle={COPY_BOOK.flowTitle} {...COPY_BOOK.notice.changed} backHref={TRAVELLER_ROUTES.trips.detail(trip.id)} />;

  const host = hostOf(listing).firstName;
  const when = formatDayAndTime(trip.date, trip.time);

  return (
    <TravellerScreen
      barTitle={COPY_BOOK.flowTitle}
      heading={copy.title}
      width="column"
      footer={
        <Button size="md" href={TRAVELLER_ROUTES.trips.list}>
          {COPY_BOOK.viewTrips}
        </Button>
      }
    >
      <div className="flex flex-col gap-6">
        <Banner tone="success">{copy.banner(formatRand(trip.totalCents), host)}</Banner>
        <ListingSummary listing={listing} />

        <ul className="flex flex-col gap-5">
          <DetailFact icon="calendar" title={COPY_BOOK.facts.when}>
            <p>{when}</p>
            {trip.time ? null : <p className="text-body-sm text-muted">{COPY_COMMON.anyTime}</p>}
          </DetailFact>
          <DetailFact icon="users" title={COPY_BOOK.facts.guests}>
            {COPY_COMMON.guests(trip.guests)}
          </DetailFact>
          <DetailFact icon="banknote" title={COPY_BOOK.facts.total}>
            {formatRand(trip.totalCents)}
          </DetailFact>
          <DetailFact icon="map-pin" title={COPY_BOOK.facts.meet}>
            {`${listing.meetingPoint}, ${listing.town}`}
          </DetailFact>
        </ul>

        <div className="flex flex-col gap-3">
          {/* TODO: hosts have no public number in the data yet, so this opens the support line rather than the host. */}
          <Button size="md" variant="secondary" icon="message" href={whatsAppLink(SUPPORT_WHATSAPP_NUMBER, copy.whatsAppMessage(host, listing.title, when))}>
            {copy.whatsApp(host)}
          </Button>
          <a href={calendarHref(found)} download={CALENDAR_FILE} className={DOWNLOAD_LINK}>
            <Icon name="calendar-plus" size={LINK_ICON_PX} />
            <span>{copy.calendar}</span>
          </a>
          <Button size="md" variant="secondary" icon="share" onClick={() => setSharing(true)}>
            {copy.share}
          </Button>
        </div>
      </div>

      {sharing ? <ShareSheet path={TRAVELLER_ROUTES.trips.detail(trip.id)} message={copy.shareMessage(listing.title, when)} onClose={() => setSharing(false)} /> : null}
    </TravellerScreen>
  );
};
