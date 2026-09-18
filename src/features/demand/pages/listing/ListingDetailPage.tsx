'use client';

import { useCallback, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { FREE_CANCELLATION_WINDOW_HOURS } from '@/core/constants';
import { Button, EmptyState, Icon, PhotoCarousel, RatingRow, VerifiedBadge, useToast, type IconName } from '@/shared/components';
import { formatRand } from '@/shared/utils';
import { DetailFact, HostStory, PlanPickerSheet, ReviewCard, ShareSheet, TravellerScreen } from '../../components';
import { COPY_COMMON, COPY_EXPLORE, REVIEWS_SHOWN_ON_LISTING, TRAVELLER_ROUTES, categoryIcon, languageName, type TravellerSheet } from '../../constants';
import { useTravellerApp } from '../../hooks';
import type { Listing, Review, TravellerAppState } from '../../interfaces';
import { badgeFor, findListing, hostOf, ratingOf, reviewsFor, selectIsSaved, travellerAppStore } from '../../services/client';
import { formatDuration } from '../../utils';

const copy = COPY_EXPLORE.listing;

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="flex flex-col gap-4 border-t border-hairline-soft pt-8">
    <h2 className="text-title-lg text-ink">{title}</h2>
    {children}
  </section>
);

const OverlayButton = ({ icon, label, pressed, href, onClick }: { icon: IconName; label: string; pressed?: boolean; href?: string; onClick?: () => void }) => {
  const className = 'flex size-12 items-center justify-center rounded-full bg-canvas text-ink shadow-lift';
  const glyph = <Icon name={icon} className={pressed ? 'fill-current' : ''} />;
  return href ? (
    <Link href={href} aria-label={label} className={className}>
      {glyph}
    </Link>
  ) : (
    <button type="button" aria-label={label} aria-pressed={pressed} onClick={onClick} className={className}>
      {glyph}
    </button>
  );
};

const availabilityLines = (listing: Listing): string[] => [
  listing.availability.weekdays.length === 0 ? copy.everyDay : copy.onDays(listing.availability.weekdays.map((day) => COPY_COMMON.weekdays[day]).join(', ')),
  listing.availability.times.length === 0 ? COPY_COMMON.anyTime : copy.atTimes(listing.availability.times.join(', ')),
];

/**
 * Screen 5. DESIGN.md listing-detail order, with the host story moved up: the brief wants the person on the first
 * screenful, because a traveller is choosing someone to trust before they are choosing something to do.
 */
