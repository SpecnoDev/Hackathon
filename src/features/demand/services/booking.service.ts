import type { Prisma } from '@prisma/client';
import { API_ERROR_CODES, HOST_RESPONSE_HOURS, HTTP_STATUS, MOCK_PAYMENT_REF_PREFIX, MS_PER_SECOND, MINUTES_PER_HOUR, SECONDS_PER_MINUTE } from '@/core/constants';
import { prisma } from '@/core/services';
import { ApiError } from '@/core/utils';
import type { BookingSummary, CancelBookingInput, CreateBookingInput } from '@/shared/dto';
import { priceBooking, refundFor } from '../utils';

const MS_PER_HOUR = MS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR;

const BOOKING_INCLUDE = {
  offering: {
    select: { title: true, photos: true, town: true, meetingPoint: true, durationMin: true, bookingMode: true, host: { select: { id: true, fullName: true } } },
  },
} satisfies Prisma.BookingInclude;

type BookingRow = Prisma.BookingGetPayload<{ include: typeof BOOKING_INCLUDE }>;

const toBookingSummary = (booking: BookingRow): BookingSummary => ({
  id: booking.id,
  offeringId: booking.offeringId,
  offeringTitle: booking.offering.title,
  offeringPhoto: booking.offering.photos[0] ?? null,
  offeringTown: booking.offering.town,
  meetingPoint: booking.offering.meetingPoint,
  durationMin: booking.offering.durationMin,
  bookingMode: booking.offering.bookingMode,
  hostId: booking.offering.host.id,
  hostFirstName: booking.offering.host.fullName.split(' ')[0],
  status: booking.status,
  date: booking.date.toISOString(),
  startTime: booking.startTime,
  groupSize: booking.groupSize,
  totalCents: booking.totalCents,
  paymentMethod: booking.paymentMethod,
  respondBy: booking.respondBy.toISOString(),
  cancelReason: booking.cancelReason,
  refundCents: booking.refundCents,
});

/** Scoped by the traveller id a guard returned — a booking that is not theirs is not found, not forbidden. */
export const getTravellerBooking = async (travellerId: string, bookingId: string): Promise<BookingSummary | null> => {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: BOOKING_INCLUDE });
  return booking && booking.travellerId === travellerId ? toBookingSummary(booking) : null;
};

export const listTravellerBookings = async (travellerId: string): Promise<BookingSummary[]> => {
  const bookings = await prisma.booking.findMany({ where: { travellerId }, include: BOOKING_INCLUDE, orderBy: { date: 'desc' } });
  return bookings.map(toBookingSummary);
};

/**
 * A direct booking of one offering, priced here so the preview and the stored row agree. Instant book confirms and
 * stamps a mock payment reference; a request waits for the host and charges nothing. The guest details become the
 * traveller's own profile, since they are how the host reaches whoever booked. Upsert by the client id: a replay is a no-op.
 */
export const createBooking = async (travellerId: string, input: CreateBookingInput): Promise<BookingSummary | null> => {
  const offering = await prisma.offering.findUnique({
    where: { id: input.offeringId },
    select: { id: true, hostId: true, status: true, priceCents: true, priceUnit: true, groupMin: true, groupMax: true, bookingMode: true },
  });
  if (!offering || offering.status !== 'LIVE') return null;
  if (input.groupSize < offering.groupMin || (offering.groupMax !== null && input.groupSize > offering.groupMax)) {
    throw new ApiError(API_ERROR_CODES.validationFailed, HTTP_STATUS.unprocessable, 'That many guests is outside what this host takes.');
  }

  // A stop on a plan can be booked only by a member of that trip, for the offering it holds, and only once.
  const block = input.blockId
    ? await prisma.tripBlock.findFirst({
        where: { id: input.blockId, offeringId: offering.id, booking: null, trip: { members: { some: { travellerId } } } },
        select: { id: true },
      })
    : null;
  if (input.blockId && !block) return null;

  const price = priceBooking(offering, input.groupSize);
  const instant = offering.bookingMode === 'INSTANT';
  const now = Date.now();

  const [, booking] = await prisma.$transaction([
    prisma.traveller.update({
      where: { id: travellerId },
      data: { name: input.guest.name, phone: input.guest.phone, language: input.guest.language },
    }),
    prisma.booking.upsert({
      where: { id: input.id },
      update: {},
      create: {
        id: input.id,
        offeringId: offering.id,
        hostId: offering.hostId,
        travellerId,
        blockId: block?.id,
        status: instant ? 'CONFIRMED' : 'REQUESTED',
        date: new Date(input.date),
        startTime: input.startTime,
        groupSize: input.groupSize,
        totalCents: price.totalCents,
        feeCents: price.feeCents,
        hostReceivesCents: price.hostReceivesCents,
        paymentMethod: input.paymentMethod,
        whatsAppOptIn: input.guest.whatsAppOptIn,
        paymentRef: instant ? `${MOCK_PAYMENT_REF_PREFIX}${input.id}` : null,
        respondBy: new Date(now + HOST_RESPONSE_HOURS * MS_PER_HOUR),
      },
      include: BOOKING_INCLUDE,
    }),
  ]);

  return toBookingSummary(booking);
};

/** Scoped by the traveller id a guard returned — cancelling someone else's booking is not this traveller's to do. */
export const cancelBooking = async (travellerId: string, bookingId: string, input: CancelBookingInput): Promise<BookingSummary | null> => {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking || booking.travellerId !== travellerId) return null;
  if (booking.status === 'CANCELLED' || booking.status === 'DECLINED' || booking.status === 'COMPLETED') return null;

  const refund = refundFor(booking, new Date());

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'CANCELLED', cancelReason: input.reason ?? null, cancelledAt: new Date(), refundCents: refund.cents },
    include: BOOKING_INCLUDE,
  });

  return toBookingSummary(updated);
};
