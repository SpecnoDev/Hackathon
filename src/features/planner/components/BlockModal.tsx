'use client';

import Image from 'next/image';
import { useEffect, useId, useState, type ReactNode } from 'react';
import { Button, Icon, StatusPill, type IconName } from '@/shared/components';
import { formatRand } from '@/shared/utils';
import { EXPERIENCE_TYPE_LABEL, PLANNER_COPY } from '../constants';
import type { PlannerBlock } from '../interfaces';
import { blockVerdict, formatDay, formatDuration } from '../utils';
import { TypePill } from './TypePill';

const PHOTO_SIZES = '(min-width: 744px) 480px, 100vw';
const FACT_ICON_PX = 20;
/** A time input reports partial values while typing; only a full HH:MM is worth a round trip. */
const TIME_LENGTH = 5;

interface BlockModalProps {
  block: PlannerBlock;
  dayIndex: number;
  locked: boolean;
  onClose: () => void;
  onSetTime: (startTime: string) => void;
  onRemove: () => void;
}

const Fact = ({ icon, label, children }: { icon: IconName; label: string; children: ReactNode }) => (
  <div className="flex gap-3">
    <Icon name={icon} size={FACT_ICON_PX} className="mt-0.5 shrink-0 text-ink" />
    <div className="min-w-0 flex-1">
      <p className="text-caption text-muted">{label}</p>
      <div className="text-body-md text-ink">{children}</div>
    </div>
  </div>
);

export const BlockModal = ({ block, dayIndex, locked, onClose, onSetTime, onRemove }: BlockModalProps) => {
  const titleId = useId();
  const [confirming, setConfirming] = useState(false);
  const copy = PLANNER_COPY.modal;
  const verdict = blockVerdict(block);

  useEffect(() => {
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center desktop:items-center desktop:p-6">
      <button type="button" aria-label={copy.close} onClick={onClose} className="absolute inset-0 bg-scrim/50" />
      <div
        role="dialog"
        aria-modal
        aria-labelledby={titleId}
        className="relative flex max-h-dvh w-full max-w-host flex-col gap-5 overflow-y-auto rounded-t-xl bg-canvas p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-lift desktop:rounded-lg"
      >
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-md bg-surface-soft">
          {block.photo ? <Image src={block.photo} alt={block.title} fill sizes={PHOTO_SIZES} className="object-cover" /> : null}
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-caption text-muted">
            {copy.day(dayIndex + 1)} · {formatDay(block.day)}
          </p>
          <h2 id={titleId} className="text-title-lg text-ink">
            {block.title}
          </h2>
          <p className="text-body-sm text-muted">{copy.hostedBy(block.hostName)}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <TypePill category={block.category} />
            {verdict === 'favourite' ? <StatusPill tone="live" density="traveller" label={PLANNER_COPY.board.favourite} /> : null}
            {verdict === 'skip' ? <StatusPill tone="paused" density="traveller" icon="x" label={PLANNER_COPY.board.skip} /> : null}
            <span className="text-caption text-muted">{PLANNER_COPY.board.votes(block.upVotes, block.downVotes)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Fact icon="clock" label={copy.time}>
            <input
              key={block.startTime ?? ''}
              type="time"
              defaultValue={block.startTime ?? ''}
              disabled={locked}
              onChange={(event) => {
                if (event.target.value.length === TIME_LENGTH) onSetTime(event.target.value);
              }}
              className="h-12 w-full rounded-md border border-hairline bg-canvas px-3 text-body-md text-ink focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink disabled:text-muted-soft"
            />
          </Fact>
          <Fact icon="map-pin" label={copy.where}>
            {block.meetingPoint}, {block.town}
          </Fact>
          <Fact icon="tag" label={copy.type}>
            {EXPERIENCE_TYPE_LABEL[block.category]}
          </Fact>
          <Fact icon="route" label={copy.duration}>
            {block.durationMin ? formatDuration(block.durationMin) : copy.askHost}
          </Fact>
          <Fact icon="users" label={copy.group}>
            {block.groupMax ? copy.upTo(block.groupMax) : copy.anySize}
          </Fact>
          <Fact icon="banknote" label={copy.price}>
            {formatRand(block.priceCents)} {block.perPerson ? copy.perPerson : copy.forGroup}
          </Fact>
        </div>

        {block.hostStory ? <p className="rounded-lg bg-surface-soft p-4 text-body-md text-body">{block.hostStory}</p> : null}

        <div className="flex flex-col gap-3">
          {locked ? null : confirming ? (
            <>
              <p className="text-body-md text-ink">{copy.removeConfirm(block.title)}</p>
              <Button variant="destructive" size="md" onClick={onRemove}>
                {copy.removeYes}
              </Button>
              <Button variant="secondary" size="md" onClick={() => setConfirming(false)}>
                {copy.keep}
              </Button>
            </>
          ) : (
            <Button variant="destructive" size="md" onClick={() => setConfirming(true)}>
              {copy.remove}
            </Button>
          )}
          {confirming ? null : (
            <Button variant="secondary" size="md" onClick={onClose}>
              {copy.close}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
