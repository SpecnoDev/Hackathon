import type { OfferingCategory } from '@prisma/client';

export interface PlannerMember {
  id: string;
  name: string;
}

export interface PlannerBlock {
  id: string;
  offeringId: string;
  title: string;
  photo: string | null;
  category: OfferingCategory;
  town: string;
  meetingPoint: string;
  durationMin: number | null;
  priceCents: number;
  perPerson: boolean;
  groupMax: number | null;
  hostName: string;
  hostStory: string | null;
  /** ISO date, YYYY-MM-DD */
  day: string;
  startTime: string | null;
  position: number;
  upVotes: number;
  downVotes: number;
  myVote: boolean | null;
}

export interface PlannerTrip {
  id: string;
  name: string;
  destination: string | null;
  departureFrom: string | null;
  theme: string | null;
  travellerCount: number | null;
  startDate: string;
  endDate: string;
  /** Every day of the trip as ISO dates, so the timeline and the drop targets agree. */
  days: string[];
  shareCode: string;
  locked: boolean;
  isOrganiser: boolean;
  members: PlannerMember[];
  blocks: PlannerBlock[];
}

export interface CandidateOffering {
  id: string;
  title: string;
  photo: string | null;
  category: OfferingCategory;
  town: string;
  region: string;
  durationMin: number | null;
  priceCents: number;
  perPerson: boolean;
  hostName: string;
}

export interface PlannerTripSummary {
  id: string;
  name: string;
  destination: string | null;
  theme: string | null;
  startDate: string;
  endDate: string;
  memberCount: number;
  blockCount: number;
}

export interface AiPlanResult {
  added: number;
  rationale: string;
}

export interface PlannerActionState {
  error?: string;
  note?: string;
}
