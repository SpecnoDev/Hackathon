import Image from 'next/image';
import { notFound } from 'next/navigation';
import { AddToTrip } from '@/features/demand/components';
import { getOfferingDetail } from '@/features/demand/services';
import { MeetingPointMap } from '@/shared/components';
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
    <div className="mx-auto max-w-[1200px] px-4 py-6 pb-40 desktop:flex desktop:gap-8 desktop:pb-6">
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

        <div className="mt-2 text-caption text-ink">
          {offering.avgRating !== null ? (
            <span className="flex items-center gap-1">
              <span className="text-star-rating">★</span>
              <span>{offering.avgRating.toFixed(1)}</span>
              <span className="text-muted">({offering.reviewCount} reviews)</span>
            </span>
          ) : (
            <span className="text-muted">New listing</span>
          )}
        </div>

        {(badgeLabel || offering.vouchCount > 0) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {badgeLabel && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-tint px-2.5 py-1 text-badge text-primary-text">
                ✓ {badgeLabel}
              </span>
            )}
            {offering.vouchCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-tint px-2.5 py-1 text-badge text-primary-text">
                ✓ {offering.vouchCount} local{offering.vouchCount === 1 ? '' : 's'} recommend this
              </span>
            )}
          </div>
        )}

        <p className="mt-4 text-body-md text-body">{offering.description}</p>

        <div className="mt-6 rounded-lg bg-surface-soft p-6">
          <div className="flex items-center gap-3">
            {offering.host.photoUrl && (
              <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-surface-strong">
                <Image src={offering.host.photoUrl} alt={hostFirstName} fill className="object-cover" />
              </div>
            )}
            <div>
              <p className="text-title-md text-ink">
                {hostFirstName} · {offering.host.serviceArea}
              </p>
              {badgeLabel && (
                <span className="mt-1 inline-block rounded-full bg-primary-tint px-2.5 py-1 text-badge text-primary-text">
                  ✓ {badgeLabel}
                </span>
              )}
            </div>
          </div>
          {offering.host.story && <p className="mt-3 text-body-md text-ink">{offering.host.story}</p>}
        </div>

        {offering.lat !== null && offering.lng !== null && (
          <div className="mt-6">
            <h2 className="text-title-md text-ink">Where you&apos;ll meet</h2>
            <p className="mt-1 text-body-sm text-muted">{offering.meetingPoint}</p>
            <div className="mt-3 h-48 overflow-hidden rounded-md">
              <MeetingPointMap lat={offering.lat} lng={offering.lng} />
            </div>
          </div>
        )}

        {offering.reviews.length > 0 && (
          <div className="mt-6 flex flex-col gap-3">
            <h2 className="text-title-md text-ink">Reviews</h2>
            {offering.reviews.map((review) => (
              <div key={review.id} className="rounded-md border border-hairline p-4">
                <p className="text-caption text-ink">{review.travellerName}</p>
                <p className="mt-1 text-caption text-star-rating">{'★'.repeat(review.rating)}</p>
                {review.comment && <p className="mt-2 text-body-md text-body">{review.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="hidden desktop:mt-0 desktop:block desktop:w-[32%]">
        <div className="sticky top-4 rounded-lg border border-hairline p-5 shadow-lift">
          <p className="text-title-md text-ink">
            {formatRands(offering.priceCents)} <span className="text-body-sm text-muted">per person</span>
          </p>
          <AddToTrip offeringId={offering.id} offeringTitle={offering.title} trigger="sidebar" />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-16 z-10 flex h-20 items-center justify-between border-t border-hairline bg-canvas px-4 shadow-lift desktop:hidden">
        <p className="text-title-md text-ink">
          {formatRands(offering.priceCents)}
          <span className="block text-caption text-muted">per person</span>
        </p>
        <AddToTrip offeringId={offering.id} offeringTitle={offering.title} trigger="sticky-bar" />
      </div>
    </div>
  );
}
