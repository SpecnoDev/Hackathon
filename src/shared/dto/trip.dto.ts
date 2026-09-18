import { z } from 'zod';

export const tripSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
});

export type TripSummary = z.infer<typeof tripSummarySchema>;

export const tripListResponseSchema = z.array(tripSummarySchema);

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
