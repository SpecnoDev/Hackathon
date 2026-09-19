import { randomUUID } from 'node:crypto';
import { PUBLIC_OFFERING_WHERE, listLiveOfferings, prisma } from '@/core/services';
import { CANDIDATE_LIST_LIMIT, DEFAULT_START_TIMES, PLANNER_ERRORS, SHARE_CODE_LENGTH, tripName } from '../constants';
import type { AddBlockDto, PlanTripDto, SetBlockTimeDto, VoteDto } from '../dto';
import type { CandidateOffering, PlannerBlock, PlannerTrip, PlannerTripSummary } from '../interfaces';
import { PlannerError, addDays, toIsoDate, tripDays } from '../utils';

/** Every read and write is scoped to a trip the traveller belongs to; a miss reads as not found, never as someone else's trip. */
const memberOf = (travellerId: string) => ({ members: { some: { travellerId } } });

const findTrip = (travellerId: string, tripId: string) =>
  prisma.trip.findFirst({
    where: { id: tripId, ...memberOf(travellerId) },
    include: {
      members: { select: { traveller: { select: { id: true, name: true } } } },
      blocks: {
        include: {
          offering: { include: { host: { select: { fullName: true, story: true } } } },
          votes: { select: { travellerId: true, up: true } },
        },
        orderBy: [{ day: 'asc' }, { startTime: 'asc' }, { position: 'asc' }],
      },
    },
  });

type TripRow = NonNullable<Awaited<ReturnType<typeof findTrip>>>;

const toBlock = (row: TripRow['blocks'][number], travellerId: string): PlannerBlock => ({
  id: row.id,
  offeringId: row.offeringId,
  title: row.offering.title,
  photo: row.offering.photos[0] ?? null,
  category: row.offering.category,
  town: row.offering.town,
  meetingPoint: row.offering.meetingPoint,
  durationMin: row.offering.durationMin,
  priceCents: row.offering.priceCents,
  perPerson: row.offering.priceUnit === 'PER_PERSON',
  groupMax: row.offering.groupMax,
  hostName: row.offering.host.fullName,
  hostStory: row.offering.host.story,
  day: toIsoDate(row.day),
  startTime: row.startTime,
  position: row.position,
  upVotes: row.votes.filter((vote) => vote.up).length,
  downVotes: row.votes.filter((vote) => !vote.up).length,
  myVote: row.votes.find((vote) => vote.travellerId === travellerId)?.up ?? null,
});

const toTrip = (row: TripRow, travellerId: string): PlannerTrip => ({
  id: row.id,
  name: row.name,
  destination: row.destination,
  departureFrom: row.departureFrom,
  theme: row.theme,
  travellerCount: row.travellerCount,
  startDate: toIsoDate(row.startDate),
  endDate: toIsoDate(row.endDate),
  days: tripDays(row.startDate, row.endDate),
  shareCode: row.shareCode,
  locked: row.locked,
  isOrganiser: row.organiserId === travellerId,
  members: row.members.map((member) => member.traveller),
  blocks: row.blocks.map((block) => toBlock(block, travellerId)),
});

export const getPlannerTrip = async (travellerId: string, tripId: string): Promise<PlannerTrip | null> => {
  const row = await findTrip(travellerId, tripId);
  return row && toTrip(row, travellerId);
};

