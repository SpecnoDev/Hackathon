import { HOST_RESPONSE_HOURS, MS_PER_SECOND, MINUTES_PER_HOUR, SECONDS_PER_MINUTE } from '@/core/constants';
import { prisma } from '@/core/services';
import type { CreateTripBlockInput, CreateTripInput, TripDetail, TripSummary, VoteBlockInput } from '@/shared/dto';
import { priceBooking } from './booking-pricing.service';

const MS_PER_HOUR = MS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR;

/** The itinerary as a traveller reads it: every block with its offering, the vote tally, and this traveller's own vote. */
export const getTripDetail = async (travellerId: string, tripId: string): Promise<TripDetail | null> => {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      members: { select: { travellerId: true } },
      blocks: {
        orderBy: { position: 'asc' },
        include: {
          offering: { select: { title: true, photos: true, priceCents: true, priceUnit: true } },
          votes: { select: { travellerId: true, up: true } },
          booking: { select: { id: true } },
        },
      },
    },
  });
  if (!trip || !trip.members.some((member) => member.travellerId === travellerId)) return null;

  return {
    id: trip.id,
    name: trip.name,
    startDate: trip.startDate.toISOString().slice(0, 10),
    endDate: trip.endDate.toISOString().slice(0, 10),
    shareCode: trip.shareCode,
    locked: trip.locked,
    isOrganiser: trip.organiserId === travellerId,
    memberCount: trip.members.length,
    blocks: trip.blocks.map((block) => ({
      id: block.id,
      offeringId: block.offeringId,
      offeringTitle: block.offering.title,
      offeringPhoto: block.offering.photos[0] ?? null,
      priceCents: block.offering.priceCents,
      priceUnit: block.offering.priceUnit,
      day: block.day.toISOString().slice(0, 10),
      upVotes: block.votes.filter((vote) => vote.up).length,
      downVotes: block.votes.filter((vote) => !vote.up).length,
      myVote: block.votes.find((vote) => vote.travellerId === travellerId)?.up ?? null,
      bookingId: block.booking?.id ?? null,
    })),
  };
};

export const listOpenTrips = async (travellerId: string): Promise<TripSummary[]> => {
  const trips = await prisma.trip.findMany({
    where: { locked: false, members: { some: { travellerId } } },
    orderBy: { startDate: 'asc' },
  });

  return trips.map((trip) => ({
    id: trip.id,
    name: trip.name,
    startDate: trip.startDate.toISOString().slice(0, 10),
    endDate: trip.endDate.toISOString().slice(0, 10),
  }));
};

export const createTrip = async (travellerId: string, input: CreateTripInput): Promise<TripSummary> => {
  const trip = await prisma.trip.upsert({
    where: { id: input.id },
    update: {},
    create: {
      id: input.id,
      organiserId: travellerId,
      name: input.name,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
      shareCode: input.id.slice(0, 8),
      members: { create: { travellerId } },
    },
  });

  return {
    id: trip.id,
    name: trip.name,
    startDate: trip.startDate.toISOString().slice(0, 10),
    endDate: trip.endDate.toISOString().slice(0, 10),
  };
};

export const addTripBlock = async (
  travellerId: string,
  tripId: string,
  input: CreateTripBlockInput,
): Promise<{ id: string } | null> => {
  const membership = await prisma.tripMember.findUnique({
    where: { tripId_travellerId: { tripId, travellerId } },
  });
  if (!membership) return null;

  const lastBlock = await prisma.tripBlock.findFirst({
    where: { tripId },
    orderBy: { position: 'desc' },
  });

  const block = await prisma.tripBlock.upsert({
    where: { id: input.id },
    update: {},
    create: {
      id: input.id,
      tripId,
      offeringId: input.offeringId,
      day: new Date(input.day),
      position: (lastBlock?.position ?? -1) + 1,
      addedById: travellerId,
    },
  });

  return { id: block.id };
};

export const removeTripBlock = async (travellerId: string, blockId: string): Promise<boolean> => {
  const block = await prisma.tripBlock.findUnique({
    where: { id: blockId },
    include: { trip: { select: { locked: true, members: { where: { travellerId }, select: { travellerId: true } } } } },
  });
  if (!block || block.trip.locked || block.trip.members.length === 0) return false;

  await prisma.tripBlock.delete({ where: { id: blockId } });
  return true;
};

export const voteOnBlock = async (
  travellerId: string,
  blockId: string,
  input: VoteBlockInput,
): Promise<boolean> => {
  const block = await prisma.tripBlock.findUnique({
    where: { id: blockId },
    include: { trip: { select: { members: { where: { travellerId }, select: { travellerId: true } } } } },
  });
  if (!block || block.trip.members.length === 0) return false;

  await prisma.vote.upsert({
    where: { blockId_travellerId: { blockId, travellerId } },
    update: { up: input.up },
    create: { blockId, travellerId, up: input.up },
  });
  return true;
};

export const joinTrip = async (travellerId: string, shareCode: string): Promise<TripSummary | null> => {
  const trip = await prisma.trip.findUnique({ where: { shareCode } });
  if (!trip || trip.locked) return null;

  await prisma.tripMember.upsert({
    where: { tripId_travellerId: { tripId: trip.id, travellerId } },
    update: {},
    create: { tripId: trip.id, travellerId },
  });

  return {
    id: trip.id,
    name: trip.name,
    startDate: trip.startDate.toISOString().slice(0, 10),
    endDate: trip.endDate.toISOString().slice(0, 10),
  };
};

/** Locking freezes the itinerary — no more blocks, votes or membership changes once checkout can begin. */
export const lockTrip = async (travellerId: string, tripId: string): Promise<boolean> => {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip || trip.organiserId !== travellerId) return false;

  await prisma.trip.update({ where: { id: tripId }, data: { locked: true } });
  return true;
};

/** One booking per locked block, priced once here so the pre-checkout preview and the stored booking agree. */
export const checkoutTrip = async (
  travellerId: string,
  tripId: string,
): Promise<{ bookingIds: string[] } | null> => {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      members: { where: { travellerId }, select: { travellerId: true } },
      blocks: { where: { booking: null }, include: { offering: true } },
    },
  });
  if (!trip || !trip.locked || trip.members.length === 0) return null;

  const respondBy = new Date(Date.now() + HOST_RESPONSE_HOURS * MS_PER_HOUR);
  // TODO: no per-block group-size input exists yet (schema/DTO don't carry it) — defaulting
  // to 1 until the trip-block flow captures how many travellers are on each booked block.
  const groupSize = 1;

  const bookings = await prisma.$transaction(
    trip.blocks.map((block) => {
      const price = priceBooking(block.offering, groupSize);
      return prisma.booking.create({
        data: {
          offeringId: block.offeringId,
          hostId: block.offering.hostId,
          travellerId,
          blockId: block.id,
          date: block.day,
          groupSize,
          totalCents: price.totalCents,
          feeCents: price.feeCents,
          hostReceivesCents: price.hostReceivesCents,
          respondBy,
        },
        select: { id: true },
      });
    }),
  );

  return { bookingIds: bookings.map((booking) => booking.id) };
};
