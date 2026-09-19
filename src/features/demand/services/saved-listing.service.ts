import { prisma } from '@/core/services';

export const listSavedOfferingIds = async (travellerId: string): Promise<string[]> => {
  const saved = await prisma.savedListing.findMany({
    where: { travellerId },
    select: { offeringId: true },
  });
  return saved.map((row) => row.offeringId);
};

/** Idempotent toggle — returns the resulting saved state, not just an action result. */
export const toggleSavedListing = async (travellerId: string, offeringId: string): Promise<boolean> => {
  const existing = await prisma.savedListing.findUnique({
    where: { travellerId_offeringId: { travellerId, offeringId } },
  });

  if (existing) {
    await prisma.savedListing.delete({ where: { travellerId_offeringId: { travellerId, offeringId } } });
    return false;
  }

  await prisma.savedListing.create({ data: { travellerId, offeringId } });
  return true;
};
