'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CENTS_PER_RAND } from '@/core/constants';
import { Banner, Button, Chip, Icon, OptionTile, Stepper, TextInput } from '@/shared/components';
import { formatRand, hostReceivesCents, randToCents } from '@/shared/utils';
import {
  DIFFICULTIES,
  DRAFT_ROW_ICONS,
  DURATION_OPTIONS_MIN,
  GROUP_SIZE_MAX,
  GROUP_SIZE_MIN,
  HOST_COPY,
  HOST_ROUTES,
  LANGUAGES,
  LISTING_SAMPLES,
  MIN_AGE_OPTIONS,
  PRICE_GUIDE_CENTS,
  PRICE_UNITS,
  SEATS_MAX,
  SEATS_MIN,
} from '../constants';
import type { OfferingFieldId, OfferingFields } from '../interfaces';
import { formatDuration, priceUnitLabel } from '../utils';
import { ChoiceList } from './ChoiceList';
import { SpeakField } from './SpeakField';

const NON_DIGITS = /\D/g;
const LOCATION_TIMEOUT_MS = 10_000;
const DEFAULT_SEATS = 4;
const copy = HOST_COPY.create;

interface FieldEditorProps {
  field: OfferingFieldId;
  fields: OfferingFields;
  onChange: (patch: Partial<OfferingFields>) => void;
  error?: string;
}

/** True when the field holds enough for a listing. Used before leaving a field, never while typing. */
export const isFieldComplete = (field: OfferingFieldId, fields: OfferingFields): boolean => {
  switch (field) {
    case 'title':
      return fields.title.trim().length > 0;
    case 'description':
      return fields.description.trim().length > 0;
    case 'duration':
      return fields.durationMin > 0;
    case 'price':
      return fields.priceCents > 0;
    case 'meetingPoint':
      return fields.meetingPoint.trim().length > 0 && fields.town.trim().length > 0;
    case 'languages':
      return fields.languages.length > 0;
    default:
      return true;
  }
};

const DurationEditor = ({ fields, onChange }: Pick<FieldEditorProps, 'fields' | 'onChange'>) => {
  const isPreset = DURATION_OPTIONS_MIN.includes(fields.durationMin);
  const [custom, setCustom] = useState(fields.durationMin > 0 && !isPreset);
  return (
    <div className="flex flex-col gap-4">
      <ChoiceList label={copy.fields.duration.question}>
        {DURATION_OPTIONS_MIN.map((minutes) => (
          <OptionTile
            key={minutes}
            icon="clock"
            title={formatDuration(minutes)}
            selected={!custom && fields.durationMin === minutes}
            onSelect={() => {
              setCustom(false);
              onChange({ durationMin: minutes });
            }}
          />
        ))}
        <OptionTile icon="pencil" title={copy.editor.somethingElse} selected={custom} onSelect={() => setCustom(true)} />
      </ChoiceList>
      {custom ? (
        <TextInput
          label={copy.editor.minutesLabel}
          value={fields.durationMin > 0 ? String(fields.durationMin) : ''}
          onChange={(value) => onChange({ durationMin: Number(value.replace(NON_DIGITS, '')) })}
          inputMode="numeric"
        />
      ) : null}
    </div>
  );
};

const PriceEditor = ({ fields, onChange, error }: Pick<FieldEditorProps, 'fields' | 'onChange' | 'error'>) => {
  const guide = PRICE_GUIDE_CENTS[fields.kind];
  return (
    <div className="flex flex-col gap-6">
      <TextInput
        label={copy.editor.priceLabel}
        value={fields.priceCents > 0 ? String(fields.priceCents / CENTS_PER_RAND) : ''}
        onChange={(value) => onChange({ priceCents: randToCents(Number(value.replace(NON_DIGITS, ''))) })}
        helper={copy.editor.guide(formatRand(guide.min), formatRand(guide.max), priceUnitLabel(guide.unit))}
        error={error}
        prefix="R"
        inputMode="numeric"
      />
      <ChoiceList label={copy.fields.price.question}>
        {PRICE_UNITS.map((unit) => (
          <OptionTile
            key={unit}
            icon={unit === 'PER_PERSON' ? 'user' : 'users'}
            title={copy.editor.unit[unit]}
            selected={fields.priceUnit === unit}
            onSelect={() => onChange({ priceUnit: unit })}
          />
        ))}
      </ChoiceList>
      {fields.priceCents > 0 ? (
        <div className="flex flex-col gap-1 rounded-lg bg-accent-tint p-5">
          <p className="text-title-md text-ink">{copy.draft.receive(formatRand(hostReceivesCents(fields.priceCents)), priceUnitLabel(fields.priceUnit))}</p>
          <Link href={HOST_ROUTES.earnings.fees} className="flex min-h-12 items-center text-link text-primary-text underline">
            {copy.draft.feeLink}
          </Link>
        </div>
      ) : null}
    </div>
  );
};

interface ChipListEditorProps {
  question: string;
  items: string[];
  suggestions: readonly string[];
  addLabel: string;
  heardAs: string;
  onItems: (items: string[]) => void;
}

