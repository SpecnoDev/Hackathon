import { prisma } from '@/core/services';
import type { OfferingDetail } from '@/shared/dto';

export const getOfferingDetail = async (id: string): Promise<OfferingDetail | null> => {
  const offering = await prisma.offering.findUnique({
    where: { id },
    include: {
      host: { select: { fullName: true, story: true, serviceArea: true, photoUrl: true, tier: true } },
      reviews: {
        orderBy: { createdAt: 'desc' },
        include: { traveller: { select: { name: true } } },
      },
    },
  });

  if (!offering || offering.status !== 'LIVE') return null;

  return {
    id: offering.id,
    title: offering.title,
    description: offering.description,
    category: offering.category,
    priceCents: offering.priceCents,
    durationMin: offering.durationMin,
    meetingPoint: offering.meetingPoint,
    town: offering.town,
    region: offering.region,
    lat: offering.lat,
    lng: offering.lng,
    photos: offering.photos,
    avgRating: offering.avgRating,
    reviewCount: offering.reviewCount,
    vouchCount: offering.vouchCount,
    sustainabilityTag: offering.sustainabilityTag,
    host: {
      fullName: offering.host.fullName,
      story: offering.host.story,
      serviceArea: offering.host.serviceArea,
      photoUrl: offering.host.photoUrl,
      tier: offering.host.tier,
    },
    reviews: offering.reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
      travellerName: review.traveller.name,
    })),
  };
};
