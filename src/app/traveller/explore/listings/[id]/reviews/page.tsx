import { notFound } from 'next/navigation';
import { ListingSummary, RatingBreakdown, ReviewCard, TravellerScreen } from '@/features/demand/components';
import { COPY_COMMON, COPY_LISTING, TRAVELLER_ROUTES } from '@/features/demand/constants';
import { getOfferingDetail } from '@/features/demand/services';

export const metadata = { title: 'Reviews' };

/** How the votes fall, then every review, newest first. */
export default async function ListingReviewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const offering = await getOfferingDetail(id);

  if (!offering || offering.reviews.length === 0) notFound();

  return (
    <TravellerScreen barTitle={COPY_LISTING.reviews} backHref={TRAVELLER_ROUTES.listing(offering.id)} width="column">
      <div className="flex flex-col gap-8">
        <ListingSummary title={offering.title} photo={offering.photos[0]} meta={`${COPY_COMMON.hostedBy(offering.host.fullName.split(' ')[0])} · ${offering.town}`} />
        <RatingBreakdown average={offering.avgRating} reviews={offering.reviews} />
        <ul className="flex flex-col gap-3">
          {offering.reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </ul>
      </div>
    </TravellerScreen>
  );
}
