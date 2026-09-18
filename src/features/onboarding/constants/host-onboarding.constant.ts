import { Language } from '@prisma/client';
import { LANGUAGE_LABELS } from '@/core/constants';
import { KYC_STEPS, KycStep, ParseResult } from './kyc-steps.constant';

export const ONBOARDING_ANSWER_FIELD = 'answer';
export const ONBOARDING_STEP_PARAM = 'step';

export type HostOnboardingField = 'language' | 'fullName' | 'serviceArea';

export interface HostOnboardingQuestion {
  readonly field: HostOnboardingField;
  readonly prompt: string;
  readonly helper?: string;
  readonly options?: readonly { readonly value: string; readonly label: string }[];
}

/** The app asks the bot's questions, so copy and validation stay defined once, in KYC_STEPS. */
const kycStep = (field: KycStep['field']): { prompt: string; parse: (raw: string) => ParseResult } => {
  const step = KYC_STEPS.find((candidate) => candidate.field === field);
  if (!step?.parse) throw new Error(`KYC_STEPS no longer has a validated "${field}" step`);

  return { prompt: step.prompt, parse: step.parse };
};

const name = kycStep('fullName');
const serviceArea = kycStep('serviceArea');
const languages = Object.values(Language).map((value) => ({ value, label: LANGUAGE_LABELS[value] }));

export const HOST_ONBOARDING_QUESTIONS: readonly HostOnboardingQuestion[] = [
  {
    field: 'language',
    prompt: 'Which language do you want to use?',
    helper: 'You picked this when you signed up. Tap it again to keep it.',
    options: languages,
  },
  { field: 'fullName', prompt: name.prompt },
  { field: 'serviceArea', prompt: serviceArea.prompt },
];

export const HOST_ONBOARDING_PARSERS: Record<HostOnboardingField, (raw: string) => ParseResult> = {
  language: (raw) =>
    Object.values(Language).includes(raw as Language)
      ? { ok: true, value: raw }
      : { ok: false, error: 'Choose one of the languages to carry on.' },
  fullName: name.parse,
  serviceArea: serviceArea.parse,
};

/** The questions plus the first offering, which closes the path. */
export const ONBOARDING_TOTAL_STEPS = HOST_ONBOARDING_QUESTIONS.length + 1;
