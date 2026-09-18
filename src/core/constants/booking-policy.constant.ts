/** PRD: request-to-book with a response deadline before the hold releases. */
export const HOST_RESPONSE_HOURS = 4;

/**
 * Placeholders. The PRD asks for "a free window, partial refund, none" on every booking but sets
 * no numbers, and leaves the fee model open (commission only, traveller fee only, or split?).
 * The PO needs to settle both before these are anything but a guess.
 */
export const FREE_CANCELLATION_WINDOW_HOURS = 24;
export const LATE_CANCELLATION_REFUND_BPS = 5000;
export const TRAVELLER_SERVICE_FEE_BPS = 0;

/** Payments are a mock: an instant booking is stamped with this prefix and its own id, never a card detail. */
export const MOCK_PAYMENT_REF_PREFIX = 'mock_';
