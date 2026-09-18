import Link from 'next/link';
import { Icon } from '@/shared/components';
import { formatRand, hostReceivesCents } from '@/shared/utils';
import { DRAFT_ROW_ICONS, HOST_COPY, HOST_ROUTES, PHOTOS_TO_GO_LIVE, STEPS_SHOWN_ON_ROW, draftFieldOrder, languageName } from '../constants';
import type { DraftRowId, OfferingFieldId, OfferingFields } from '../interfaces';
import { formatDuration, priceUnitLabel } from '../utils';
import { isFieldComplete } from './FieldEditor';

const copy = HOST_COPY.create;

/** What a row says for its field: one string, or one line per step. Empty means the host still has to add it. */
const fieldValue = (field: OfferingFieldId, fields: OfferingFields): string | string[] => {
  switch (field) {
    case 'title':
      return fields.title;
    case 'description':
      return fields.description;
    case 'steps':
      return fields.steps;
    case 'duration':
      return fields.durationMin > 0 ? formatDuration(fields.durationMin) : '';
    case 'groupSize':
      return copy.draft.group(fields.groupMin, fields.groupMax);
    case 'price':
      return fields.priceCents > 0 ? `${formatRand(fields.priceCents)} ${priceUnitLabel(fields.priceUnit)}` : '';
    case 'inclusions':
      return fields.inclusions.join(', ');
    case 'whatToBring':
      return fields.whatToBring.join(', ');
    case 'meetingPoint':
      return [fields.meetingPoint, fields.town].filter(Boolean).join(', ');
    case 'languages':
      return fields.languages.map(languageName).join(', ');
    case 'difficulty':
      return fields.details.difficulty ? copy.editor.difficulty[fields.details.difficulty].title : '';
    case 'ageSuitability':
      return fields.details.minAge === undefined ? '' : copy.editor.age.title(fields.details.minAge);
    case 'vehicle':
      return [fields.details.vehicle, fields.details.seats ? copy.draft.seats(fields.details.seats) : ''].filter(Boolean).join(' · ');
    case 'dietaryNotes':
    case 'areasCovered':
      return fields.details[field] ?? '';
  }
};

interface RowProps {
  row: DraftRowId;
  href: string;
  label: string;
  value: string | string[];
  missing: boolean;
  note?: string;
  /** DESIGN.md marks money with a small orange dot, never with orange text. */
  moneyNote?: boolean;
}

/** Icon, bold label, then the answer underneath: the icon column lets a host find a row without reading every word. */
const Row = ({ row, href, label, value, missing, note, moneyNote = false }: RowProps) => {
  const lines = typeof value === 'string' ? undefined : value;
  const isEmpty = value.length === 0;
  const hidden = lines ? lines.length - STEPS_SHOWN_ON_ROW : 0;

  return (
    <li>
      <Link href={href} className="flex min-h-18 items-start gap-4 border-b border-hairline-soft py-5 active:bg-surface-soft">
        <Icon name={DRAFT_ROW_ICONS[row]} className="shrink-0 text-ink" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-title-md text-ink">{label}</p>
          {isEmpty ? (
            <p className={`flex items-center gap-2 text-title-md ${missing ? 'text-error' : 'text-primary-text'}`}>
              <Icon name={missing ? 'alert' : 'plus'} size={20} />
              {copy.draft.add}
            </p>
          ) : lines ? (
            <>
              <ol className="flex flex-col gap-1">
                {lines.slice(0, STEPS_SHOWN_ON_ROW).map((line, index) => (
                  <li key={`${index}-${line}`} className="flex gap-2 text-body-host text-body">
                    <span aria-hidden className="w-5 shrink-0 text-muted">
                      {index + 1}.
                    </span>
                    <span className="line-clamp-2">{line}</span>
                  </li>
                ))}
              </ol>
              {hidden > 0 ? <p className="pl-7 text-caption text-muted">{copy.draft.moreSteps(hidden)}</p> : null}
            </>
          ) : (
            <p className="line-clamp-3 text-body-host text-body">{value}</p>
          )}
          {note ? (
            <p className="flex items-start gap-2 text-caption text-ink">
              {moneyNote ? <span aria-hidden className="mt-1 size-2.5 shrink-0 rounded-full bg-accent" /> : null}
              {note}
            </p>
          ) : null}
        </div>
        <Icon name="chevron-right" className="shrink-0 text-muted" />
      </Link>
    </li>
  );
};

interface OfferingDraftStackProps {
  fields: OfferingFields;
  rowHref: (row: DraftRowId) => string;
  /** Show the photos and availability rows (edit mode). */
  withMedia?: boolean;
  /** Mark required rows that are still empty, after the host has tried to continue. */
  showMissing?: boolean;
}

export const OfferingDraftStack = ({ fields, rowHref, withMedia = false, showMissing = false }: OfferingDraftStackProps) => (
  <div className="flex flex-col gap-2">
    <ul className="flex flex-col border-t border-hairline-soft">
      {draftFieldOrder(fields.kind).map((field) => (
        <Row
          key={field}
          row={field}
          href={rowHref(field)}
          label={copy.fields[field].label}
          value={fieldValue(field, fields)}
          missing={showMissing && !isFieldComplete(field, fields)}
          moneyNote={field === 'price'}
          note={
            field === 'price' && fields.priceCents > 0
              ? copy.draft.receive(formatRand(hostReceivesCents(fields.priceCents)), priceUnitLabel(fields.priceUnit))
              : undefined
          }
        />
      ))}
      {withMedia ? (
        <>
          <Row
            row="photos"
            href={rowHref('photos')}
            label={copy.photos.label}
            value={fields.photos.length > 0 ? copy.photos.count(fields.photos.length) : ''}
            missing={false}
            note={copy.photos.helper(PHOTOS_TO_GO_LIVE)}
          />
          <Row
            row="availability"
            href={rowHref('availability')}
            label={copy.availability.label}
            value={copy.availability.options[fields.availability.type].title}
            missing={false}
          />
        </>
      ) : null}
    </ul>
    <Link href={HOST_ROUTES.earnings.fees} className="flex min-h-12 items-center text-link text-primary-text underline">
      {copy.draft.feeLink}
    </Link>
  </div>
);
