'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/core/constants';
import { requireTravellerPage } from '@/core/guards';
import { PLANNER_COPY, PLANNER_ERRORS } from '../constants';
import { addBlockSchema, planTripSchema, setBlockTimeSchema, voteSchema } from '../dto';
import type { PlannerActionState } from '../interfaces';
import {
  addPlannerBlock,
  createPlannerTrip,
  planTripWithAi,
  removePlannerBlock,
  setPlannerBlockTime,
  voteOnPlannerBlock,
} from '../services';
import { PlannerError } from '../utils';

const tripPath = (tripId: string) => `${ROUTES.plan}/${tripId}`;

const failed = (error: unknown): PlannerActionState => ({
  error: error instanceof PlannerError ? error.message : PLANNER_ERRORS.generic,
});

/** Every mutation resolves the traveller from the session, never from the client, and re-renders the board in the same round trip. */
const mutate = async (tripId: string, run: (travellerId: string) => Promise<void>): Promise<PlannerActionState> => {
  const { traveller } = await requireTravellerPage();
  try {
    await run(traveller.id);
  } catch (error) {
    return failed(error);
  }
  revalidatePath(tripPath(tripId));
  return {};
};

export const createTripAction = async (_previous: PlannerActionState, formData: FormData): Promise<PlannerActionState> => {
  const { traveller } = await requireTravellerPage();
  const parsed = planTripSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? PLANNER_ERRORS.generic };

  const { id } = await createPlannerTrip(traveller.id, parsed.data);
  redirect(tripPath(id));
};

export const addBlockAction = async (tripId: string, input: unknown): Promise<PlannerActionState> =>
  mutate(tripId, (travellerId) => addPlannerBlock(travellerId, tripId, addBlockSchema.parse(input)));

export const removeBlockAction = async (tripId: string, blockId: string): Promise<PlannerActionState> =>
  mutate(tripId, (travellerId) => removePlannerBlock(travellerId, tripId, blockId));

export const voteAction = async (tripId: string, input: unknown): Promise<PlannerActionState> =>
  mutate(tripId, (travellerId) => voteOnPlannerBlock(travellerId, tripId, voteSchema.parse(input)));

export const setBlockTimeAction = async (tripId: string, input: unknown): Promise<PlannerActionState> =>
  mutate(tripId, (travellerId) => setPlannerBlockTime(travellerId, tripId, setBlockTimeSchema.parse(input)));

export const planWithAiAction = async (tripId: string): Promise<PlannerActionState> => {
  const { traveller } = await requireTravellerPage();
  try {
    const { added, rationale } = await planTripWithAi(traveller.id, tripId);
    revalidatePath(tripPath(tripId));
    return { note: added ? rationale : PLANNER_COPY.board.aiNothing };
  } catch (error) {
    return failed(error);
  }
};
