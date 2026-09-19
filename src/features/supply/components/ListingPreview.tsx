'use client';

import type { ReactNode } from 'react';
import { HostStoryBlock, Icon, PhotoPlate, StatusPill, VoiceNotePlayer, type IconName } from '@/shared/components';
import { formatRand } from '@/shared/utils';
import { DRAFT_ROW_ICONS, FREE_CANCELLATION_HOURS, HOST_COPY, kindOption, languageName } from '../constants';
import { useBlobUrl } from '../hooks';
import type { Availability, Host, OfferingFields } from '../interfaces';
import { formatDay, formatDuration, priceUnitLabel } from '../utils';
import { TierBadge } from './TierBadge';

const copy = HOST_COPY.create;
const GRID_PHOTOS = 4;
const LEAD_SPANS_AT = 3;

const Photo = ({ photoKey, alt, className }: { photoKey: string; alt: string; className?: string }) => {
  const src = useBlobUrl(photoKey);
  return <PhotoPlate src={src} alt={alt} className={className} />;
};

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="flex flex-col gap-4 border-t border-hairline-soft pt-8">
    <h3 className="text-title-lg text-ink">{title}</h3>
    {children}
  </section>
);

/** Icon, bold label, plain answer: the same row a host edits, so the listing reads the way it was built. */
const Fact = ({ icon, title, children }: { icon: IconName; title: string; children: ReactNode }) => (
  <li className="flex items-start gap-4">
    <Icon name={icon} className="shrink-0 text-ink" />
    <div className="flex min-w-0 flex-col gap-1">
      <p className="text-title-sm text-ink">{title}</p>
      <p className="text-body-md text-body">{children}</p>
    </div>
  </li>
);

const availabilityLine = (availability: Availability): string => {
  if (availability.type === 'RECURRING' && availability.weekdays.length > 0) {
    return copy.preview.everyWeek(availability.weekdays.map((day) => copy.availability.weekdays[day]).join(', '));
  }
  if (availability.type === 'DATES' && availability.dates.length > 0) return availability.dates.map(formatDay).join(', ');
  return copy.preview.onRequest;
};

/**
 * The traveller's listing detail, laid out from DESIGN.md's traveller specs so a host sees exactly
 * what goes out. Read-only: the book bar at the end is a picture of the real one, not a control.
 */
