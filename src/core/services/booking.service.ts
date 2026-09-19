import { BookingStatus, Prisma } from '@prisma/client';
import { API_ERROR_CODES, BOOKING_LIST_DEFAULT_TAKE, HTTP_STATUS } from '@/core/constants';
import { ApiError } from '@/core/utils';
import { HostBookingPatchDto } from '@/shared/dto';
import { prisma } from './prisma.service';

const HOST_BOOKING_SELECT = {
  id: true,
  offeringId: true,
  status: true,
  date: true,
  groupSize: true,
  totalCents: true,
  feeCents: true,
  hostReceivesCents: true,
  paymentRef: true,
  respondBy: true,
  createdAt: true,
  offering: { select: { title: true } },
  traveller: { select: { name: true } },
} as const;

type HostBookingRow = Prisma.BookingGetPayload<{ select: typeof HOST_BOOKING_SELECT }>;

export type HostBooking = Omit<HostBookingRow, 'offering' | 'traveller'> & {
  offeringTitle: string;
  travellerName: string;
};

const toHostBooking = ({ offering, traveller, ...booking }: HostBookingRow): HostBooking => ({
  ...booking,
  offeringTitle: offering.title,
  travellerName: traveller.name,
});

/** Scoped by the host id a guard returned, never by an id from the request. Bounded, newest first. */
export const listHostBookings = async (hostId: string): Promise<HostBooking[]> => {
  const bookings = await prisma.booking.findMany({
    where: { hostId },
    orderBy: { createdAt: 'desc' },
    take: BOOKING_LIST_DEFAULT_TAKE,
    select: HOST_BOOKING_SELECT,
  });

  return bookings.map(toHostBooking);
};

/**
 * REQUESTED -> CONFIRMED/DECLINED is the only host-driven transition. A booking already at the
 * requested target status is a replayed outbox write and returns the current row unchanged
 * (200, idempotent); a booking sitting at any other status is a conflict, never silently
 * overwritten. A row that doesn't belong to this host reads as NOT_FOUND, never revealing
 * another host's booking.
 */
export const updateHostBookingStatus = async (
  hostId: string,
  bookingId: string,
  { status }: HostBookingPatchDto,
): Promise<HostBooking> => {
  const existing = await prisma.booking.findFirst({
    where: { id: bookingId, hostId },
    select: HOST_BOOKING_SELECT,
  });
  if (!existing) throw new ApiError(API_ERROR_CODES.notFound, HTTP_STATUS.notFound, 'Booking not found');
  if (existing.status === status) return toHostBooking(existing);

  if (existing.status !== BookingStatus.REQUESTED) {
    throw new ApiError(
      API_ERROR_CODES.bookingStatusConflict,
      HTTP_STATUS.conflict,
      `Booking is already ${existing.status}`,
    );
  }

  // Re-scoped by hostId and the REQUESTED precondition so a concurrent PATCH can't win a race
  // the pre-check above already passed — count === 0 means someone else moved it first.
  const { count } = await prisma.booking.updateMany({
    where: { id: bookingId, hostId, status: BookingStatus.REQUESTED },
    data: { status },
  });

  if (count === 0) {
    const current = await prisma.booking.findFirst({ where: { id: bookingId, hostId }, select: HOST_BOOKING_SELECT });
    throw new ApiError(
      API_ERROR_CODES.bookingStatusConflict,
      HTTP_STATUS.conflict,
      `Booking is already ${current?.status ?? existing.status}`,
    );
  }

  const updated = await prisma.booking.findFirstOrThrow({
    where: { id: bookingId, hostId },
    select: HOST_BOOKING_SELECT,
  });

  return toHostBooking(updated);
};
