# Operations

How Hosted is actually run, and where it would hurt. Written against the code in this repo, not against an ideal.

An operator is anyone whose email is in `ADMIN_EMAILS`. They sign in with the same magic link as a traveller
(`getCurrentUser` in `core/services/current-user.service.ts` resolves the role), land on `/admin`, and are kept off the
host and traveller trees by the matrix in `core/constants/route.constant.ts`.

## What an operator can do today

| Task | Where | What it writes |
|---|---|---|
| See the state of the marketplace | `/admin` | Nothing — counts by `Host.tier`, `Offering.status`, `Booking.status`, `Payout.status` |
| Approve, suspend, block or re-review a host | `PATCH /api/v1/admin/hosts/:id/status` | `Host.status`, `statusReason`, `statusChangedAt`, and pauses every `LIVE` offering of that host |
| Do the same to a traveller | `PATCH /api/v1/admin/travellers/:id/status` | `Traveller.status`, `statusReason`, `statusChangedAt` |
| Override what KYC decided | `PATCH /api/v1/admin/hosts/:id/tier` | `Host.tier` |
| Publish, pause or reject a listing | `PATCH /api/v1/admin/offerings/:id/status` | `Offering.status` |
| Answer "who suspended this host and why" | `/admin/audit` | Nothing — reads `AdminAction`, newest first, filtered by action type |

Two properties hold everywhere:

- **Every change is answerable.** Each write runs in a transaction with its own `AdminAction` row
  (`features/admin/services/admin-actions.service.ts`), so the trail can never claim something the data denies.
  `SUSPENDED` and `BLOCKED` will not be accepted without a reason (`accountStatusPatchSchema`).
- **Status is binding, not cosmetic.** A non-`ACTIVE` account cannot hold a session (`getCurrentUser`,
  `requireTraveller`) and `PUBLIC_OFFERING_WHERE` hides its listings even if a row reaches `LIVE` by another path.

`AdminAction` is append-only: nothing in the codebase updates or deletes a row, and there is no endpoint that could.

## What an operator cannot do today

### Refunds and disputes
There is no refund path and no dispute state. `Booking.status` is `REQUESTED | CONFIRMED | DECLINED | COMPLETED |
CANCELLED`, and `Booking.paymentRef` is a mock reference string — no money moves in this codebase, so "refund" has
nowhere to be recorded and no amount to reverse (`totalCents`, `feeCents` and `hostReceivesCents` are all final).

- **No `DISPUTED` state.** A traveller who says the tour never happened and a host who says it did land on the same
  `COMPLETED` row, so the argument lives in someone's inbox instead of the database.
- **No operator override on a booking.** There is no booking endpoint at all under `api/v1` — the host app queues
  `POST /bookings/:id/accept|decline|cancel|complete` into its outbox and those routes are not built yet, so an
  operator cannot cancel on either party's behalf even when both sides ask.
- **No cancellation reason or actor on `Booking`.** The host app captures a reason locally (`responseReason` in
  `host-app.store.ts`) and the server has nowhere to put it, so a cancellation pattern is invisible.
- **Smallest honest fix:** add `DISPUTED` to `BookingStatus`, `refundedCents`, `cancelledById` and `cancelReason` to
  `Booking`, and one admin endpoint that moves the status and writes an `AdminAction` like every other change.

### Support and contactability
Neither side can report a problem. There is no `Report`, `Ticket` or `Message` model, and no inbound channel except
the WhatsApp bot, which only understands onboarding (`core/services/conversation-store.service.ts`).

- **Outbound is one-way and bot-only.** `WhatsAppService` is reachable from the webhook, not from the back office, so
  an operator who suspends a host cannot tell them.
- **The reason is recorded and never shown.** `Host.statusReason` explains a suspension to other operators only; the
  host sees a dead session and no explanation.
- **A traveller may have no phone at all.** `Traveller.phone` is optional and `ContactChannel` exists on `Host` only,
  so there is no guaranteed way to reach the paying side of a booking.
