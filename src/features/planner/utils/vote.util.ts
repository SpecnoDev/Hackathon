import type { PlannerBlock } from '../interfaces';

export type BlockVerdict = 'favourite' | 'skip' | null;

/** Majority wins; a tie says nothing. */
export const blockVerdict = ({ upVotes, downVotes }: Pick<PlannerBlock, 'upVotes' | 'downVotes'>): BlockVerdict =>
  upVotes > downVotes ? 'favourite' : downVotes > upVotes ? 'skip' : null;

export const blockScore = ({ upVotes, downVotes }: Pick<PlannerBlock, 'upVotes' | 'downVotes'>): number => upVotes - downVotes;
