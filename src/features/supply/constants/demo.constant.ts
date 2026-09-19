import type { CaptureKind, ContactChannel, DocumentType, LanguageCode, OfferingKind } from '../interfaces';

/**
 * Hackathon pitch-mode flag. `NEXT_PUBLIC_DEMO_MODE=true` drives the host happy path — Welcome →
 * Join → language → phone → OTP → name → contact → done → verify → create listing → published —
 * with no typing, recording, camera or choice screens: every screen it touches prefills a canned
 * answer instead of waiting for input, so a presenter can click straight through with one tap per
 * screen's primary CTA.
 *
 * Requires `ALLOW_MOCK_AUTH=true` (see `core/constants/auth.constant.ts`, `isMockAuthEnabled`) so
 * the OTP this submits is accepted by `/api/v1/auth/host/verify`. Off by default — whenever the var
 * is absent (including production), every prefill effect below is a no-op and the flow behaves
 * exactly as it does today. Removal target: after judging, 2026-09-19 (matches `isMockAuthEnabled`).
 *
 * Read as a static literal, not through `optionalEnv`: Next.js only inlines a `NEXT_PUBLIC_` value
 * into the browser bundle when it sees the full `process.env.NEXT_PUBLIC_X` literal (same pattern as
 * `core/services/client/supabase-browser.service.ts`).
 *
 * The server-side page-auth redirect bypass lives in `isDemoBypassEnabled` (ALLOW_DEMO_BYPASS,
 * `core/constants/auth.constant.ts`), not this flag.
 *
 * `EnterCodePage`'s auto-submit waits `DEMO_OTP_SUBMIT_DELAY_MS` after filling the code and, on Join,
 * routes a `RETURNING` result the same as `NEW_HOST` — `confirmCode`'s profile/offerings/bookings/
 * payouts sync is real network latency the OTP screen has no reason to block on for a canned host,
 * and the canned phone number is reused on every run, so by run two it is a real, existing host.
 */
export const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

/** A local SA mobile number that passes `phoneNumberSchema` (`isSaMobile`). Never sent to a real host. */
export const DEMO_PHONE_LOCAL = '0821234567';

/** Any `HOST_OTP_CODE_LENGTH`-digit code but `MOCK_OTP_REJECTED_CODE` ('0000') passes the mock verify route. */
export const DEMO_OTP = '1234';

/** How long after filling the code `EnterCodePage` waits before auto-submitting it, so the presenter sees the digits fill and the spinner flash instead of an instant jump. */
export const DEMO_OTP_SUBMIT_DELAY_MS = 500;

/** Demo only: how long the Checking screen holds before resolving, in place of `DEMO_VERIFICATION_DELAY_MS`, so the presenter isn't left waiting on stage. */
export const DEMO_CHECKING_DELAY_MS = 500;

export const DEMO_FIRST_NAME = 'Thabo';

/** Must exist in `REGION_OPTIONS` (host-options.constant.ts) so `missingDraftFields()` clears the region gate. */
export const DEMO_REGION = 'Cape Town';

/** Must exist in `LANGUAGES` (host-options.constant.ts). */
export const DEMO_LANGUAGE: LanguageCode = 'EN';

/** WhatsApp already defaults on this screen without a store write; kept for symmetry with the other choice-screen defaults. */
export const DEMO_CONTACT_CHANNEL: ContactChannel = 'WHATSAPP';

/** Must exist in `OFFERING_KINDS` (host-options.constant.ts) and `LISTING_SAMPLES` (listing-samples.constant.ts). */
export const DEMO_LISTING_KIND: OfferingKind = 'experience';

/** Must exist in `DOCUMENT_TYPES` (host-options.constant.ts). */
export const DEMO_DOCUMENT_TYPE: DocumentType = 'SA_ID';

/** Bundled stand-ins for the ID-document and selfie captures, served from `public/demo/`. */
export const DEMO_SAMPLE_PHOTO: Record<CaptureKind, string> = {
  document: '/demo/sample-id.jpg',
  selfie: '/demo/sample-selfie.jpg',
};

/** Bundled stand-ins for the three listing photos, served from `public/demo/`. Length must equal `PHOTOS_TO_GO_LIVE`. */
export const DEMO_LISTING_PHOTOS: readonly string[] = ['/demo/sample-listing-1.jpg', '/demo/sample-listing-2.jpg', '/demo/sample-listing-3.jpg'];
