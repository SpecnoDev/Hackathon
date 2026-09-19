'use client';

import { useState, type DragEvent } from 'react';
import { Button } from '@/shared/components';
import { DND_MIME, PLANNER_COPY } from '../constants';
import type { PlannerBlock } from '../interfaces';
import { formatDay } from '../utils';
import { BlockCard } from './BlockCard';

interface TimelineProps {
  days: string[];
  blocks: PlannerBlock[];
  locked: boolean;
  onDrop: (offeringId: string, dayIndex: number) => void;
  onAdd: (dayIndex: number) => void;
  onOpen: (block: PlannerBlock) => void;
  onVote: (block: PlannerBlock, up: boolean) => void;
}

/** The trickle-down: one spine, a numbered stop per day, blocks flowing beneath it in time order. */
export const Timeline = ({ days, blocks, locked, onDrop, onAdd, onOpen, onVote }: TimelineProps) => {
  const [overDay, setOverDay] = useState<number | null>(null);
  const copy = PLANNER_COPY.board;

  const over = (event: DragEvent<HTMLDivElement>, dayIndex: number) => {
    event.preventDefault();
    if (!locked) setOverDay(dayIndex);
  };
  // dragleave fires when moving between children too; only clear when the pointer leaves the zone itself.
  const leave = (event: DragEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOverDay(null);
  };
  const drop = (event: DragEvent<HTMLDivElement>, dayIndex: number) => {
    event.preventDefault();
    setOverDay(null);
    const offeringId = event.dataTransfer.getData(DND_MIME);
    if (offeringId && !locked) onDrop(offeringId, dayIndex);
  };

  return (
    <ol className="relative flex flex-col gap-8 pl-14">
      <span aria-hidden className="absolute bottom-5 left-5 top-5 w-px bg-hairline" />
      {days.map((day, dayIndex) => {
        const dayBlocks = blocks.filter((block) => block.day === day);
        return (
          <li key={day} className="relative">
            <span aria-hidden className="absolute -left-14 top-0 flex size-10 items-center justify-center rounded-full bg-surface-soft text-title-sm text-ink ring-4 ring-canvas">
              {dayIndex + 1}
            </span>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-title-md text-ink">{copy.day(dayIndex + 1)}</h2>
              <p className="text-caption text-muted">{formatDay(day)}</p>
            </div>
            <div
              onDragOver={(event) => over(event, dayIndex)}
              onDragLeave={leave}
              onDrop={(event) => drop(event, dayIndex)}
              className={`mt-3 flex flex-col gap-3 rounded-lg border-2 border-dashed p-2 transition-colors ${overDay === dayIndex ? 'border-primary bg-primary-tint' : 'border-transparent'}`}
            >
              {dayBlocks.map((block) => (
                <BlockCard key={block.id} block={block} locked={locked} onOpen={() => onOpen(block)} onVote={(up) => onVote(block, up)} />
              ))}
              {dayBlocks.length === 0 ? <p className="rounded-md bg-surface-soft p-4 text-center text-body-sm text-muted">{copy.emptyDay}</p> : null}
              {locked ? null : (
                <Button variant="tertiary" icon="plus" onClick={() => onAdd(dayIndex)}>
                  {copy.addToThisDay}
                </Button>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
};
