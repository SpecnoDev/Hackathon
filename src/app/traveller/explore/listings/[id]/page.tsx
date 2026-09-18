import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Language } from '@prisma/client';
import { FREE_CANCELLATION_WINDOW_HOURS, LANGUAGE_LABELS } from '@/core/constants';
import { AddToTrip, ListingLead, ReviewCard, TravellerScreen } from '@/features/demand/components';
import { CATEGORY_ICON, CATEGORY_LABEL, COPY_COMMON, COPY_LISTING, REVIEWS_SHOWN_ON_LISTING, TRAVELLER_ROUTES } from '@/features/demand/constants';
import { getOfferingDetail } from '@/features/demand/services';
import { formatDuration } from '@/features/demand/utils';
import { Button, DetailFact, HostStoryBlock, Icon, MeetingPointMap, RatingRow, VerifiedBadge } from '@/shared/components';
import type { OfferingDetail } from '@/shared/dto';
import { formatRand } from '@/shared/utils';

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="flex flex-col gap-4 border-t border-hairline-soft pt-8">
    <h2 className="text-title-lg text-ink">{title}</h2>
    {children}
  </section>
);

const bookLabel = (offering: OfferingDetail): string => (offering.bookingMode === 'INSTANT' ? COPY_LISTING.book : COPY_LISTING.request);

const Price = ({ offering }: { offering: OfferingDetail }) => (
  <p className="flex flex-col">
    <span className="text-title-md text-ink">{formatRand(offering.priceCents)}</span>
    <span className="text-caption text-muted">{COPY_COMMON.priceUnit[offering.priceUnit]}</span>
  </p>
);

const badgeFor = (tier: OfferingDetail['host']['tier']): string | undefined => (tier === 'REGISTERED' ? undefined : COPY_COMMON.badge[tier]);

type Weekday = keyof typeof COPY_COMMON.weekdays;
const isWeekday = (value: unknown): value is Weekday => typeof value === 'string' && value in COPY_COMMON.weekdays;

/** The seed writes `{ weekdays, times }`; an empty list means any day, or a time the host confirms. Anything else reads as on request. */
const availabilityLines = (availability: OfferingDetail['availability']): string[] => {
  const weekdays = Array.isArray(availability.weekdays) ? availability.weekdays.filter(isWeekday) : [];
  const times = Array.isArray(availability.times) ? availability.times.filter((time): time is string => typeof time === 'string') : [];
  return [
    weekdays.length === 0 ? COPY_LISTING.everyDay : COPY_LISTING.onDays(weekdays.map((day) => COPY_COMMON.weekdays[day]).join(', ')),
    times.length === 0 ? COPY_COMMON.anyTime : COPY_LISTING.atTimes(times.join(', ')),
  ];
};

/**
 * DESIGN.md listing-detail, with the host story moved up: a traveller is choosing someone to trust before
 * they are choosing something to do. The map shows only when the host pinned a spot; otherwise the placeholder tile.
 */
