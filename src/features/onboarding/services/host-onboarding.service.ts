import { Host, Prisma } from '@prisma/client';
import { prisma } from '@/core/services';
import {
  HOST_ONBOARDING_PARSERS,
  HOST_ONBOARDING_QUESTIONS,
  HostOnboardingField,
  HostOnboardingQuestion,
} from '../constants';

export type SavedAnswer = { ok: true; host: Host } | { ok: false; error: string };

/**
 * Language only confirms a value that already has a database default, so it counts as
 * answered once a later question is. Without that the host could never leave step one.
 */
const isAnswered: Record<HostOnboardingField, (host: Host) => boolean> = {
  language: (host) => Boolean(host.fullName.trim() || host.serviceArea.trim()),
  fullName: (host) => Boolean(host.fullName.trim()),
  serviceArea: (host) => Boolean(host.serviceArea.trim()),
};

export const findOnboardingQuestion = (field?: string): HostOnboardingQuestion | undefined =>
  HOST_ONBOARDING_QUESTIONS.find((question) => question.field === field);

/** Where a returning host resumes: the first question their record has no answer for. */
export const nextOnboardingQuestion = (host: Host): HostOnboardingQuestion | undefined =>
  HOST_ONBOARDING_QUESTIONS.find((question) => !isAnswered[question.field](host));

export const onboardingAnswer = (host: Host, field: HostOnboardingField): string =>
  field === 'language' ? host.language : host[field];

export const saveOnboardingAnswer = async (
  hostId: string,
  field: HostOnboardingField,
  raw: string,
): Promise<SavedAnswer> => {
  const result = HOST_ONBOARDING_PARSERS[field](raw);
  if (!result.ok) return result;

  const host = await prisma.host.update({
    where: { id: hostId },
    data: { [field]: result.value } as Prisma.HostUpdateInput,
  });

  return { ok: true, host };
};
