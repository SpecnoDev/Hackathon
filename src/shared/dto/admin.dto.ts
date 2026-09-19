import { z } from 'zod';
import type { AccountStatus, OfferingStatus, VerificationTier } from '@prisma/client';
import {
  ADMIN_ACTIONS,
  ADMIN_ACTION_LOG_DEFAULT_LIMIT,
  ADMIN_ACTION_LOG_MAX_LIMIT,
  ADMIN_ACTION_QUERY_PARAM,
  ADMIN_REASON_MAX_LENGTH,
  RESTRICTED_ACCOUNT_STATUSES,
} from '@/core/constants';
import { Exhaustive } from './offering.dto';

export const ACCOUNT_STATUSES = ['IN_REVIEW', 'ACTIVE', 'SUSPENDED', 'BLOCKED'] as const;
export const VERIFICATION_TIERS = ['REGISTERED', 'IDENTITY', 'COMMUNITY'] as const;
export const OFFERING_STATUSES = ['DRAFT', 'IN_REVIEW', 'LIVE', 'PAUSED', 'REJECTED'] as const;

/** Restated for the back-office forms, checked against Prisma at compile time — see OFFERING_CATEGORIES. */
export const ACCOUNT_STATUSES_MATCH_SCHEMA: Exhaustive<AccountStatus, (typeof ACCOUNT_STATUSES)[number]> = true;
export const VERIFICATION_TIERS_MATCH_SCHEMA: Exhaustive<VerificationTier, (typeof VERIFICATION_TIERS)[number]> = true;
export const OFFERING_STATUSES_MATCH_SCHEMA: Exhaustive<OfferingStatus, (typeof OFFERING_STATUSES)[number]> = true;

const reasonSchema = z.string().trim().min(1).max(ADMIN_REASON_MAX_LENGTH).nullable().default(null);

/** Taking an account off the platform is answerable: the operator says why, and the action row keeps the answer. */
export const accountStatusPatchSchema = z
  .object({ status: z.enum(ACCOUNT_STATUSES), reason: reasonSchema })
  .refine(({ status, reason }) => !RESTRICTED_ACCOUNT_STATUSES.includes(status) || Boolean(reason), {
    message: 'Say why this account is being suspended or blocked',
    path: ['reason'],
  });

export const verificationTierPatchSchema = z.object({
  tier: z.enum(VERIFICATION_TIERS),
  reason: reasonSchema,
});

export const adminOfferingStatusPatchSchema = z.object({
  status: z.enum(OFFERING_STATUSES),
  reason: reasonSchema,
});

export const adminActionQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(ADMIN_ACTION_LOG_MAX_LIMIT).default(ADMIN_ACTION_LOG_DEFAULT_LIMIT),
  [ADMIN_ACTION_QUERY_PARAM]: z.enum(ADMIN_ACTIONS).optional(),
});

export type AccountStatusPatchDto = z.infer<typeof accountStatusPatchSchema>;
export type VerificationTierPatchDto = z.infer<typeof verificationTierPatchSchema>;
export type AdminOfferingStatusPatchDto = z.infer<typeof adminOfferingStatusPatchSchema>;
export type AdminActionQueryDto = z.infer<typeof adminActionQuerySchema>;
