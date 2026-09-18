import { StatusPill, VerifiedBadge } from '@/shared/components';
import { HOST_COPY } from '../constants';
import type { VerificationTier } from '../interfaces';

/** DESIGN.md has a badge for verified hosts only, so an unverified host gets the neutral draft pill instead. */
export const TierBadge = ({ tier, floating = false }: { tier: VerificationTier; floating?: boolean }) =>
  tier === 'REGISTERED' ? (
    <StatusPill tone="draft" label={HOST_COPY.verify.badge.REGISTERED} />
  ) : (
    <VerifiedBadge label={HOST_COPY.verify.badge[tier]} floating={floating} />
  );