export const ListingDetailPage = ({ listingId, initialSheet }: { listingId: string; initialSheet?: TravellerSheet }) => {
  const toast = useToast();
  const listing = findListing(listingId);
  const saved = useTravellerApp(useCallback((state: TravellerAppState) => selectIsSaved(state, listingId), [listingId]));
  const reviews = useTravellerApp(useCallback((state: TravellerAppState): Review[] => reviewsFor(state, listingId), [listingId]));
  const [sheet, setSheet] = useState<TravellerSheet | undefined>(initialSheet);

  if (!listing) {
    return (
      <TravellerScreen barTitle={copy.barTitle} backHref={TRAVELLER_ROUTES.home}>
        <EmptyState
          illustration="missing"
          title={COPY_COMMON.notFoundTitle}
          message={copy.notFound}
          action={
            <Button size="md" variant="secondary" href={TRAVELLER_ROUTES.home}>
              {copy.backToExplore}
            </Button>
          }
        />
      </TravellerScreen>
    );
  }

  const host = hostOf(listing);
  const badge = badgeFor(host);
  const rating = ratingOf(listing);
  const onRequest = listing.bookingMode === 'ON_REQUEST';
  const bookLabel = onRequest ? copy.request : copy.book;
  const price = (
    <p className="flex flex-col">
      <span className="text-title-md text-ink">{formatRand(listing.priceCents)}</span>
      <span className="text-caption text-muted">{COPY_COMMON.priceUnit[listing.priceUnit]}</span>
    </p>
  );

  return (
    <TravellerScreen
      lead={
        <div className="mx-auto w-full max-w-page tablet:px-6 tablet:pt-6">
          <div className="overflow-hidden tablet:rounded-lg">
            <PhotoCarousel
              photos={listing.photos}
              alt={(position) => copy.photoOf(listing.title, position)}
              countLabel={copy.photoCount}
              overlay={
                <>
                  <OverlayButton icon="chevron-left" label={COPY_COMMON.back} href={TRAVELLER_ROUTES.home} />
                  <span className="flex gap-2">
                    <OverlayButton icon="share" label={copy.share} onClick={() => setSheet('share')} />
                    <OverlayButton
                      icon="heart"
                      label={saved ? COPY_COMMON.saved.remove(listing.title) : COPY_COMMON.saved.add(listing.title)}
                      pressed={saved}
                      onClick={() => toast(travellerAppStore.toggleSaved(listing.id) ? COPY_COMMON.saved.added : COPY_COMMON.saved.removed)}
                    />
                  </span>
                </>
              }
            />
          </div>
        </div>
      }
    >
      <div className="pb-24 desktop:grid desktop:grid-cols-[minmax(0,1fr)_22rem] desktop:gap-16 desktop:pb-0">
        <article className="flex flex-col gap-8">
          <header className="flex flex-col gap-3">
            <p className="flex items-center gap-2 text-caption text-muted">
              <Icon name={categoryIcon(listing.category)} size={16} />
              {[COPY_COMMON.categoryName[listing.category], formatDuration(listing.durationMin), listing.town].join(' · ')}
            </p>
            <h1 className="font-display text-display-lg text-ink">{listing.title}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <RatingRow
                rating={rating.average}
                count={rating.count}
                newLabel={COPY_COMMON.isNew}
                label={rating.average === null ? undefined : COPY_COMMON.ratingLabel(rating.average.toFixed(1), rating.count)}
              />
              {badge ? <VerifiedBadge label={badge} density="traveller" /> : null}
            </div>
          </header>

          <HostStory host={host} />

          <Section title={copy.about}>
            <p className="text-body-md text-body">{listing.description}</p>
          </Section>

          <Section title={copy.whatYouDo}>
            <ol className="flex flex-col">
              {listing.steps.map((step, index) => (
                <li key={step} className="relative flex gap-4 pb-6 last:pb-0">
                  {index < listing.steps.length - 1 ? <span aria-hidden className="absolute bottom-0 left-5 top-10 w-px bg-hairline" /> : null}
                  <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-soft text-title-sm text-ink">
                    {index + 1}
                  </span>
                  <p className="pt-2 text-body-md text-body">{step}</p>
                </li>
              ))}
            </ol>
          </Section>

          <Section title={copy.included}>
            <ul className="flex flex-col gap-3">
              {listing.inclusions.map((item) => (
                <li key={item} className="flex items-start gap-3 text-body-md text-body">
                  <Icon name="check" size={20} className="mt-0.5 shrink-0 text-primary-text" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section title={copy.meet}>
            <div className="flex items-center gap-4">
              <span aria-hidden className="flex size-12 shrink-0 items-center justify-center rounded-md bg-surface-soft text-ink">
                <Icon name="map-pin" />
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <p className="text-title-sm text-ink">{listing.meetingPoint}</p>
                <p className="text-body-sm text-muted">{listing.town}</p>
              </div>
            </div>
            <div role="img" aria-label={copy.mapPlaceholder} className="flex aspect-video flex-col items-center justify-center gap-3 rounded-lg bg-surface-soft p-6 text-center">
              <Icon name="map" size={40} className="text-muted-soft" />
              <p className="max-w-xs text-body-sm text-muted">{copy.mapPlaceholder}</p>
            </div>
          </Section>

          <Section title={copy.thingsToKnow}>
            <ul className="flex flex-col gap-6">
              <DetailFact icon="globe" title={copy.languages}>
                {listing.languages.map(languageName).join(', ')}
              </DetailFact>
              <DetailFact icon="users" title={copy.groupSize}>
                {COPY_COMMON.group(listing.groupMin, listing.groupMax)}
              </DetailFact>
              {listing.whatToBring.length > 0 ? (
                <DetailFact icon="backpack" title={copy.whatToBring}>
                  {listing.whatToBring.join(', ')}
                </DetailFact>
              ) : null}
              <DetailFact icon="calendar" title={copy.availability}>
                {availabilityLines(listing).map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </DetailFact>
              <DetailFact icon="calendar-x" title={copy.cancelling}>
                {copy.cancelTerms(FREE_CANCELLATION_WINDOW_HOURS)}
              </DetailFact>
              <DetailFact icon="shield-check" title={copy.safety}>
                <ul className="flex list-disc flex-col gap-1 pl-5">
                  {listing.safetyNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </DetailFact>
            </ul>
          </Section>

          <Section title={rating.count > 0 ? `${copy.reviews} · ${COPY_COMMON.reviewCount(rating.count)}` : copy.reviews}>
            {reviews.length === 0 ? (
              <div className="flex flex-col gap-1 rounded-lg bg-surface-soft p-5">
                <p className="text-title-sm text-ink">{copy.noReviewsTitle}</p>
                <p className="text-body-md text-muted">{copy.noReviews}</p>
              </div>
            ) : (
              <>
                <ul className="flex flex-col gap-3">
                  {reviews.slice(0, REVIEWS_SHOWN_ON_LISTING).map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </ul>
                <Button size="md" variant="secondary" href={TRAVELLER_ROUTES.listingReviews(listing.id)}>
                  {copy.showAll(rating.count)}
                </Button>
              </>
            )}
          </Section>

          <Button size="md" variant="secondary" icon="route" onClick={() => setSheet('plan')}>
            {copy.addToPlan}
          </Button>
        </article>

        <aside className="hidden desktop:block">
          <div className="sticky top-8 flex flex-col gap-4 rounded-lg border border-hairline p-6 shadow-lift">
            {price}
            <Button size="md" href={TRAVELLER_ROUTES.book.date(listing.id)}>
              {bookLabel}
            </Button>
            {onRequest ? <p className="text-caption text-muted">{copy.requestNote}</p> : null}
          </div>
        </aside>
      </div>

      {/* DESIGN.md sticky-book-bar. Fixed rather than in the shell's footer so it can step aside for the booking card on a desktop. */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-hairline bg-canvas shadow-lift desktop:hidden">
        <div className="mx-auto flex min-h-20 max-w-page items-center justify-between gap-4 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] tablet:px-6">
          {price}
          <span className="shrink-0 whitespace-nowrap">
            <Button size="md" fullWidth={false} href={TRAVELLER_ROUTES.book.date(listing.id)}>
              {bookLabel}
            </Button>
          </span>
        </div>
      </div>

      {sheet === 'share' ? <ShareSheet path={TRAVELLER_ROUTES.listing(listing.id)} message={listing.title} onClose={() => setSheet(undefined)} /> : null}
      {sheet === 'plan' ? <PlanPickerSheet listingId={listing.id} onClose={() => setSheet(undefined)} /> : null}
    </TravellerScreen>
  );
};
