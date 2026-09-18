import { prisma } from '@/core/services';
import type { CreateTripBlockInput, CreateTripInput, TripSummary } from '@/shared/dto';

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
