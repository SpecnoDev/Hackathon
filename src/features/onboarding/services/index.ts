import { conversationStore, WhatsAppService } from '@/core/services';
import { OfferingExtractionService } from './offering-extraction.service';
import { OnboardingFlowService } from './onboarding-flow.service';
import { ProfileSubmissionService } from './profile-submission.service';

export * from './host-onboarding.service';
export * from './offering-extraction.service';
export * from './onboarding-flow.service';
export * from './profile-submission.service';
export * from './provider-registry.store';

const globalScope = globalThis as { __onboardingFlow?: OnboardingFlowService };

/** Composition root: one wired graph per process, stable across `next dev` reloads. */
export const onboardingFlow = (globalScope.__onboardingFlow ??= new OnboardingFlowService(
  new WhatsAppService(),
  conversationStore,
  new OfferingExtractionService(),
  new ProfileSubmissionService(),
));
