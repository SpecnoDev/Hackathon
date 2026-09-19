/** Host-facing lists are never paginated by the client — bounded here so a host with a long
 * history can't force an unbounded scan. */
export const BOOKING_LIST_DEFAULT_TAKE = 50;
export const PAYOUT_LIST_DEFAULT_TAKE = 50;
