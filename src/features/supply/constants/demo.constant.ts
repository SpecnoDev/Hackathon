import { DEMO_MODE_COOKIE, DEMO_MODE_ON } from '@/core/constants';
import type { CaptureKind, ContactChannel, DocumentType, LanguageCode, OfferingKind } from '../interfaces';

/**
 * Hackathon pitch-mode flag. On, it drives the host happy path — Welcome → Join → language → phone →
 * OTP → name → contact → done → verify → create listing → published — with no typing, recording,
 * camera or choice screens for every step but the OTP: every other screen it touches prefills a
 * canned answer instead of waiting for input, so a presenter can click straight through with one tap
 * per screen's primary CTA. Every prefill fills only an empty answer, so a judge who types wins.
 *
 * Switched from the back office (Demo mode in the sidebar), not a build-time variable, so it turns on
 * and off without a deploy. It lives in a cookie on the presenter's browser: on any other device every
 * prefill effect is a no-op and the flow behaves exactly as it does today. Read at call time, so the
 * toggle takes effect on the next screen. On the server there is no document, and the host screens
 * decide after the store is ready, so nothing is prefilled during server rendering.
 *
 * Requires `ALLOW_MOCK_AUTH=true` (see `core/constants/auth.constant.ts`, `isMockAuthEnabled`) so
 * any 4-digit code but `MOCK_OTP_REJECTED_CODE` ('0000') is accepted by `/api/v1/auth/host/verify`.
 * The server-side page-auth redirect bypass lives in `isDemoBypassEnabled` (ALLOW_DEMO_BYPASS), not here.
 *
 * `EnterCodePage`, on Join, routes a `RETURNING` result the same as `NEW_HOST` — the canned phone
 * number is reused on every run, so by run two it is a real, existing host, and Join must not
 * dead-end on "already registered".
 *
 * A cold deep link straight into a host screen (no Join ever run) is provisioned once on mount by
 * `hostAppStore.ensureDemoHost()` (host-app.store.ts), called from `HostAppProvider` in the branch
 * that would otherwise have redirected it to Welcome.
 */
export const isDemoMode = (): boolean =>
  typeof document !== 'undefined' && document.cookie.split('; ').includes(`${DEMO_MODE_COOKIE}=${DEMO_MODE_ON}`);

/** A local SA mobile number that passes `phoneNumberSchema` (`isSaMobile`). Never sent to a real host. */
export const DEMO_PHONE_LOCAL = '0821234567';

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

/**
 * Bundled stand-ins for the ID-document and selfie captures, served from `public/demo/`. Both are
 * Pillow-generated compositions (rounded card / silhouette + brand palette from `globals.css`), not
 * photos of a person — clearly fake by design, each captioned "SAMPLE" / "not a real ID".
 */
export const DEMO_SAMPLE_PHOTO: Record<CaptureKind, string> = {
  document: '/demo/sample-id.jpg',
  selfie: '/demo/sample-selfie.jpg',
};

/**
 * Bundled stand-ins for the three listing photos, served from `public/demo/`. Length must equal
 * `PHOTOS_TO_GO_LIVE`. Sourced from images.unsplash.com — the same host already used for every
 * traveller-facing listing photo in `prisma/seed.ts` (see the `PHOTO` map there) — under the
 * Unsplash License (free to use, no attribution required, commercial use permitted). Downloaded,
 * centre-cropped to 1200x800 and re-encoded here rather than hot-linked, so the demo has no runtime
 * dependency on Unsplash: sample-listing-1.jpg (photo-1466978913421-dad2ebd01d17, `PHOTO.sharedTable`
 * — a shared table, home-cooked-meal vibe), sample-listing-2.jpg
 * (photo-1580060839134-75a5edca2e99, `PHOTO.capeTownAerial`), sample-listing-3.jpg
 * (photo-1498837167922-ddd27525d352, `PHOTO.market`).
 */
export const DEMO_LISTING_PHOTOS: readonly string[] = ['/demo/sample-listing-1.jpg', '/demo/sample-listing-2.jpg', '/demo/sample-listing-3.jpg'];