- **Smallest honest fix:** a `Report` model (reporter, subject, category, free text) written from both apps, surfaced
  as a back-office queue beside the audit trail, plus a templated WhatsApp send on status change.

### Verification expiry
A tier never lapses. `Host.tier` has no granted-at or expires-at column, so `IDENTITY` earned once is `IDENTITY`
forever, and `goLiveStatus` (`core/services/offering.service.ts`) reads it as current fact every time a host publishes.

- **This is worst in the regulated categories.** `OfferingCategory.TRANSPORT` is gated at `COMMUNITY` tier once, and
  `OfferingCategory.SECURITY` is not gated at all — a guard-for-hire goes live on an ID check alone.
- **No credential is modelled.** The only evidence fields are `Host.idNumberHash` and `Host.idDocumentPath`; a PSIRA
  registration, a PrDP or an operating licence has nowhere to live, let alone an expiry date to check against.
- **Smallest honest fix:** `tierGrantedAt` and `tierExpiresAt` on `Host`, a `SECURITY` branch in `goLiveStatus`, and a
  scheduled job that drops an expired host to `REGISTERED` and writes the `AdminAction` for it.

### Listing moderation at scale
Listings are written by an LLM from a voice note (`features/onboarding/services/offering-extraction.service.ts`) and,
for every category except `TRANSPORT`, `goLiveStatus` sends them straight to `LIVE` at `IDENTITY` tier. No human and
no filter reads `title`, `description`, `meetingPoint` or `transcript` before a traveller does.

- **Off-platform leakage is the concrete risk.** Nothing rejects a phone number, an email or a URL in the copy, so
  "WhatsApp me on 082…" takes the booking, and with it the fee, off Hosted — and out of reach of every safety control
  above, since an off-platform booking has no `Booking` row to dispute.
- **Moderation is reactive.** `Offering.status` gives an operator `REJECTED` and `PAUSED`, but only after someone
  notices; `/admin/offerings` has no "needs a look" signal beyond `IN_REVIEW`.
- **Smallest honest fix:** a contact-detail regex check at write time in `createHostOffering` that forces `IN_REVIEW`
  instead of `LIVE`, so the queue fills itself and the trail records who cleared each one.

### Payout failure handling
`PayoutStatus` is `PENDING | SENT`. There is no failure state, no reason, no retry count and no payout endpoint —
`Payout` rows are only ever read, by the overview tiles.

- **Nothing records why a payout failed.** An operator looking at a host asking "where is my money" sees `PENDING`
  and cannot tell a queued payout from a rejected one.
- **A cash send is unrecoverable.** `PayoutChannel.CASH_SEND` pays out to `Payout.destination`, a free-text field
  whose only candidate source is `Host.payoutPhone` — checked for South African mobile format (`payoutPhoneSchema`)
  and never verified against the OTP-verified `Host.phone`. A digit wrong and a stranger draws the cash at an ATM;
  there is no reversal and no paper trail to chase.
- **Payouts are outside the audit trail.** `ADMIN_SUBJECT_TYPES` covers hosts, travellers and offerings only, so a
  manual re-send leaves no record of who authorised it.
- **Smallest honest fix:** `FAILED` on `PayoutStatus` with `failureReason` and `attempts` on `Payout`, a
  `PAYOUT` subject type, and a confirmation step that shows the destination next to `Host.phone` before sending.

## Smaller gaps worth naming

- **One level of admin.** Every email in `ADMIN_EMAILS` can block anyone; there is no reviewer-versus-approver split,
  so the audit trail is the only control on an operator.
- **No pagination anywhere in the back office.** The audit trail is capped at `ADMIN_ACTION_LOG_MAX_LIMIT` (200) and
  the lists are capped too, so older history is currently unreachable rather than slow.
- **No export.** An incident review, an insurer or a regulator would need the trail out of the database by hand.
- **Reviews are unmoderated.** `Review` has no status and no admin endpoint, so a defamatory review can only be
  removed in SQL.
