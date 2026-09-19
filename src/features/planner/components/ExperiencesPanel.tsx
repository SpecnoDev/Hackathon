'use client';

import Image from 'next/image';
import { useMemo, useState, type DragEvent } from 'react';
import type { OfferingCategory } from '@prisma/client';
import { Banner, Button, Icon } from '@/shared/components';
import { formatRand } from '@/shared/utils';
import { DND_MIME, EXPERIENCE_TYPE_LABEL, PLANNER_COPY } from '../constants';
import type { CandidateOffering } from '../interfaces';
import { formatDay, formatDuration } from '../utils';
import { TypePill } from './TypePill';

const THUMB_SIZES = '56px';
const SEARCH_ICON_PX = 20;
const CHECK_PX = 14;
const PILL = 'inline-flex min-h-10 shrink-0 items-center rounded-full px-4 text-button-sm transition-colors';
const PILL_ON = 'bg-ink text-on-dark';
const PILL_OFF = 'bg-surface-soft text-ink';
const SELECT = 'h-12 w-full rounded-full border border-ink bg-canvas px-4 text-button-sm text-ink';

interface ExperiencesPanelProps {
  candidates: CandidateOffering[];
  days: string[];
  inPlan: Set<string>;
  /** Set when the traveller tapped "Add to this day": every row then adds straight to that day. */
  targetDay: number | null;
  locked: boolean;
  onAdd: (offeringId: string, dayIndex: number) => void;
  onClearTarget: () => void;
  onClose: () => void;
}

const matches = (candidate: CandidateOffering, q: string, category: OfferingCategory | null): boolean =>
  (!category || candidate.category === category) &&
  (!q || `${candidate.title} ${candidate.town} ${candidate.hostName}`.toLowerCase().includes(q));

const meta = (candidate: CandidateOffering): string =>
  [candidate.town, candidate.durationMin && formatDuration(candidate.durationMin), formatRand(candidate.priceCents)].filter(Boolean).join(' · ');

export const ExperiencesPanel = ({ candidates, days, inPlan, targetDay, locked, onAdd, onClearTarget, onClose }: ExperiencesPanelProps) => {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState<OfferingCategory | null>(null);
  const categories = useMemo(() => [...new Set(candidates.map((candidate) => candidate.category))], [candidates]);
  const shown = candidates.filter((candidate) => matches(candidate, q.trim().toLowerCase(), category));
  const copy = PLANNER_COPY.board;

  const startDrag = (event: DragEvent<HTMLLIElement>, offeringId: string) => {
    event.dataTransfer.setData(DND_MIME, offeringId);
    event.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <section aria-label={copy.experiences} className="flex h-full min-h-0 w-full min-w-0 flex-col gap-4 p-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-title-lg text-ink">{copy.experiences}</h2>
          <p className="text-caption text-muted">{copy.experiencesHint}</p>
        </div>
        <button type="button" aria-label={copy.closePanel} onClick={onClose} className="flex size-12 shrink-0 items-center justify-center rounded-full text-ink desktop:hidden">
          <Icon name="x" />
        </button>
      </header>

      {targetDay !== null ? (
        <Banner tone="info" icon="calendar-plus">
          <span className="flex items-center justify-between gap-3">
            {copy.addingTo(targetDay + 1)}
            <Button variant="tertiary" onClick={onClearTarget}>
              {copy.cancel}
            </Button>
          </span>
        </Banner>
      ) : null}

      <label className="relative block">
        <span className="sr-only">{copy.search}</span>
        <Icon name="search" size={SEARCH_ICON_PX} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder={copy.search}
          className="h-12 w-full rounded-full border border-hairline bg-canvas pl-12 pr-4 text-body-md text-ink placeholder:text-muted-soft focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
        />
      </label>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <button type="button" aria-pressed={category === null} onClick={() => setCategory(null)} className={`${PILL} ${category === null ? PILL_ON : PILL_OFF}`}>
          {copy.allTypes}
        </button>
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={category === item}
            onClick={() => setCategory(category === item ? null : item)}
            className={`${PILL} ${category === item ? PILL_ON : PILL_OFF}`}
          >
            {EXPERIENCE_TYPE_LABEL[item]}
          </button>
        ))}
      </div>

      <ul className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
        {shown.map((candidate) => (
          <li
            key={candidate.id}
            draggable={!locked}
            onDragStart={(event) => startDrag(event, candidate.id)}
            className={`flex flex-col gap-3 rounded-md border border-hairline bg-canvas p-3 ${locked ? '' : 'cursor-grab active:cursor-grabbing'}`}
          >
            <div className="flex gap-3">
              <span className="relative size-14 shrink-0 overflow-hidden rounded-md bg-surface-soft">
                {candidate.photo ? <Image src={candidate.photo} alt="" fill sizes={THUMB_SIZES} className="object-cover" /> : null}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-title-sm text-ink">{candidate.title}</p>
                <p className="text-body-sm text-muted">{meta(candidate)}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <TypePill category={candidate.category} />
                  {inPlan.has(candidate.id) ? (
                    <span className="inline-flex items-center gap-1 text-badge text-primary-text">
                      <Icon name="check" size={CHECK_PX} />
                      {copy.inPlan}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            {locked ? null : targetDay !== null ? (
              <Button size="md" icon="plus" onClick={() => onAdd(candidate.id, targetDay)}>
                {copy.add}
              </Button>
            ) : (
              <select
                aria-label={copy.addToDay}
                value=""
                onChange={(event) => {
                  if (event.target.value) onAdd(candidate.id, Number(event.target.value));
                }}
                className={SELECT}
              >
                <option value="">{copy.addToDay}</option>
                {days.map((day, index) => (
                  <option key={day} value={index}>
                    {copy.day(index + 1)}, {formatDay(day)}
                  </option>
                ))}
              </select>
            )}
          </li>
        ))}
        {shown.length === 0 ? <li className="rounded-md bg-surface-soft p-4 text-center text-body-sm text-muted">{copy.noMatches}</li> : null}
      </ul>
    </section>
  );
};