/** A list where order does not matter: common answers are one tap, anything else is spoken or typed. */
const ChipListEditor = ({ question, items, suggestions, addLabel, heardAs, onItems }: ChipListEditorProps) => {
  const [extra, setExtra] = useState('');
  const custom = items.filter((item) => !suggestions.includes(item));
  const toggle = (item: string): void => onItems(items.includes(item) ? items.filter((existing) => existing !== item) : [...items, item]);

  const add = (): void => {
    const item = extra.trim();
    if (item && !items.includes(item)) onItems([...items, item]);
    setExtra('');
  };

  return (
    <div className="flex flex-col gap-6">
      <div role="group" aria-label={question} className="flex flex-wrap gap-2">
        {[...suggestions, ...custom].map((item) => (
          <Chip key={item} label={item} selected={items.includes(item)} onToggle={() => toggle(item)} />
        ))}
      </div>
      <SpeakField label={addLabel} value={extra} onChange={setExtra} heardAs={heardAs} />
      <Button variant="secondary" icon="plus" onClick={add} disabled={!extra.trim()}>
        {copy.editor.addItem}
      </Button>
    </div>
  );
};

/** The visit in order. Steps are added one at a time so each one can be spoken. */
const StepsEditor = ({ fields, onChange }: Pick<FieldEditorProps, 'fields' | 'onChange'>) => {
  const [next, setNext] = useState('');
  const sample = LISTING_SAMPLES[fields.kind].fields.steps;

  const add = (): void => {
    const step = next.trim();
    if (step) onChange({ steps: [...fields.steps, step] });
    setNext('');
  };

  return (
    <div className="flex flex-col gap-6">
      {fields.steps.length > 0 ? (
        <ol className="flex flex-col border-t border-hairline-soft">
          {fields.steps.map((step, index) => (
            <li key={`${index}-${step}`} className="flex min-h-16 items-center gap-4 border-b border-hairline-soft py-2">
              <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full border border-ink text-title-sm text-ink">
                {index + 1}
              </span>
              <span className="min-w-0 flex-1 text-body-host text-ink">{step}</span>
              <button
                type="button"
                aria-label={copy.editor.remove(step)}
                onClick={() => onChange({ steps: fields.steps.filter((_, position) => position !== index) })}
                className="flex size-12 shrink-0 items-center justify-center rounded-full text-muted active:bg-surface-soft"
              >
                <Icon name="x" />
              </button>
            </li>
          ))}
        </ol>
      ) : null}
      <SpeakField
        label={fields.steps.length === 0 ? copy.editor.firstStepLabel : copy.editor.addStepLabel}
        value={next}
        onChange={setNext}
        heardAs={sample[fields.steps.length] ?? sample[0] ?? ''}
      />
      <Button variant="secondary" icon="plus" onClick={add} disabled={!next.trim()}>
        {copy.editor.addStep}
      </Button>
    </div>
  );
};

const MeetingPointEditor = ({ fields, onChange, error }: Pick<FieldEditorProps, 'fields' | 'onChange' | 'error'>) => {
  const [location, setLocation] = useState<'saved' | 'failed'>();

  const shareLocation = (): void => {
    if (!('geolocation' in navigator)) {
      setLocation('failed');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        onChange({ lat: coords.latitude, lng: coords.longitude });
        setLocation('saved');
      },
      () => setLocation('failed'),
      { timeout: LOCATION_TIMEOUT_MS },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <TextInput label={copy.editor.town} value={fields.town} onChange={(town) => onChange({ town })} helper={copy.editor.townExample} />
      <SpeakField
        label={copy.editor.place}
        value={fields.meetingPoint}
        onChange={(meetingPoint) => onChange({ meetingPoint })}
        example={copy.fields.meetingPoint.example}
        error={error}
        heardAs={LISTING_SAMPLES[fields.kind].fields.meetingPoint}
      />
      {/* DESIGN.md: no map tiles on the host side. A town name and a "share location" action instead. */}
      <Button variant="secondary" icon="locate" onClick={shareLocation}>
        {copy.editor.shareLocation}
      </Button>
      {location === 'saved' || (fields.lat !== undefined && location === undefined) ? <Banner tone="success">{copy.editor.locationSaved}</Banner> : null}
      {location === 'failed' ? <Banner tone="error">{copy.editor.locationFailed}</Banner> : null}
    </div>
  );
};

