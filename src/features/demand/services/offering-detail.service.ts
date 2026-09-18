import { prisma } from '@/core/services';

export const getOfferingDetail = async (id: string) => {
  const offering = await prisma.offering.findUnique({
    where: { id },
    include: {
      host: { select: { fullName: true, story: true, serviceArea: true, tier: true } },
      reviews: { orderBy: { createdAt: 'desc' }, include: { traveller: { select: { name: true } } } },
    },
  });

  if (!offering || offering.status !== 'LIVE') return null;
  return offering;
};

export type OfferingDetail = NonNullable<Awaited<ReturnType<typeof getOfferingDetail>>>;
