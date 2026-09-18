import { prisma } from '@/core/services';
import type { BookingSummary, CancelBookingInput } from '@/shared/dto';
import { refundFor } from './booking-pricing.service';

/** Scoped by the traveller id a guard returned — a booking that is not theirs is not found, not forbidden. */
export const getTravellerBooking = async (travellerId: string, bookingId: string): Promise<BookingSummary | null> => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { offering: { select: { title: true, photos: true } } },
  });
  if (!booking || booking.travellerId !== travellerId) return null;

  return {
    id: booking.id,
    offeringId: booking.offeringId,
    offeringTitle: booking.offering.title,
    offeringPhoto: booking.offering.photos[0] ?? null,
    status: booking.status,
    date: booking.date.toISOString(),
    groupSize: booking.groupSize,
    totalCents: booking.totalCents,
    respondBy: booking.respondBy.toISOString(),
    cancelReason: booking.cancelReason,
    refundCents: booking.refundCents,
  };
};

export const listTravellerBookings = async (travellerId: string): Promise<BookingSummary[]> => {
  const bookings = await prisma.booking.findMany({
    where: { travellerId },
    include: { offering: { select: { title: true, photos: true } } },
    orderBy: { date: 'desc' },
  });

  return bookings.map((booking) => ({
    id: booking.id,
    offeringId: booking.offeringId,
    offeringTitle: booking.offering.title,
    offeringPhoto: booking.offering.photos[0] ?? null,
    status: booking.status,
    date: booking.date.toISOString(),
    groupSize: booking.groupSize,
    totalCents: booking.totalCents,
    respondBy: booking.respondBy.toISOString(),
    cancelReason: booking.cancelReason,
    refundCents: booking.refundCents,
  }));
};

/** Scoped by the traveller id a guard returned — cancelling someone else's booking is not this traveller's to do. */
export const cancelBooking = async (
  travellerId: string,
  bookingId: string,
  input: CancelBookingInput,
): Promise<BookingSummary | null> => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { offering: { select: { title: true, photos: true } } },
  });
  if (!booking || booking.travellerId !== travellerId) return null;
  if (booking.status === 'CANCELLED' || booking.status === 'DECLINED' || booking.status === 'COMPLETED') return null;

  const refund = refundFor(booking, new Date());

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: 'CANCELLED',
      cancelReason: input.reason ?? null,
      cancelledAt: new Date(),
      refundCents: refund.cents,
    },
    include: { offering: { select: { title: true, photos: true } } },
  });

  return {
    id: updated.id,
    offeringId: updated.offeringId,
    offeringTitle: updated.offering.title,
    offeringPhoto: updated.offering.photos[0] ?? null,
    status: updated.status,
    date: updated.date.toISOString(),
    groupSize: updated.groupSize,
    totalCents: updated.totalCents,
    respondBy: updated.respondBy.toISOString(),
    cancelReason: updated.cancelReason,
    refundCents: updated.refundCents,
  };
};
