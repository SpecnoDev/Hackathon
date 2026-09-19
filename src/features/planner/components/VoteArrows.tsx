'use client';

import { Icon } from '@/shared/components';
import { PLANNER_COPY } from '../constants';
import type { PlannerBlock } from '../interfaces';
import { blockScore } from '../utils';

const ARROW_PX = 18;
const ARROW = 'flex size-9 items-center justify-center rounded-full transition-colors disabled:opacity-50';
const REST = 'bg-surface-soft text-ink active:bg-surface-strong';

interface VoteArrowsProps {
  block: PlannerBlock;
  disabled: boolean;
  onVote: (up: boolean) => void;
}

/** Reddit's pair: up takes the product green, down takes ink, the score sits between. `aria-pressed` carries the state without colour. */
export const VoteArrows = ({ block, disabled, onVote }: VoteArrowsProps) => (
  <div className="flex flex-col items-center gap-0.5">
    <button
      type="button"
      aria-label={PLANNER_COPY.board.voteUp}
      aria-pressed={block.myVote === true}
      disabled={disabled}
      onClick={() => onVote(true)}
      className={`${ARROW} ${block.myVote === true ? 'bg-primary text-on-primary' : REST}`}
    >
      <Icon name="arrow-up" size={ARROW_PX} />
    </button>
    <span title={PLANNER_COPY.board.votes(block.upVotes, block.downVotes)} className="min-w-6 text-center text-title-sm tabular-nums text-ink">
      {blockScore(block)}
    </span>
    <button
      type="button"
      aria-label={PLANNER_COPY.board.voteDown}
      aria-pressed={block.myVote === false}
      disabled={disabled}
      onClick={() => onVote(false)}
      className={`${ARROW} ${block.myVote === false ? 'bg-ink text-on-dark' : REST}`}
    >
      <Icon name="arrow-down" size={ARROW_PX} />
    </button>
  </div>
);
