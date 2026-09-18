'use client';

import { useState } from 'react';
import { APP_NAME } from '@/core/constants';
import { Button, Icon } from '@/shared/components';
import type { BookingSummary } from '@/shared/dto';
import { whatsAppLink } from '@/shared/utils';
import { COPY_BOOK, COPY_COMMON, SUPPORT_WHATSAPP_NUMBER, TRAVELLER_ROUTES } from '../constants';
import { formatDayAndTime } from '../utils';
import { ShareSheet } from './ShareSheet';

const CALENDAR_FILE = 'trip.ics';
const CALENDAR_DATA = 'data:text/calendar;charset=utf-8,';
const CALENDAR_LINE_BREAK = '\r\n';
const CALENDAR_SECONDS = '00';
/** iCalendar keeps backslashes, semicolons and commas for itself, so a title that has one must escape it. */
const CALENDAR_RESERVED = /[\;,]/g;
const CALENDAR_PUNCTUATION = /[-:]|\.\d+/g;
const LINK_ICON_PX = 20;
/** TODO: Button cannot render a download link, so this anchor wears the secondary button's classes. */
const DOWNLOAD_LINK = 'inline-flex h-12 w-full select-none items-center justify-center gap-2 rounded-full border border-ink bg-canvas px-6 text-center text-button-md text-ink active:bg-surface-soft';

const copy = COPY_BOOK.confirmed;

const calendarText = (value: string): string => value.replace(CALENDAR_RESERVED, '\\$&');
const calendarStamp = (value: string): string => value.replace(CALENDAR_PUNCTUATION, '');

/**
 * The booking as an .ics file inside a link, so "Add to calendar" needs no server (RFC 5545). The start carries no time zone
 * on purpose: it means "09:30 wherever you are that day", which stays right for a visitor who books at home and flies in.
 */
const calendarHref = (booking: BookingSummary): string => {
  const day = calendarStamp(booking.date.slice(0, 10));
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${APP_NAME}//Traveller//EN`,
    'BEGIN:VEVENT',
    `UID:${booking.id}`,
    `DTSTAMP:${calendarStamp(new Date().toISOString())}`,
    ...(booking.startTime && booking.durationMin ? [`DTSTART:${day}T${calendarStamp(booking.startTime)}${CALENDAR_SECONDS}`, `DURATION:PT${booking.durationMin}M`] : [`DTSTART;VALUE=DATE:${day}`]),
    `SUMMARY:${calendarText(booking.offeringTitle)}`,
    `LOCATION:${calendarText(`${booking.meetingPoint}, ${booking.offeringTown}`)}`,
    `DESCRIPTION:${calendarText(copy.calendarNote(COPY_COMMON.hostedBy(booking.hostFirstName), COPY_COMMON.guests(booking.groupSize)))}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return `${CALENDAR_DATA}${encodeURIComponent(lines.join(CALENDAR_LINE_BREAK))}`;
};

/** The three things worth doing after an instant booking goes through. */
export const BookingConfirmedActions = ({ booking }: { booking: BookingSummary }) => {
  const [sharing, setSharing] = useState(false);
  const when = formatDayAndTime(booking.date, booking.startTime);

  return (
    <div className="flex flex-col gap-3">
      {/* TODO: hosts have no public number in the data yet, so this opens the support line rather than the host. */}
      <Button size="md" variant="secondary" icon="message" href={whatsAppLink(SUPPORT_WHATSAPP_NUMBER, copy.whatsAppMessage(booking.hostFirstName, booking.offeringTitle, when))}>
        {copy.whatsApp(booking.hostFirstName)}
      </Button>
      <a href={calendarHref(booking)} download={CALENDAR_FILE} className={DOWNLOAD_LINK}>
        <Icon name="calendar-plus" size={LINK_ICON_PX} />
        <span>{copy.calendar}</span>
      </a>
      <Button size="md" variant="secondary" icon="share" onClick={() => setSharing(true)}>
        {copy.share}
      </Button>
      {sharing ? <ShareSheet path={TRAVELLER_ROUTES.bookings.detail(booking.id)} message={copy.shareMessage(booking.offeringTitle, when)} onClose={() => setSharing(false)} /> : null}
    </div>
  );
};
