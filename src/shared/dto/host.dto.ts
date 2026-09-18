import { z } from 'zod';
import { OTP_CODE_LENGTH } from '@/core/constants';
import { toE164 } from '@/shared/utils';
import { offeringDraftSchema } from './offering.dto';

export const phoneSchema = z
  .string()
  .transform(toE164)
  .refine((phone): phone is string => phone !== null, { message: 'Not a South African mobile number' });

export const otpRequestSchema = z.object({ phone: phoneSchema });

export const otpVerifySchema = z.object({
  phone: phoneSchema,
  code: z.string().trim().length(OTP_CODE_LENGTH),
});

/**
 * What the WhatsApp bot posts. The raw ID number is hashed on arrival and never stored, and
 * the email it collects has nowhere to live on Host — both are dropped by the mapping, not here.
 */
export const hostIntakeSchema = z.object({
  whatsappId: phoneSchema,
  kyc: z.object({
    fullName: z.string().trim().min(1),
    idNumber: z.string().trim().min(1).optional(),
    serviceArea: z.string().trim().min(1),
    idDocumentMediaId: z.string().trim().min(1).nullish(),
  }),
  offerings: z.array(offeringDraftSchema).default([]),
});

export type OtpRequestDto = z.infer<typeof otpRequestSchema>;
export type OtpVerifyDto = z.infer<typeof otpVerifySchema>;
export type HostIntakeDto = z.infer<typeof hostIntakeSchema>;