export const FieldEditor = ({ field, fields, onChange, error }: FieldEditorProps) => {
  const sample = LISTING_SAMPLES[fields.kind].fields;
  const fieldCopy = copy.fields[field];

  switch (field) {
    case 'title':
      return <SpeakField label={fieldCopy.label} value={fields.title} onChange={(title) => onChange({ title })} example={fieldCopy.example} error={error} heardAs={sample.title} />;
    case 'description':
      return (
        <SpeakField
          multiline
          label={fieldCopy.label}
          value={fields.description}
          onChange={(description) => onChange({ description })}
          example={fieldCopy.example}
          error={error}
          heardAs={sample.description}
        />
      );
    case 'duration':
      return (
        <div className="flex flex-col gap-4">
          <DurationEditor fields={fields} onChange={onChange} />
          {error ? <Banner tone="error">{error}</Banner> : null}
        </div>
      );
    case 'groupSize':
      return (
        <div className="flex flex-col gap-3">
          <Stepper
            label={copy.editor.fewest}
            value={fields.groupMin}
            min={GROUP_SIZE_MIN}
            max={fields.groupMax}
            decreaseLabel={copy.editor.fewer}
            increaseLabel={copy.editor.more}
            onChange={(groupMin) => onChange({ groupMin })}
          />
          <Stepper
            label={copy.editor.most}
            value={fields.groupMax}
            min={fields.groupMin}
            max={GROUP_SIZE_MAX}
            decreaseLabel={copy.editor.fewer}
            increaseLabel={copy.editor.more}
            onChange={(groupMax) => onChange({ groupMax })}
          />
        </div>
      );
    case 'price':
      return <PriceEditor fields={fields} onChange={onChange} error={error} />;
    case 'steps':
      return <StepsEditor fields={fields} onChange={onChange} />;
    case 'inclusions':
      return (
        <ChipListEditor
          question={fieldCopy.question}
          items={fields.inclusions}
          suggestions={copy.suggestions[fields.kind]}
          addLabel={copy.editor.addItemLabel}
          heardAs={sample.inclusions[0] ?? ''}
          onItems={(inclusions) => onChange({ inclusions })}
        />
      );
    case 'whatToBring':
      return (
        <ChipListEditor
          question={fieldCopy.question}
          items={fields.whatToBring}
          suggestions={copy.bringSuggestions[fields.kind]}
          addLabel={copy.editor.addBringLabel}
          heardAs={sample.whatToBring[0] ?? ''}
          onItems={(whatToBring) => onChange({ whatToBring })}
        />
      );
    case 'difficulty':
      return (
        <ChoiceList label={fieldCopy.question}>
          {DIFFICULTIES.map((difficulty) => (
            <OptionTile
              key={difficulty}
              icon={DRAFT_ROW_ICONS.difficulty}
              title={copy.editor.difficulty[difficulty].title}
              description={copy.editor.difficulty[difficulty].description}
              selected={fields.details.difficulty === difficulty}
              onSelect={() => onChange({ details: { ...fields.details, difficulty } })}
            />
          ))}
        </ChoiceList>
      );
    case 'ageSuitability':
      return (
        <ChoiceList label={fieldCopy.question}>
          {MIN_AGE_OPTIONS.map((minAge) => (
            <OptionTile
              key={minAge}
              icon={DRAFT_ROW_ICONS.ageSuitability}
              title={copy.editor.age.title(minAge)}
              description={copy.editor.age.description(minAge)}
              selected={fields.details.minAge === minAge}
              onSelect={() => onChange({ details: { ...fields.details, minAge } })}
            />
          ))}
        </ChoiceList>
      );
    case 'meetingPoint':
      return <MeetingPointEditor fields={fields} onChange={onChange} error={error} />;
    case 'languages':
      return (
        <div className="flex flex-col gap-4">
          <ChoiceList multiple label={fieldCopy.question}>
            {LANGUAGES.map((language) => {
              const selected = fields.languages.includes(language.code);
              return (
                <OptionTile
                  key={language.code}
                  role="checkbox"
                  title={language.name}
                  lang={language.htmlLang}
                  selected={selected}
                  onSelect={() => onChange({ languages: selected ? fields.languages.filter((code) => code !== language.code) : [...fields.languages, language.code] })}
                />
              );
            })}
          </ChoiceList>
          {error ? <Banner tone="error">{error}</Banner> : null}
        </div>
      );
    case 'vehicle':
      return (
        <div className="flex flex-col gap-6">
          <SpeakField
            label={copy.editor.vehicleLabel}
            value={fields.details.vehicle ?? ''}
            onChange={(vehicle) => onChange({ details: { ...fields.details, vehicle } })}
            example={fieldCopy.example}
            heardAs={sample.details.vehicle ?? ''}
          />
          <Stepper
            label={copy.editor.seatsLabel}
            value={fields.details.seats ?? DEFAULT_SEATS}
            min={SEATS_MIN}
            max={SEATS_MAX}
            decreaseLabel={copy.editor.fewer}
            increaseLabel={copy.editor.more}
            onChange={(seats) => onChange({ details: { ...fields.details, seats } })}
          />
        </div>
      );
    case 'dietaryNotes':
    case 'areasCovered':
      return (
        <SpeakField
          multiline
          label={fieldCopy.label}
          value={fields.details[field] ?? ''}
          onChange={(text) => onChange({ details: { ...fields.details, [field]: text } })}
          example={fieldCopy.example}
          heardAs={LISTING_SAMPLES[field === 'dietaryNotes' ? 'food' : 'guide'].fields.details[field] ?? ''}
        />
      );
  }
};
