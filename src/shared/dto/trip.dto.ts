import { z } from 'zod';

export const tripSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
});

export type TripSummary = z.infer<typeof tripSummarySchema>;

export const tripListResponseSchema = z.array(tripSummarySchema);

export const tripBlockSchema = z.object({
  id: z.string(),
  offeringId: z.string(),
  offeringTitle: z.string(),
  offeringPhoto: z.string().nullable(),
  priceCents: z.int(),
  priceUnit: z.enum(['PER_PERSON', 'PER_TRIP']),
  day: z.iso.date(),
  upVotes: z.int(),
  downVotes: z.int(),
  myVote: z.boolean().nullable(),
  bookingId: z.string().nullable(),
});

export type TripBlock = z.infer<typeof tripBlockSchema>;

export const tripDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
  shareCode: z.string(),
  locked: z.boolean(),
  isOrganiser: z.boolean(),
  memberCount: z.int(),
  blocks: z.array(tripBlockSchema),
});

export type TripDetail = z.infer<typeof tripDetailSchema>;

export const createTripSchema = z.object({
  id: z.uuid(),
  name: z.string().trim().min(1),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
});

export type CreateTripInput = z.infer<typeof createTripSchema>;

export const createTripBlockSchema = z.object({
  id: z.uuid(),
  offeringId: z.string(),
  day: z.iso.date(),
});

export type CreateTripBlockInput = z.infer<typeof createTripBlockSchema>;

export const voteBlockSchema = z.object({
  up: z.boolean(),
});

export type VoteBlockInput = z.infer<typeof voteBlockSchema>;
