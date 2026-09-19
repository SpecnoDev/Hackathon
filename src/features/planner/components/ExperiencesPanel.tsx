'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState, type DragEvent } from 'react';
import type { OfferingCategory } from '@prisma/client';
import { Banner, Button, Icon } from '@/shared/components';
import { formatRand } from '@/shared/utils';
import {
  DESKTOP_MEDIA_QUERY,
  DND_MIME,
  EXPERIENCE_TYPE_LABEL,
  PLANNER_COPY,
  REDUCED_MOTION_MEDIA_QUERY,
  SCROLL_HINT_BACK_MS,
  SCROLL_HINT_DELAY_MS,
  SCROLL_HINT_PX,
} from '../constants';
import type { CandidateOffering } from '../interfaces';
import { formatDay, formatDuration } from '../utils';
import { TypePill } from './TypePill';

/* A 240px plate on a phone, a 56px thumbnail beside the text on desktop. */
const THUMB_SIZES = '(min-width: 70.5rem) 56px, 240px';
const SEARCH_ICON_PX = 20;
const CHECK_PX = 14;
const MORE_ICON_PX = 14;
/** Anything less than a pixel of travel left counts as the end, so the hint never flickers on a rounding gap. */
const SCROLL_END_TOLERANCE_PX = 1;
const HIDE_SCROLLBAR = '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden';
/* On the deep green, DESIGN.md's highlight is sand, not the bright green; the rest of the chips are white at a tenth. */
const PILL = 'inline-flex min-h-10 shrink-0 items-center rounded-md px-4 text-button-sm transition-colors motion-reduce:transition-none';
const PILL_ON = 'bg-sand text-ink';
const PILL_OFF = 'bg-on-dark/10 text-on-dark hover:bg-on-dark/20';
const SELECT = 'h-12 w-full rounded-md border border-ink bg-canvas px-4 text-button-sm text-ink';
/* A sideways row on a phone, a column on desktop where it sits beside the timeline. */
const LIST = `-mx-4 flex min-h-0 flex-1 snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-1 ${HIDE_SCROLLBAR} desktop:mx-0 desktop:snap-none desktop:flex-col desktop:overflow-x-hidden desktop:overflow-y-auto desktop:px-0 desktop:pb-12`;
/*
 * The row stretches every card to its height, so on a phone the photo grows to fill the card and the
 * button sits at the foot; on desktop the card is a compact row with the photo as a thumbnail. White on
 * the green ground, so the cards need no hairline of their own. `shrink-0` on every breakpoint: with
 * `overflow-hidden` a flex item's minimum height is zero, and the desktop column would squash the cards
 * to fit instead of scrolling, clipping the control at their foot.
 */
const CARD = 'flex w-60 shrink-0 snap-start flex-col overflow-hidden rounded-md bg-canvas desktop:w-auto';
const CARD_BODY = 'flex min-h-0 flex-1 flex-col desktop:flex-none desktop:flex-row desktop:gap-3 desktop:p-3 desktop:pb-0';
const PLATE = 'relative min-h-28 w-full flex-1 bg-surface-soft desktop:size-14 desktop:min-h-0 desktop:w-14 desktop:flex-none desktop:shrink-0 desktop:overflow-hidden desktop:rounded-md';

interface ExperiencesPanelProps {
  candidates: CandidateOffering[];
  days: string[];
  inPlan: Set<string>;
  /** Set when the traveller tapped "Add to this day": every row then adds straight to that day. */
  targetDay: number | null;
  locked: boolean;
  /** The phone sheet's open state; the desktop column is always open. */
  open: boolean;
  onAdd: (offeringId: string, dayIndex: number) => void;
  onClearTarget: () => void;
  onClose: () => void;
}

const matches = (candidate: CandidateOffering, q: string, category: OfferingCategory | null): boolean =>
  (!category || candidate.category === category) &&
  (!q || `${candidate.title} ${candidate.town} ${candidate.hostName}`.toLowerCase().includes(q));

const meta = (candidate: CandidateOffering): string =>
  [candidate.town, candidate.durationMin && formatDuration(candidate.durationMin), formatRand(candidate.priceCents)].filter(Boolean).join(' · ');

