import { z } from 'zod';
import { isSaMobile } from '@/shared/utils';
import { HOST_COPY } from '../constants';

const BANK_ACCOUNT = /^\d{6,16}$/;

export const phoneNumberSchema = z.string().refine(isSaMobile, HOST_COPY.register.phone.invalid);
export const firstNameSchema = z.string().trim().min(1, HOST_COPY.register.name.empty);
export const communityProofSchema = z.string().trim().min(1, HOST_COPY.verify.community.empty);
export const payoutPhoneSchema = z.string().refine(isSaMobile, HOST_COPY.earnings.fields.phoneInvalid);
export const bankAccountSchema = z.string().trim().regex(BANK_ACCOUNT, HOST_COPY.earnings.fields.accountInvalid);

/** The first problem with a value, already written as "what happened and what to do", or undefined when it is fine. */
export const firstIssue = (schema: z.ZodType, value: unknown): string | undefined => {
  const result = schema.safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
};
