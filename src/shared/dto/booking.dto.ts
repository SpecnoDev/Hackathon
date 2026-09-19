import { z } from 'zod';
import { BOOKING_MODES, LANGUAGE_CODES } from './offering.dto';

export const BOOKING_STATUSES = ['REQUESTED', 'CONFIRMED', 'DECLINED', 'COMPLETED', 'CANCELLED'] as const;
export const PAYMENT_METHODS = ['CARD', 'INSTANT_EFT', 'QR', 'WALLET'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

/** "HH:MM", 24-hour, as the host's start times are stored. */
const START_TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
/** Digits with an optional leading +, international length. Visitors book from abroad, so this is looser than the host's SA-only rule. */
const TRAVELLER_PHONE_PATTERN = /^\+?\d{9,15}$/;

export const bookingSummarySchema = z.object({
  id: z.string(),
  offeringId: z.string(),
  offeringTitle: z.string(),
  offeringPhoto: z.string().nullable(),
  offeringTown: z.string(),
  meetingPoint: z.string(),
  durationMin: z.int().nullable(),
  bookingMode: z.enum(BOOKING_MODES),
  hostId: z.string(),
  hostFirstName: z.string(),
  status: z.enum(BOOKING_STATUSES),
  date: z.iso.datetime(),
  /** Null when the host confirms a time with the traveller. */
  startTime: z.string().regex(START_TIME_PATTERN).nullable(),
  groupSize: z.int(),
  totalCents: z.int(),
  paymentMethod: z.enum(PAYMENT_METHODS).nullable(),
  respondBy: z.iso.datetime(),
  cancelReason: z.string().nullable(),
  refundCents: z.int().nullable(),
});

export type BookingSummary = z.infer<typeof bookingSummarySchema>;

export const bookingListResponseSchema = z.array(bookingSummarySchema);

export const guestDetailsSchema = z.object({
  name: z.string().trim().min(1),
  phone: z.string().trim().regex(TRAVELLER_PHONE_PATTERN),
  whatsAppOptIn: z.boolean(),
  language: z.enum(LANGUAGE_CODES),
});

export type GuestDetails = z.infer<typeof guestDetailsSchema>;

/** A direct booking of one offering. The id is minted on the client so a replayed submit is a no-op. */
export const createBookingSchema = z.object({
  id: z.uuid(),
  offeringId: z.string().min(1),
  date: z.iso.date(),
  startTime: z.string().regex(START_TIME_PATTERN).nullable(),
  groupSize: z.int().min(1),
  guest: guestDetailsSchema,
  paymentMethod: z.enum(PAYMENT_METHODS),
  /** Set when the booking was started from a stop on a trip plan; the booking then belongs to that block. */
  blockId: z.string().optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const cancelBookingSchema = z.object({
  reason: z.string().trim().min(1).optional(),
});

export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;

/** The only transitions a host can make from the UI — REQUESTED -> CONFIRMED/DECLINED. */
export const hostBookingPatchSchema = z.object({ status: z.enum(['CONFIRMED', 'DECLINED']) }).strict();

export type HostBookingPatchDto = z.infer<typeof hostBookingPatchSchema>;