export const ExperiencesPanel = ({ candidates, days, inPlan, targetDay, locked, open, onAdd, onClearTarget, onClose }: ExperiencesPanelProps) => {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState<OfferingCategory | null>(null);
  const [moreBelow, setMoreBelow] = useState(false);
  const list = useRef<HTMLUListElement>(null);
  const categories = useMemo(() => [...new Set(candidates.map((candidate) => candidate.category))], [candidates]);
  const shown = candidates.filter((candidate) => matches(candidate, q.trim().toLowerCase(), category));
  const copy = PLANNER_COPY.board;

  // Only the desktop column scrolls vertically; on a phone the row has no vertical travel and the hint stays away.
  const measure = () => {
    const column = list.current;
    if (column) setMoreBelow(column.scrollHeight - column.scrollTop - column.clientHeight > SCROLL_END_TOLERANCE_PX);
  };
  useEffect(measure, [shown.length, open]);

  // A phone cannot drag, so the row nudges sideways once when the sheet opens: the motion says "swipe" without a word.
  useEffect(() => {
    const row = list.current;
    if (!open || !row || window.matchMedia(DESKTOP_MEDIA_QUERY).matches || window.matchMedia(REDUCED_MOTION_MEDIA_QUERY).matches) return undefined;
    const out = window.setTimeout(() => row.scrollTo({ left: SCROLL_HINT_PX, behavior: 'smooth' }), SCROLL_HINT_DELAY_MS);
    const back = window.setTimeout(() => row.scrollTo({ left: 0, behavior: 'smooth' }), SCROLL_HINT_BACK_MS);
    return () => {
      window.clearTimeout(out);
      window.clearTimeout(back);
    };
  }, [open]);

  const startDrag = (event: DragEvent<HTMLLIElement>, offeringId: string) => {
    event.dataTransfer.setData(DND_MIME, offeringId);
    event.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <section aria-label={copy.experiences} className="relative flex h-full min-h-0 w-full min-w-0 flex-col gap-3 p-4 desktop:gap-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-title-md text-on-dark desktop:text-title-lg">{copy.experiences}</h2>
          <p className="text-caption text-on-dark/70">
            <span className="desktop:hidden">{copy.experiencesHintMobile}</span>
            <span className="hidden desktop:inline">{copy.experiencesHint}</span>
          </p>
        </div>
        <button type="button" aria-label={copy.closePanel} onClick={onClose} className="-mr-2 -mt-2 flex size-12 shrink-0 items-center justify-center rounded-md text-on-dark desktop:hidden">
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
          className="h-12 w-full rounded-md bg-canvas pl-12 pr-4 text-body-md text-ink placeholder:text-muted-soft focus:outline-none focus:ring-2 focus:ring-sand"
        />
      </label>

      <div className="flex flex-wrap gap-2">
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

      <div className="relative flex min-h-0 flex-1 flex-col">
        <ul ref={list} onScroll={measure} className={LIST}>
          {shown.map((candidate) => (
            <li key={candidate.id} draggable={!locked} onDragStart={(event) => startDrag(event, candidate.id)} className={`${CARD} ${locked ? '' : 'cursor-grab active:cursor-grabbing'}`}>
              <div className={CARD_BODY}>
                <span className={PLATE}>
                  {candidate.photo ? (
                    <Image src={candidate.photo} alt="" fill sizes={THUMB_SIZES} className="object-cover" />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-muted-soft">
                      <Icon name="image" />
                    </span>
                  )}
                </span>
                <div className="min-w-0 flex-1 p-3 desktop:p-0">
                  <p className="truncate text-title-sm text-ink">{candidate.title}</p>
                  <p className="truncate text-body-sm text-muted">{meta(candidate)}</p>
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
              {locked ? null : (
                <div className="p-3 pt-0">
                  {targetDay !== null ? (
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
                </div>
              )}
            </li>
          ))}
          {shown.length === 0 ? <li className="w-full shrink-0 rounded-md bg-on-dark/10 p-4 text-center text-body-sm text-on-dark">{copy.noMatches}</li> : null}
        </ul>
        {moreBelow ? (
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-20 items-end justify-center bg-linear-to-t from-primary-deep to-transparent pb-2 desktop:flex">
            <span className="inline-flex items-center gap-1 rounded-xs bg-sand px-2 py-1 text-badge text-ink">
              {copy.scrollForMore}
              <Icon name="chevron-down" size={MORE_ICON_PX} />
            </span>
          </div>
        ) : null}
      </div>
    </section>
  );
};
