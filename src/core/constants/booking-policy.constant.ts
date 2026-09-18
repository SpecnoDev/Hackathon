/** PRD: request-to-book with a response deadline, "say 4 hours", then the hold is released. */
export const HOST_RESPONSE_HOURS = 4;

/**
 * TODO: placeholders. The PRD asks for "a free window, partial refund, none" on every listing but sets no numbers,
 * and leaves the fee model open ("commission only, traveller fee only, or split?"). The PO has to settle both.
 */
export const FREE_CANCELLATION_WINDOW_HOURS = 24;
export const LATE_CANCELLATION_REFUND_BPS = 5000;
export const TRAVELLER_SERVICE_FEE_BPS = 0;