export const ListingPreview = ({ fields, host }: { fields: OfferingFields; host: Host }) => {
  const voiceNote = useBlobUrl(fields.voiceNoteKey);
  const kind = kindOption(fields.kind);
  const photos = fields.photos.slice(0, GRID_PHOTOS);
  const photoAlt = copy.preview.photoAlt(fields.title);
  const group = copy.draft.group(fields.groupMin, fields.groupMax);
  const { difficulty, minAge, vehicle, seats, dietaryNotes, areasCovered } = fields.details;

  return (
    <article className="flex flex-col gap-8">
      <div className="relative">
        {photos.length > 1 ? (
          <div className="grid grid-cols-2 gap-2">
            {photos.map((photo, index) => (
              <Photo key={photo.key} photoKey={photo.key} alt={photoAlt} className={index === 0 && photos.length === LEAD_SPANS_AT ? 'col-span-2' : ''} />
            ))}
          </div>
        ) : photos[0] ? (
          <Photo photoKey={photos[0].key} alt={photoAlt} />
        ) : (
          <PhotoPlate alt={photoAlt} placeholderIcon={kind.icon} />
        )}
        {host.tier === 'REGISTERED' ? null : (
          <span className="absolute left-3 top-3">
            <TierBadge tier={host.tier} floating />
          </span>
        )}
      </div>

      <header className="flex flex-col items-center gap-3 text-center">
        <p className="text-caption text-muted">{[fields.town, copy.category.kinds[fields.kind].title].filter(Boolean).join(' · ')}</p>
        <h2 className="font-display text-display-lg text-ink">{fields.title}</h2>
        <p className="text-body-md text-muted">{[formatDuration(fields.durationMin), group].join(' · ')}</p>
        <StatusPill tone="review" icon="star" label={copy.preview.isNew} />
      </header>

      <ul className="flex flex-col gap-5 border-t border-hairline-soft pt-8">
        <li className="flex items-center gap-4">
          <span aria-hidden className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-strong font-display text-display-md text-ink">
            {host.firstName.charAt(0)}
          </span>
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-title-md text-ink">{copy.preview.hostedBy(host.firstName)}</p>
            <TierBadge tier={host.tier} />
          </div>
        </li>
        <li className="flex items-center gap-4">
          <span aria-hidden className="flex size-12 shrink-0 items-center justify-center rounded-md bg-surface-soft text-ink">
            <Icon name="map-pin" />
          </span>
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-title-md text-ink">{fields.meetingPoint}</p>
            <p className="text-body-sm text-muted">{fields.town}</p>
          </div>
        </li>
      </ul>

      <p className="text-body-md text-body">{fields.description}</p>

      {fields.steps.length > 0 ? (
        <Section title={copy.preview.whatYouDo}>
          <ol className="flex flex-col">
            {fields.steps.map((step, index) => (
              <li key={`${index}-${step}`} className="relative flex gap-4 pb-6 last:pb-0">
                {index < fields.steps.length - 1 ? <span aria-hidden className="absolute bottom-0 left-5 top-10 w-px bg-hairline" /> : null}
                <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-soft text-title-sm text-ink">
                  {index + 1}
                </span>
                <p className="pt-2 text-body-md text-body">{step}</p>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      {fields.inclusions.length > 0 ? (
        <Section title={copy.preview.included}>
          <ul className="flex flex-col gap-3">
            {fields.inclusions.map((item) => (
              <li key={item} className="flex items-start gap-3 text-body-md text-body">
                <Icon name="check" size={20} className="mt-0.5 shrink-0 text-primary-text" />
                {item}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section title={copy.preview.when}>
        <p className="flex items-start gap-4 text-body-md text-body">
          <Icon name={DRAFT_ROW_ICONS.availability} className="shrink-0 text-ink" />
          {availabilityLine(fields.availability)}
        </p>
      </Section>

      <Section title={copy.preview.meetHost}>
        <HostStoryBlock
          firstName={host.firstName}
          town={host.town || fields.town}
          story={host.story || fields.description}
          badge={<TierBadge tier={host.tier} />}
          voiceNote={
            voiceNote ? (
              <VoiceNotePlayer src={voiceNote} seconds={fields.voiceNoteSeconds ?? 0} playLabel={HOST_COPY.common.voice.play} pauseLabel={HOST_COPY.common.voice.pause} />
            ) : null
          }
        />
      </Section>

      <Section title={copy.preview.thingsToKnow}>
        <ul className="flex flex-col gap-6">
          <Fact icon={DRAFT_ROW_ICONS.groupSize} title={copy.fields.ageSuitability.label}>
            {minAge === undefined ? `${group}.` : copy.preview.groupAndAge(group, copy.editor.age.title(minAge))}
          </Fact>
          {difficulty ? (
            <Fact icon={DRAFT_ROW_ICONS.difficulty} title={copy.fields.difficulty.label}>
              {`${copy.editor.difficulty[difficulty].title}. ${copy.editor.difficulty[difficulty].description}.`}
            </Fact>
          ) : null}
          {fields.whatToBring.length > 0 ? (
            <Fact icon={DRAFT_ROW_ICONS.whatToBring} title={copy.fields.whatToBring.label}>
              {fields.whatToBring.join(', ')}
            </Fact>
          ) : null}
          {dietaryNotes ? (
            <Fact icon={DRAFT_ROW_ICONS.dietaryNotes} title={copy.fields.dietaryNotes.label}>
              {dietaryNotes}
            </Fact>
          ) : null}
          {vehicle ? (
            <Fact icon={DRAFT_ROW_ICONS.vehicle} title={copy.preview.vehicle}>
              {[vehicle, seats ? copy.draft.seats(seats) : ''].filter(Boolean).join(' · ')}
            </Fact>
          ) : null}
          {areasCovered ? (
            <Fact icon={DRAFT_ROW_ICONS.areasCovered} title={copy.preview.areas}>
              {areasCovered}
            </Fact>
          ) : null}
          <Fact icon={DRAFT_ROW_ICONS.languages} title={copy.preview.languages}>
            {fields.languages.map(languageName).join(', ')}
          </Fact>
          <Fact icon="calendar-x" title={copy.preview.cancelling}>
            {copy.preview.cancelTerms(FREE_CANCELLATION_HOURS)}
          </Fact>
        </ul>
      </Section>

      <div aria-hidden className="flex h-20 items-center justify-between rounded-lg border border-hairline bg-canvas px-4 shadow-lift">
        <p className="flex flex-col">
          <span className="text-title-md text-ink">{formatRand(fields.priceCents)}</span>
          <span className="text-caption text-muted">{priceUnitLabel(fields.priceUnit)}</span>
        </p>
        <span className="inline-flex h-12 items-center rounded-md bg-primary px-6 text-button-md text-on-primary">{copy.preview.book}</span>
      </div>
    </article>
  );
};
