import { DEMO_AI_DELAY_MS, LISTING_SAMPLES } from '../constants';
import type { LanguageCode, OfferingKind } from '../interfaces';

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * TODO: stand-in for POST /api/v1/ai/transcribe (audio + language → transcript), owned by Henry.
 * Until it exists this returns the cached transcript for the kind, which is the PRD's own demo fallback.
 */
export const transcribeVoiceNote = async (kind: OfferingKind, language: LanguageCode): Promise<string> => {
  await wait(DEMO_AI_DELAY_MS);
  const { transcript } = LISTING_SAMPLES[kind];
  return transcript[language] ?? transcript.EN;
};

/** TODO: stand-in for POST /api/v1/ai/draft-listing. The drafted fields themselves are applied by the store. */
export const waitForDraftedListing = (): Promise<void> => wait(DEMO_AI_DELAY_MS);
