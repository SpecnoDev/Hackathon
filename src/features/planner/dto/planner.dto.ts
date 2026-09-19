import { z } from 'zod';
import {
  PLANNER_FORM_ERRORS,
  TRAVEL_THEMES,
  TRIP_DURATION_MAX_NIGHTS,
  TRIP_DURATION_MIN_NIGHTS,
  TRIP_TRAVELLERS_MAX,
  TRIP_TRAVELLERS_MIN,
} from '../constants';

const CLOCK_TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

export const planTripSchema = z.object({
  destination: z.string().trim().min(2, PLANNER_FORM_ERRORS.destination).max(80),
  departureFrom: z.string().trim().min(2, PLANNER_FORM_ERRORS.departureFrom).max(80),
  durationNights: z.coerce.number().int().min(TRIP_DURATION_MIN_NIGHTS).max(TRIP_DURATION_MAX_NIGHTS),
  travellerCount: z.coerce.number().int().min(TRIP_TRAVELLERS_MIN).max(TRIP_TRAVELLERS_MAX),
  departureDate: z.iso.date({ error: PLANNER_FORM_ERRORS.departureDate }),
  theme: z.enum(TRAVEL_THEMES, { error: PLANNER_FORM_ERRORS.theme }),
});
export type PlanTripDto = z.infer<typeof planTripSchema>;

export const addBlockSchema = z.object({
  id: z.uuid(),
  offeringId: z.string().min(1),
  dayIndex: z.int().min(0),
});
export type AddBlockDto = z.infer<typeof addBlockSchema>;

/** `up: null` withdraws the traveller's vote rather than casting one. */
export const voteSchema = z.object({
  blockId: z.string().min(1),
  up: z.boolean().nullable(),
});
export type VoteDto = z.infer<typeof voteSchema>;

export const setBlockTimeSchema = z.object({
  blockId: z.string().min(1),
  startTime: z.string().regex(CLOCK_TIME, PLANNER_FORM_ERRORS.startTime),
});
export type SetBlockTimeDto = z.infer<typeof setBlockTimeSchema>;

export const aiPlanSchema = z.object({
  rationale: z.string().describe('One warm sentence to the travellers on why the days are shaped this way.'),
  plan: z
    .array(
      z.object({
        offeringId: z.string().describe('An offeringId from the list, never invented.'),
        dayIndex: z.int().min(0),
        startTime: z.string().regex(CLOCK_TIME).describe('24-hour HH:MM'),
      }),
    )
    .describe('Ordered by day then time.'),
});
export type AiPlanDto = z.infer<typeof aiPlanSchema>;
