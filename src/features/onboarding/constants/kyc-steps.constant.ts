import { Language } from '@prisma/client';
import { LANGUAGE_LABELS } from '@/core/constants';
import { KycDraft } from '@/core/interfaces';
import { normalise } from '@/shared/utils';

export type ParseResult = { ok: true; value: string } | { ok: false; error: string };

export interface StepChoice {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
}

export interface KycStep {
  readonly field: keyof KycDraft;
  readonly prompt: string;
  readonly label: string;
  readonly helper?: string;
  readonly choices?: readonly StepChoice[];
  readonly expectsImage?: boolean;
  readonly skippable?: boolean;
  readonly parse?: (raw: string) => ParseResult;
}

const required = (error: string) => (raw: string): ParseResult => {
  const value = normalise(raw);
  return value.length > 1 ? { ok: true, value } : { ok: false, error };
};

const LANGUAGE_CHOICES: readonly StepChoice[] = Object.values(Language).map((value) => ({
  id: value,
  title: LANGUAGE_LABELS[value],
}));

/**
 * Word for word the questions the host app asks, taken from
 * features/supply/constants/copy-onboarding.constant.ts (COPY_REGISTER, COPY_VERIFY) and
 * copy-offerings.constant.ts (COPY_CREATE). They are restated rather than imported because a
 * feature may not import another feature; if the app's wording changes, change it here too.
 *
 * His phone and code steps have no equivalent here: WhatsApp already proved the number.
 */
export const KYC_STEPS: readonly KycStep[] = [
  {
    field: 'language',
    label: 'Language',
    prompt: 'Which language do you want to use?',
    helper: 'You can change this later.',
    choices: LANGUAGE_CHOICES,
  },
  {
    field: 'fullName',
    label: 'Name',
    prompt: 'What is your first name?',
    helper: 'This is what travellers will see.',
    parse: required('We need your first name. Send it to carry on.'),
  },
  {
    field: 'documentType',
    label: 'Document',
    prompt: 'Which document do you have?',
    helper: 'Only we see it. Travellers never do.',
    choices: [
      { id: 'SA_ID', title: 'South African ID', description: 'Green ID book or smart ID card' },
      { id: 'PASSPORT', title: 'Passport', description: 'From any country' },
      { id: 'PERMIT', title: 'Asylum or refugee permit', description: 'Your Home Affairs permit' },
    ],
  },
  {
    field: 'idDocumentMediaId',
    label: 'Document photo',
    prompt: 'Take a photo of your document',
    helper: 'Good light, no shadow, whole card in the frame. Reply SKIP if you cannot right now.',
    expectsImage: true,
    skippable: true,
  },
  {
    field: 'selfieMediaId',
    label: 'Selfie',
    prompt: 'Now take a selfie',
    helper: 'Face the light. Take off your hat and glasses. Reply SKIP if you cannot right now.',
    expectsImage: true,
    skippable: true,
  },
  {
    field: 'serviceArea',
    label: 'Area',
    prompt: 'Which area is this in?',
    helper: 'Choose the area travellers would search for.',
    parse: required('Tell us the area travellers would search for.'),
  },
  {
    field: 'offeringKind',
    label: 'What you offer',
    prompt: 'What do you offer?',
    choices: [
      { id: 'experience', title: 'Experience', description: 'A walk, a workshop, a visit, a story' },
      { id: 'transport', title: 'Transport', description: 'Airport runs, lifts and day drives' },
      { id: 'guide', title: 'Guide', description: 'Show people around your area' },
      { id: 'food', title: 'Food', description: 'A home-cooked meal or a tasting' },
      { id: 'concierge', title: 'Concierge', description: 'You know who to call and you arrange it' },
    ],
  },
] as const;

export const OFFERING_DESCRIBE_PROMPT =
  'Tell us about it\n\nSay what you do, how long it takes, how many people, and what they will pay.\n\n' +
  '_Example: "I cook umngqusho and chicken at my home in Langa. We eat together and I tell you about the area. About two hours, up to six people, R250 each."_';

export const SKIP_KEYWORD = 'skip';
