import { randomUUID } from 'node:crypto';
import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { CLAUDE_MODEL, EXTRACTION_MAX_TOKENS } from '@/core/constants';
import { prisma } from '@/core/services';
import {
  AI_CANDIDATE_LIMIT,
  AI_MAX_BLOCKS_PER_DAY,
  EXPERIENCE_TYPE_LABEL,
  PLANNER_ERRORS,
  THEME_CATEGORIES,
  TRAVEL_THEMES,
  type TravelTheme,
} from '../constants';
import { aiPlanSchema } from '../dto';
import type { AiPlanResult, CandidateOffering, PlannerTrip } from '../interfaces';
import { PlannerError } from '../utils';
import { getPlannerTrip, listCandidateOfferings } from './planner-trip.service';

const client = new Anthropic();

const SYSTEM_PROMPT = [
  'You plan a group trip in South Africa from a list of real, bookable local experiences.',
  'Use only offeringIds from the list. Never invent one, and never repeat one that is already planned.',
  `Give each day at most ${AI_MAX_BLOCKS_PER_DAY} experiences, spaced through the day with realistic start times, and keep the first day lighter for arrival.`,
  'Prefer experiences that fit the theme and sit in or near the destination.',
  'The rationale is one warm sentence to the travellers. Plain language, no marketing copy, no em-dashes.',
].join(' ');

const themeCategories = (theme: string | null) =>
  theme && (TRAVEL_THEMES as readonly string[]).includes(theme) ? THEME_CATEGORIES[theme as TravelTheme] : [];

/** Theme-fitting experiences first, then the cap, so the brief stays short on a long catalogue. */
const shortlist = (candidates: CandidateOffering[], theme: string | null): CandidateOffering[] => {
  const preferred = themeCategories(theme);
  return [...candidates]
    .sort((a, b) => Number(preferred.includes(b.category)) - Number(preferred.includes(a.category)))
    .slice(0, AI_CANDIDATE_LIMIT);
};

const brief = (trip: PlannerTrip, candidates: CandidateOffering[]): string =>
  JSON.stringify({
    trip: {
      destination: trip.destination,
      departureFrom: trip.departureFrom,
      theme: trip.theme,
      travellers: trip.travellerCount,
      days: trip.days.map((day, dayIndex) => ({ dayIndex, day })),
    },
    alreadyPlanned: trip.blocks.map((block) => ({ offeringId: block.offeringId, day: block.day })),
    experiences: candidates.map((candidate) => ({
      offeringId: candidate.id,
      title: candidate.title,
      type: EXPERIENCE_TYPE_LABEL[candidate.category],
      town: candidate.town,
      durationMin: candidate.durationMin,
      priceCents: candidate.priceCents,
    })),
  });

interface Pick {
  offeringId: string;
  day: string;
  dayIndex: number;
  startTime: string;
}

/** The model's plan is advice; only ids we offered, on days that exist, within the per-day cap, become blocks. */
const acceptPicks = (trip: PlannerTrip, candidates: CandidateOffering[], plan: { offeringId: string; dayIndex: number; startTime: string }[]): Pick[] => {
  const known = new Set(candidates.map((candidate) => candidate.id));
  const taken = new Set(trip.blocks.map((block) => `${block.day}:${block.offeringId}`));
  const perDay = new Map(trip.days.map((day, index) => [index, trip.blocks.filter((block) => block.day === day).length]));
  const picks: Pick[] = [];

  for (const { offeringId, dayIndex, startTime } of plan) {
    const day = trip.days[dayIndex];
    const count = perDay.get(dayIndex) ?? 0;
    if (!day || !known.has(offeringId) || taken.has(`${day}:${offeringId}`) || count >= AI_MAX_BLOCKS_PER_DAY) continue;
    taken.add(`${day}:${offeringId}`);
    perDay.set(dayIndex, count + 1);
    picks.push({ offeringId, day, dayIndex, startTime });
  }
  return picks;
};

export const planTripWithAi = async (travellerId: string, tripId: string): Promise<AiPlanResult> => {
  const trip = await getPlannerTrip(travellerId, tripId);
  if (!trip) throw new PlannerError(PLANNER_ERRORS.notFound);
  if (trip.locked) throw new PlannerError(PLANNER_ERRORS.locked);

  const candidates = shortlist(await listCandidateOfferings(trip.destination), trip.theme);
  if (!candidates.length) throw new PlannerError(PLANNER_ERRORS.aiNothing);

  const response = await client.messages.parse({
    model: CLAUDE_MODEL,
    max_tokens: EXTRACTION_MAX_TOKENS,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: brief(trip, candidates) }],
    output_config: { format: zodOutputFormat(aiPlanSchema), effort: 'low' },
  });
  if (!response.parsed_output) throw new PlannerError(PLANNER_ERRORS.aiUnavailable);

  const picks = acceptPicks(trip, candidates, response.parsed_output.plan);
  const positions = new Map(trip.days.map((day, index) => [index, trip.blocks.filter((block) => block.day === day).length]));
  const data = picks.map((pick) => {
    const position = positions.get(pick.dayIndex) ?? 0;
    positions.set(pick.dayIndex, position + 1);
    return { id: randomUUID(), tripId, offeringId: pick.offeringId, day: new Date(pick.day), startTime: pick.startTime, position, addedById: travellerId };
  });
  if (data.length) await prisma.tripBlock.createMany({ data });

  return { added: data.length, rationale: response.parsed_output.rationale };
};
