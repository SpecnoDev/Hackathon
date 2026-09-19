import type { AccountStatus, OfferingStatus } from '@prisma/client';

/**
 * One decision an operator can take, with the words it is taken in. `requireReason` is the
 * gate on the confirmation: no reason, no button, because the reason is the audit trail.
 */
export interface AdminDecision<TStatus extends string> {
  status: TStatus;
  label: string;
  title: string;
  description: string;
  confirmLabel: string;
  requireReason: boolean;
  destructive: boolean;
}

export const ACCOUNT_DECISIONS = {
  approve: {
    status: 'ACTIVE',
    label: 'Approve',
    title: 'Approve this account?',
    description: 'KYC is done and they can use Hosted as soon as you approve. Add a note if it helps the next operator.',
    confirmLabel: 'Approve',
    requireReason: false,
    destructive: false,
  },
  reinstate: {
    status: 'ACTIVE',
    label: 'Reinstate',
    title: 'Reinstate this account?',
    description: 'They get back in straight away. Their offerings stay paused until they publish them again.',
    confirmLabel: 'Reinstate',
    requireReason: false,
    destructive: false,
  },
  suspend: {
    status: 'SUSPENDED',
    label: 'Suspend',
    title: 'Suspend this account?',
    description: 'They lose access until you reinstate them. Say why: this is what you will read when they ask.',
    confirmLabel: 'Suspend',
    requireReason: true,
    destructive: true,
  },
  block: {
    status: 'BLOCKED',
    label: 'Block',
    title: 'Block this account?',
    description: 'They are off Hosted for good unless an admin reinstates them. Say why, in words the next operator will understand.',
    confirmLabel: 'Block',
    requireReason: true,
    destructive: true,
  },
} as const satisfies Record<string, AdminDecision<AccountStatus>>;

export type AccountDecisionKey = keyof typeof ACCOUNT_DECISIONS;

/** What an operator can do next, read off where the account already is. */
export const HOST_DECISIONS: Record<AccountStatus, readonly AccountDecisionKey[]> = {
  IN_REVIEW: ['approve', 'suspend', 'block'],
  ACTIVE: ['suspend', 'block'],
  SUSPENDED: ['reinstate', 'block'],
  BLOCKED: ['reinstate'],
};

export const TRAVELLER_DECISIONS: Record<AccountStatus, readonly AccountDecisionKey[]> = {
  IN_REVIEW: ['approve', 'suspend'],
  ACTIVE: ['suspend'],
  SUSPENDED: ['reinstate'],
  BLOCKED: ['reinstate'],
};

export const OFFERING_DECISIONS = {
  approve: {
    status: 'LIVE',
    label: 'Approve',
    title: 'Take this offering live?',
    description: 'Travellers can find it and book it as soon as you approve.',
    confirmLabel: 'Take it live',
    requireReason: false,
    destructive: false,
  },
  reject: {
    status: 'REJECTED',
    label: 'Reject',
    title: 'Reject this offering?',
    description: 'The host sees your reason, so say what they should change before they send it again.',
    confirmLabel: 'Reject',
    requireReason: true,
    destructive: true,
  },
} as const satisfies Record<string, AdminDecision<OfferingStatus>>;

export type OfferingDecisionKey = keyof typeof OFFERING_DECISIONS;

/** A rejected listing can come back: the host fixes it, an operator approves it. */
export const OFFERING_QUEUE_DECISIONS: Record<OfferingStatus, readonly OfferingDecisionKey[]> = {
  DRAFT: [],
  IN_REVIEW: ['approve', 'reject'],
  LIVE: ['reject'],
  PAUSED: [],
  REJECTED: ['approve'],
};
