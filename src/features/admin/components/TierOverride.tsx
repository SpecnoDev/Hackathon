'use client';

import { useActionState } from 'react';
import type { VerificationTier } from '@prisma/client';
import { ADMIN_REASON_MAX_LENGTH } from '@/core/constants';
import { Banner, Button } from '@/shared/components';
import { VERIFICATION_TIERS } from '@/shared/dto';
import { ADMIN_COPY, ADMIN_FORM_FIELDS, VERIFICATION_TIER_LABEL } from '../constants';
import type { AdminFormAction } from '../interfaces';

const FIELD = 'h-12 rounded-md border border-hairline bg-canvas px-4 text-body-md text-ink focus:border-ink focus:outline-none';

interface TierOverrideProps {
  tier: VerificationTier;
  action: AdminFormAction;
}

/** The manual override on what KYC decided. It changes nothing else: a tier never republishes a listing. */
export const TierOverride = ({ tier, action }: TierOverrideProps) => {
  const [state, submit, pending] = useActionState(action, {});

  return (
    <form action={submit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2 text-caption text-ink">
        {ADMIN_COPY.host.tierField}
        <select name={ADMIN_FORM_FIELDS.tier} defaultValue={tier} className={FIELD}>
          {VERIFICATION_TIERS.map((value) => (
            <option key={value} value={value}>
              {VERIFICATION_TIER_LABEL[value]}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-2 text-caption text-ink">
        {ADMIN_COPY.confirm.reasonOptional.label}
        <input type="text" name={ADMIN_FORM_FIELDS.reason} maxLength={ADMIN_REASON_MAX_LENGTH} className={FIELD} />
      </label>
      <Button type="submit" size="md" fullWidth={false} disabled={pending}>
        {pending ? ADMIN_COPY.confirm.working : ADMIN_COPY.host.tierSave}
      </Button>
      {state.error ? <Banner tone="error">{state.error}</Banner> : null}
    </form>
  );
};
