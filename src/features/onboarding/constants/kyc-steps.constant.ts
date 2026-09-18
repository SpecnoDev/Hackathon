import { KycDraft } from '@/core/interfaces';
import { dateOfBirthFromSaId, isValidSaId, normalise } from '@/shared/utils';

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

/**
 * The web onboarding asks these same questions (see host-onboarding.constant.ts), so the
 * wording lives here once. A host is identified by the phone they message from, which is why
 * nothing here asks for a number or an email.
 */
export const KYC_STEPS: readonly KycStep[] = [
  {
    field: 'fullName',
    label: 'Name',
    prompt: 'What is your full name? Use the name on your ID, so we can check it later.',
    parse: (raw) => {
      const value = normalise(raw);
      return value.split(' ').length >= 2
        ? { ok: true, value }
        : { ok: false, error: 'We need your first name and your surname. Send both to carry on.' };
    },
  },
  {
    field: 'serviceArea',
    label: 'Where you host',
    prompt: 'Which area do you host in? Travellers use this to find you.',
    parse: required('Tell us the area you host in, like Langa or Knysna.'),
  },
  {
    field: 'idNumber',
    label: 'ID number',
    prompt:
      'What is your ID number? We check it so travellers know you are a real person.\n\nUse a test number for now, not your real one.',
    parse: (raw) => {
      const value = normalise(raw).replace(/\s/g, '');
      return isValidSaId(value)
        ? { ok: true, value }
        : { ok: false, error: 'That does not look like an ID number. It is 13 digits. Check it and send it again.' };
    },
    derive: (value) => ({ dateOfBirth: dateOfBirthFromSaId(value) ?? undefined }),
  },
  {
    field: 'idDocumentMediaId',
    label: 'ID photo',
    prompt:
      'Last one. Send a photo of your ID, or reply SKIP.\n\nDo not send a real ID. Any picture is fine for now.',
    expectsImage: true,
    skippable: true,
  },
] as const;

export const SKIP_KEYWORD = 'skip';
