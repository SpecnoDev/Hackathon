import { z } from 'zod';

export const BOOKING_STATUSES = ['REQUESTED', 'CONFIRMED', 'DECLINED', 'COMPLETED', 'CANCELLED'] as const;

export const bookingSummarySchema = z.object({
  id: z.string(),
  offeringId: z.string(),
  offeringTitle: z.string(),
  offeringPhoto: z.string().nullable(),
  status: z.enum(BOOKING_STATUSES),
  date: z.iso.datetime(),
  groupSize: z.int(),
  totalCents: z.int(),
  respondBy: z.iso.datetime(),
  cancelReason: z.string().nullable(),
  refundCents: z.int().nullable(),
});

export type BookingSummary = z.infer<typeof bookingSummarySchema>;

export const bookingListResponseSchema = z.array(bookingSummarySchema);

export const cancelBookingSchema = z.object({
  reason: z.string().trim().min(1).optional(),
});

export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