export const listPlannerTrips = async (travellerId: string): Promise<PlannerTripSummary[]> => {
  const rows = await prisma.trip.findMany({
    where: memberOf(travellerId),
    select: {
      id: true,
      name: true,
      destination: true,
      theme: true,
      startDate: true,
      endDate: true,
      _count: { select: { members: true, blocks: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return rows.map(({ _count, startDate, endDate, ...rest }) => ({
    ...rest,
    startDate: toIsoDate(startDate),
    endDate: toIsoDate(endDate),
    memberCount: _count.members,
    blockCount: _count.blocks,
  }));
};

/** Regions with something live to plan around, for the destination suggestions. */
export const listDestinations = async (): Promise<string[]> => {
  const rows = await prisma.offering.findMany({
    where: PUBLIC_OFFERING_WHERE,
    distinct: ['region'],
    select: { region: true },
    orderBy: { region: 'asc' },
  });
  return rows.map((row) => row.region);
};

export const createPlannerTrip = async (travellerId: string, input: PlanTripDto): Promise<{ id: string }> => {
  const id = randomUUID();
  const startDate = new Date(input.departureDate);

  return prisma.trip.create({
    data: {
      id,
      organiserId: travellerId,
      name: tripName(input.destination, input.theme),
      startDate,
      endDate: addDays(startDate, input.durationNights),
      shareCode: id.slice(0, SHARE_CODE_LENGTH),
      destination: input.destination,
      departureFrom: input.departureFrom,
      travellerCount: input.travellerCount,
      theme: input.theme,
      members: { create: { travellerId } },
    },
    select: { id: true },
  });
};

export const joinPlannerTrip = async (travellerId: string, shareCode: string): Promise<{ id: string } | null> => {
  const trip = await prisma.trip.findUnique({ where: { shareCode }, select: { id: true } });
  if (!trip) return null;

  await prisma.tripMember.upsert({
    where: { tripId_travellerId: { tripId: trip.id, travellerId } },
    create: { tripId: trip.id, travellerId },
    update: {},
  });
  return trip;
};

const requireOpenTrip = async (travellerId: string, tripId: string) => {
  const trip = await prisma.trip.findFirst({
    where: { id: tripId, ...memberOf(travellerId) },
    select: { id: true, startDate: true, endDate: true, locked: true },
  });
  if (!trip) throw new PlannerError(PLANNER_ERRORS.notFound);
  if (trip.locked) throw new PlannerError(PLANNER_ERRORS.locked);
  return trip;
};

/** Idempotent on the client-supplied id, so a retried drop never doubles a block. */
export const addPlannerBlock = async (
  travellerId: string,
  tripId: string,
  input: AddBlockDto,
  startTime?: string,
): Promise<void> => {
  const trip = await requireOpenTrip(travellerId, tripId);
  const day = tripDays(trip.startDate, trip.endDate)[input.dayIndex];
  if (!day) throw new PlannerError(PLANNER_ERRORS.badDay);

  const offering = await prisma.offering.findFirst({ where: { id: input.offeringId, ...PUBLIC_OFFERING_WHERE }, select: { id: true } });
  if (!offering) throw new PlannerError(PLANNER_ERRORS.offeringGone);

  const position = await prisma.tripBlock.count({ where: { tripId, day: new Date(day) } });
  const data = {
    tripId,
    offeringId: input.offeringId,
    day: new Date(day),
    startTime: startTime ?? DEFAULT_START_TIMES[Math.min(position, DEFAULT_START_TIMES.length - 1)],
    position,
    addedById: travellerId,
  };
  await prisma.tripBlock.upsert({ where: { id: input.id }, create: { id: input.id, ...data }, update: {} });
};

export const removePlannerBlock = async (travellerId: string, tripId: string, blockId: string): Promise<void> => {
  await requireOpenTrip(travellerId, tripId);
  const block = await prisma.tripBlock.findFirst({ where: { id: blockId, tripId }, select: { booking: { select: { id: true } } } });
  if (!block) throw new PlannerError(PLANNER_ERRORS.notFound);
  if (block.booking) throw new PlannerError(PLANNER_ERRORS.booked);

  await prisma.$transaction([prisma.vote.deleteMany({ where: { blockId } }), prisma.tripBlock.delete({ where: { id: blockId } })]);
};

export const voteOnPlannerBlock = async (travellerId: string, tripId: string, { blockId, up }: VoteDto): Promise<void> => {
  await requireOpenTrip(travellerId, tripId);
  const block = await prisma.tripBlock.findFirst({ where: { id: blockId, tripId }, select: { id: true } });
  if (!block) throw new PlannerError(PLANNER_ERRORS.notFound);

  if (up === null) {
    await prisma.vote.deleteMany({ where: { blockId, travellerId } });
    return;
  }
  await prisma.vote.upsert({
    where: { blockId_travellerId: { blockId, travellerId } },
    create: { blockId, travellerId, up },
    update: { up },
  });
};

export const setPlannerBlockTime = async (travellerId: string, tripId: string, { blockId, startTime }: SetBlockTimeDto): Promise<void> => {
  await requireOpenTrip(travellerId, tripId);
  const { count } = await prisma.tripBlock.updateMany({ where: { id: blockId, tripId }, data: { startTime } });
  if (count === 0) throw new PlannerError(PLANNER_ERRORS.notFound);
};

/** What the panel offers: the destination's live listings, or everything live when the destination has none yet. */
export const listCandidateOfferings = async (destination: string | null): Promise<CandidateOffering[]> => {
  const local = destination ? await listLiveOfferings({ region: destination, take: CANDIDATE_LIST_LIMIT }) : [];
  const rows = local.length ? local : await listLiveOfferings({ take: CANDIDATE_LIST_LIMIT });

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    photo: row.photos[0] ?? null,
    category: row.category,
    town: row.town,
    region: row.region,
    durationMin: row.durationMin,
    priceCents: row.priceCents,
    perPerson: row.priceUnit === 'PER_PERSON',
    hostName: row.host.fullName,
  }));
};
