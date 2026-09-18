import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getOfferingDetail } from '@/features/demand/services';
import { formatRands } from '@/shared/utils';

const TIER_LABEL: Partial<Record<string, string>> = {
  IDENTITY: 'Verified',
  COMMUNITY: 'Community verified',
};

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const offering = await getOfferingDetail(id);

  if (!offering) notFound();

  const hostFirstName = offering.host.fullName.split(' ')[0];
  const badgeLabel = TIER_LABEL[offering.host.tier];

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 desktop:flex desktop:gap-8">
      <div className="desktop:w-[64%]">
        <div className="relative aspect-4/3 overflow-hidden rounded-md bg-surface-soft desktop:aspect-video">
          {offering.photos[0] && (
            <Image
              src={offering.photos[0]}
              alt={offering.title}
              fill
              className="object-cover"
              sizes="(min-width: 1128px) 64vw, 100vw"
              priority
            />
          )}
        </div>

        <h1 className="mt-4 text-display-md text-ink">{offering.title}</h1>
        <p className="mt-1 text-body-sm text-muted">
          {offering.town} · {offering.meetingPoint}
        </p>

        <div className="mt-2 flex items-center gap-1 text-caption text-ink">
          {offering.avgRating !== null ? (
            <>
              <span className="text-star-rating">★</span>
              <span>{offering.avgRating.toFixed(1)}</span>
              <span className="text-muted">({offering.reviewCount} reviews)</span>
            </>
          ) : (
            <span className="text-muted">New listing</span>
          )}
          {offering.vouchCount > 0 && (
            <span className="text-muted">
              · {offering.vouchCount} local{offering.vouchCount === 1 ? '' : 's'} recommend this
            </span>
          )}
        </div>

        <p className="mt-4 text-body-md text-body">{offering.description}</p>

        <div className="mt-6 rounded-lg bg-surface-soft p-6">
          <p className="text-title-md text-ink">
            {hostFirstName} · {offering.host.serviceArea}
          </p>
          {badgeLabel && (
            <span className="mt-2 inline-block rounded-full bg-primary-tint px-2.5 py-1 text-badge text-primary-text">
              ✓ {badgeLabel}
            </span>
          )}
          {offering.host.story && <p className="mt-3 text-body-md text-ink">{offering.host.story}</p>}
        </div>

        {offering.reviews.length > 0 && (
          <div className="mt-6 flex flex-col gap-3">
            <h2 className="text-title-md text-ink">Reviews</h2>
            {offering.reviews.map((review) => (
              <div key={review.id} className="rounded-md border border-hairline p-4">
                <p className="text-caption text-ink">{review.traveller.name}</p>
                <p className="mt-1 text-caption text-star-rating">{'★'.repeat(review.rating)}</p>
                {review.comment && <p className="mt-2 text-body-md text-body">{review.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 desktop:mt-0 desktop:w-[32%]">
        <div className="sticky top-4 rounded-lg border border-hairline p-5 shadow-lift">
          <p className="text-title-md text-ink">
            {formatRands(offering.priceCents)} <span className="text-body-sm text-muted">per person</span>
          </p>
          <button className="mt-4 h-12 w-full rounded-full bg-primary text-button-md text-on-primary">
            Book
          </button>
        </div>
      </div>
    </div>
  );
}
