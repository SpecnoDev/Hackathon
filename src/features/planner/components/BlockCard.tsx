'use client';

import Image from 'next/image';
import { StatusPill } from '@/shared/components';
import { formatRand } from '@/shared/utils';
import { PLANNER_COPY } from '../constants';
import type { PlannerBlock } from '../interfaces';
import { blockVerdict } from '../utils';
import { TypePill } from './TypePill';
import { VoteArrows } from './VoteArrows';

const THUMB_SIZES = '64px';

interface BlockCardProps {
  block: PlannerBlock;
  locked: boolean;
  onOpen: () => void;
  onVote: (up: boolean) => void;
}

export const BlockCard = ({ block, locked, onOpen, onVote }: BlockCardProps) => {
  const verdict = blockVerdict(block);

  return (
    <article className="flex gap-2.5 rounded-md border border-hairline bg-canvas p-2.5 tablet:gap-3 tablet:p-3">
      <VoteArrows block={block} disabled={locked} onVote={onVote} />
      <button type="button" onClick={onOpen} className="flex min-w-0 flex-1 gap-3 text-left active:opacity-80">
        <span className="relative size-14 shrink-0 overflow-hidden rounded-md bg-surface-soft tablet:size-16">
          {block.photo ? <Image src={block.photo} alt="" fill sizes={THUMB_SIZES} className="object-cover" /> : null}
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="truncate text-caption text-muted">
            {block.startTime ?? PLANNER_COPY.board.timeUnset} · {block.town}
          </span>
          <span className="truncate text-title-sm text-ink">{block.title}</span>
          <span className="flex flex-wrap items-center gap-2">
            <TypePill category={block.category} />
            {verdict === 'favourite' ? <StatusPill tone="live" density="traveller" label={PLANNER_COPY.board.favourite} /> : null}
            {verdict === 'skip' ? <StatusPill tone="paused" density="traveller" icon="x" label={PLANNER_COPY.board.skip} /> : null}
          </span>
        </span>
        <span className="shrink-0 text-body-sm text-muted">{formatRand(block.priceCents)}</span>
      </button>
    </article>
  );
};
