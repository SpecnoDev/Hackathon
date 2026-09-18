'use server';

import { revalidatePath } from 'next/cache';
import type { z } from 'zod';
import { GENERIC_ERROR_MESSAGE, ROUTES } from '@/core/constants';
import { requireAdminPage } from '@/core/guards';
import { ApiError } from '@/core/utils';
import { accountStatusPatchSchema, adminOfferingStatusPatchSchema, verificationTierPatchSchema } from '@/shared/dto';
import { ADMIN_FORM_FIELDS } from '../constants';
import type { AdminFormState } from '../interfaces';
import { setHostStatus, setOfferingStatus, setTravellerStatus, setVerificationTier } from '../services';

/** An empty box is no reason at all, and the DTO says so; the form sends null rather than "". */
const text = (formData: FormData, field: string): string | null => {
  const value = formData.get(field);

  return typeof value === 'string' && value.trim() ? value.trim() : null;
};

const decide = async <T>(
  schema: z.ZodType<T>,
  input: unknown,
  apply: (value: T, actorEmail: string) => Promise<unknown>,
): Promise<AdminFormState> => {
  const { email } = await requireAdminPage();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? GENERIC_ERROR_MESSAGE };

  try {
    await apply(parsed.data, email);
  } catch (error) {
    return { error: error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE };
  }

  // Every back-office screen reads the same rows, so one subtree revalidation covers them all.
  revalidatePath(ROUTES.admin, 'layout');

  return {};
};

const statusInput = (formData: FormData) => ({
  status: formData.get(ADMIN_FORM_FIELDS.status),
  reason: text(formData, ADMIN_FORM_FIELDS.reason),
});

/** The subject id is bound by the page, never read from the form: the browser cannot retarget the change. */
export async function updateHostStatus(
  hostId: string,
  _state: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  return decide(accountStatusPatchSchema, statusInput(formData), ({ status, reason }, email) =>
    setHostStatus(hostId, status, reason, email),
  );
}

export async function updateTravellerStatus(
  travellerId: string,
  _state: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  return decide(accountStatusPatchSchema, statusInput(formData), ({ status, reason }, email) =>
    setTravellerStatus(travellerId, status, reason, email),
  );
}

export async function updateHostTier(
  hostId: string,
  _state: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const input = { tier: formData.get(ADMIN_FORM_FIELDS.tier), reason: text(formData, ADMIN_FORM_FIELDS.reason) };

  return decide(verificationTierPatchSchema, input, ({ tier, reason }, email) =>
    setVerificationTier(hostId, tier, reason, email),
  );
}

export async function updateOfferingStatus(
  offeringId: string,
  _state: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  return decide(adminOfferingStatusPatchSchema, statusInput(formData), ({ status, reason }, email) =>
    setOfferingStatus(offeringId, status, reason, email),
  );
}
