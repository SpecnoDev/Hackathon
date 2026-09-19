import { MOCK_OTP_REJECTED_CODE } from '@/core/constants';

/** Bump on any breaking change to HostAppState's shape (e.g. a new required OfferingFields column) so a stale local snapshot reseeds instead of crashing. */
export const HOST_APP_SCHEMA_VERSION = 4;
export const NEW_DRAFT_KEY = 'new';

export const REGISTER_FLOW_STEPS = 5;
/** Sign in skips language (a returning host's language comes from their profile on sync) and stops at code. */
export const SIGN_IN_FLOW_STEPS = 2;
export const VERIFY_FLOW_STEPS = 3;
export const CREATE_FLOW_STEPS = 6;

export const OTP_LENGTH = 4;
export const OTP_RESEND_SECONDS = 30;
/** Demo only: OTP is mocked, so every code passes except this one, which lets the team show the error state. */
export const DEMO_REJECTED_OTP = MOCK_OTP_REJECTED_CODE;

/** PRD: "Three photos is enough to go live." */
export const PHOTOS_TO_GO_LIVE = 3;

export const VOICE_NOTE_MAX_SECONDS = 90;
export const VOICE_NOTE_MIN_SECONDS = 2;

export const GROUP_SIZE_MIN = 1;
export const DEFAULT_GROUP_MAX = 4;
export const GROUP_SIZE_MAX = 20;
export const SEATS_MIN = 1;
export const SEATS_MAX = 22;
export const TITLE_MIN_LENGTH = 3;

/** TODO: placeholder. The PRD gives Tier 1 "a value cap" but no amount; the PO has to set it. */
export const TIER_ONE_BOOKING_CAP_CENTS = 200_000;

/** PRD: payout within 24 hours of completion, same day for Tier 2. */
export const PAYOUT_WINDOW_HOURS = 24;
/** PRD: request-to-book with a response deadline, "say 4 hours". */
export const RESPONSE_DEADLINE_HOURS = 4;
/** TODO: placeholder. The PRD wants "a free window, partial refund, none" on every listing but sets no hours; the PO has to. */
export const FREE_CANCELLATION_HOURS = 24;
/** A drafted-listing row shows the first few steps of a long visit and counts the rest. */
export const STEPS_SHOWN_ON_ROW = 3;

/** F-06: a queued write past this many failed replays is dropped instead of retried forever. */
export const OUTBOX_MAX_ATTEMPTS = 5;

/** F4: bounds every host-API request (fetch has no built-in timeout) so a stalled network can't hold
 *  the `host_session` cookie alive indefinitely — 10s comfortably covers a slow mobile connection
 *  (the target device per docs/TECH_STACK.md) without stalling the UI on a call that's truly dead. */

/** Demo only: how long the mocked services take, so pending states are visible on stage. */
export const DEMO_AI_DELAY_MS = 1200;
export const DEMO_VERIFICATION_DELAY_MS = 8000;
export const DEMO_PAYOUT_DELAY_MS = 6000;

export const MS_PER_SECOND = 1000;
export const MS_PER_HOUR = 3_600_000;
export const MS_PER_DAY = 86_400_000;
export const MINUTES_PER_HOUR = 60;