export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const offering = await getOfferingDetail(id);

  if (!offering) notFound();

  const hostFirstName = offering.host.fullName.split(' ')[0];
  const badge = badgeFor(offering.host.tier);
  const ratingLabel = offering.avgRating === null ? undefined : COPY_COMMON.ratingLabel(offering.avgRating.toFixed(1), offering.reviewCount);

  return (
    <TravellerScreen lead={offering.photos.length > 0 ? <ListingLead offeringId={offering.id} title={offering.title} photos={offering.photos} /> : undefined}>
      <div className="pb-24 desktop:grid desktop:grid-cols-[minmax(0,1fr)_22rem] desktop:gap-16 desktop:pb-0">
        <article className="flex flex-col gap-8">
          <header className="flex flex-col gap-3">
            <p className="flex items-center gap-2 text-caption text-muted">
              <Icon name={CATEGORY_ICON[offering.category]} size={16} />
              {[CATEGORY_LABEL[offering.category], formatDuration(offering.durationMin), offering.town].filter(Boolean).join(' · ')}
            </p>
            <h1 className="font-display text-display-lg text-ink">{offering.title}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <RatingRow rating={offering.avgRating} count={offering.reviewCount} newLabel={COPY_COMMON.isNew} label={ratingLabel} />
              {badge ? <VerifiedBadge label={badge} density="traveller" /> : null}
              {offering.vouchCount > 0 ? <span className="text-caption text-muted">{COPY_LISTING.vouched(offering.vouchCount)}</span> : null}
            </div>
          </header>

          <HostStoryBlock
            firstName={hostFirstName}
            town={offering.host.serviceArea}
            portrait={offering.host.photoUrl ?? undefined}
            story={offering.host.story ?? ''}
            badge={badge ? <VerifiedBadge label={badge} density="traveller" /> : <p className="text-caption text-muted">{COPY_COMMON.tierName[offering.host.tier]}</p>}
            action={
              <Link href={TRAVELLER_ROUTES.host(offering.host.id)} className="flex min-h-12 items-center text-link text-primary-text underline">
                {COPY_LISTING.seeProfile(hostFirstName)}
              </Link>
            }
          />

          <Section title={COPY_LISTING.about}>
            <p className="text-body-md text-body">{offering.description}</p>
          </Section>

          {offering.steps.length > 0 ? (
            <Section title={COPY_LISTING.whatYouDo}>
              <ol className="flex flex-col">
                {offering.steps.map((step, index) => (
                  <li key={step} className="relative flex gap-4 pb-6 last:pb-0">
                    {index < offering.steps.length - 1 ? <span aria-hidden className="absolute bottom-0 left-5 top-10 w-px bg-hairline" /> : null}
                    <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-soft text-title-sm text-ink">
                      {index + 1}
                    </span>
                    <p className="pt-2 text-body-md text-body">{step}</p>
                  </li>
                ))}
              </ol>
            </Section>
          ) : null}

          {offering.inclusions.length > 0 ? (
            <Section title={COPY_LISTING.included}>
              <ul className="flex flex-col gap-3">
                {offering.inclusions.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-body-md text-body">
                    <Icon name="check" size={20} className="mt-0.5 shrink-0 text-primary-text" />
                    {item}
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          <Section title={COPY_LISTING.meet}>
            <div className="flex items-center gap-4">
              <span aria-hidden className="flex size-12 shrink-0 items-center justify-center rounded-md bg-surface-soft text-ink">
                <Icon name="map-pin" />
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <p className="text-title-sm text-ink">{offering.meetingPoint}</p>
                <p className="text-body-sm text-muted">{offering.town}</p>
              </div>
            </div>
            {offering.lat !== null && offering.lng !== null ? (
              <div className="aspect-video overflow-hidden rounded-lg">
                <MeetingPointMap lat={offering.lat} lng={offering.lng} />
              </div>
            ) : (
              <div role="img" aria-label={COPY_LISTING.mapPlaceholder} className="flex aspect-video flex-col items-center justify-center gap-3 rounded-lg bg-surface-soft p-6 text-center">
                <Icon name="map" size={40} className="text-muted-soft" />
                <p className="max-w-xs text-body-sm text-muted">{COPY_LISTING.mapPlaceholder}</p>
              </div>
            )}
          </Section>

          <Section title={COPY_LISTING.thingsToKnow}>
            <ul className="flex flex-col gap-6">
              {offering.languages.length > 0 ? (
                <DetailFact icon="globe" title={COPY_LISTING.languages}>
                  {offering.languages.map((code) => LANGUAGE_LABELS[code as Language] ?? code).join(', ')}
                </DetailFact>
              ) : null}
              <DetailFact icon="users" title={COPY_LISTING.groupSize}>
                {COPY_COMMON.group(offering.groupMin, offering.groupMax)}
              </DetailFact>
              {offering.whatToBring.length > 0 ? (
                <DetailFact icon="backpack" title={COPY_LISTING.whatToBring}>
                  {offering.whatToBring.join(', ')}
                </DetailFact>
              ) : null}
              <DetailFact icon="calendar" title={COPY_LISTING.availability}>
                {availabilityLines(offering.availability).map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </DetailFact>
              <DetailFact icon="calendar-x" title={COPY_LISTING.cancelling}>
                {COPY_LISTING.cancelTerms(FREE_CANCELLATION_WINDOW_HOURS)}
              </DetailFact>
              {offering.safetyNotes.length > 0 ? (
                <DetailFact icon="shield-check" title={COPY_LISTING.safety}>
                  <ul className="flex list-disc flex-col gap-1 pl-5">
                    {offering.safetyNotes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </DetailFact>
              ) : null}
            </ul>
          </Section>

          <Section title={offering.reviewCount > 0 ? `${COPY_LISTING.reviews} · ${COPY_COMMON.reviewCount(offering.reviewCount)}` : COPY_LISTING.reviews}>
            {offering.reviews.length === 0 ? (
              <div className="flex flex-col gap-1 rounded-lg bg-surface-soft p-5">
                <p className="text-title-sm text-ink">{COPY_LISTING.noReviewsTitle}</p>
                <p className="text-body-md text-muted">{COPY_LISTING.noReviews}</p>
              </div>
            ) : (
              <>
                <ul className="flex flex-col gap-3">
                  {offering.reviews.slice(0, REVIEWS_SHOWN_ON_LISTING).map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </ul>
                {offering.reviews.length > REVIEWS_SHOWN_ON_LISTING ? (
                  <Button size="md" variant="secondary" href={TRAVELLER_ROUTES.listingReviews(offering.id)}>
                    {COPY_LISTING.showAll(offering.reviews.length)}
                  </Button>
                ) : null}
              </>
            )}
          </Section>

          <AddToTrip offeringId={offering.id} offeringTitle={offering.title} />
        </article>

        <aside className="hidden desktop:block">
          <div className="sticky top-8 flex flex-col gap-4 rounded-lg border border-hairline p-6 shadow-lift">
            <Price offering={offering} />
            <Button size="md" href={TRAVELLER_ROUTES.book.date(offering.id)}>
              {bookLabel(offering)}
            </Button>
            {offering.bookingMode === 'ON_REQUEST' ? <p className="text-caption text-muted">{COPY_LISTING.requestNote}</p> : null}
          </div>
        </aside>
      </div>

      {/* DESIGN.md sticky-book-bar. Fixed rather than in the shell's footer so it can step aside for the booking card on a desktop. */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-hairline bg-canvas shadow-lift desktop:hidden">
        <div className="mx-auto flex min-h-20 max-w-page items-center justify-between gap-4 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] tablet:px-6">
          <Price offering={offering} />
          <span className="shrink-0 whitespace-nowrap">
            <Button size="md" fullWidth={false} href={TRAVELLER_ROUTES.book.date(offering.id)}>
              {bookLabel(offering)}
            </Button>
          </span>
        </div>
      </div>
    </TravellerScreen>
  );
}
