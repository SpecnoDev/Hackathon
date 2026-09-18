import { KycDraft } from '@/core/interfaces';
import { dateOfBirthFromSaId, isValidEmail, isValidSaId, normalise } from '@/shared/utils';

export type ParseResult = { ok: true; value: string } | { ok: false; error: string };

export interface KycStep {
  readonly field: keyof KycDraft;
  readonly prompt: string;
  readonly label: string;
  readonly expectsImage?: boolean;
  readonly skippable?: boolean;
  readonly parse?: (raw: string) => ParseResult;
  readonly derive?: (value: string) => Partial<KycDraft>;
}

const required = (error: string) => (raw: string): ParseResult => {
  const value = normalise(raw);
  return value.length > 1 ? { ok: true, value } : { ok: false, error };
};

export const KYC_STEPS: readonly KycStep[] = [
  {
    field: 'fullName',
    label: 'Full name',
    prompt: 'What is your full name, as it appears on your ID?',
    parse: (raw) => {
      const value = normalise(raw);
      return value.split(' ').length >= 2
        ? { ok: true, value }
        : { ok: false, error: 'Please send both your first name and surname.' };
    },
  },
  {
    field: 'idNumber',
    label: 'ID number',
    prompt: 'Thanks. Now your 13-digit South African ID number (test data only).',
    parse: (raw) => {
      const value = normalise(raw).replace(/\s/g, '');
      return isValidSaId(value)
        ? { ok: true, value }
        : { ok: false, error: "That does not look like a valid SA ID number — it must be 13 digits with a valid date and checksum. Try again." };
    },
    derive: (value) => ({ dateOfBirth: dateOfBirthFromSaId(value) ?? undefined }),
  },
  {
    field: 'email',
    label: 'Email',
    prompt: 'Got it. What email address should we use for your account?',
    parse: (raw) => {
      const value = normalise(raw).toLowerCase();
      return isValidEmail(value)
        ? { ok: true, value }
        : { ok: false, error: 'That email does not look right. Please send it again.' };
    },
  },
  {
    field: 'serviceArea',
    label: 'Service area',
    prompt: 'Which area do you work in? (e.g. Woodstock, Cape Town)',
    parse: required('Please tell me the area you work in.'),
  },
  {
    field: 'idDocumentMediaId',
    label: 'ID document',
    prompt: 'Last one — send a photo of your ID document, or reply SKIP. Do not send a real ID: any test image is fine.',
    expectsImage: true,
    skippable: true,
  },
] as const;

export const SKIP_KEYWORD = 'skip';
