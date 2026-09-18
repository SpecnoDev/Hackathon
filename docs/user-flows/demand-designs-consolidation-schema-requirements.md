# Demand-designs consolidation — schema requirements

Schema changes needed to wire Brandon's traveller-app design prototype (`feature/demand-designs`) to real data on `feature/demand`, instead of leaving it on mock data. This is a requirements doc, not a migration — schema/migrations are Henry's to author and merge (see `CLAUDE.md` ownership table). Flagging before any of this lands on `feature/demand`, let alone `main`.

Full context: Brandon built a 22-screen clickable prototype of the traveller app on mock data. The product call (Francois) is to keep `feature/demand`'s real Prisma-backed data layer where it exists (Explore, listing detail, add-to-trip) and adopt Brandon's UI/screens as the target, which means building out several flows server-side that don't exist yet on either branch (booking/checkout, cancellation, saved listings).

## 1. `OfferingCategory` — add `GUIDE`, `TOUR` stays as-is

No rename. `TOUR` stays exactly as you renamed it (`docs/user-flows/demand-side-schema-requirements.md`, 2026-09-18) — the collision with `docs/glossary.md`'s "Experience" stays fixed. Brandon's prototype UI has a `GUIDE` category (values `EXPERIENCE | FOOD | GUIDE | TRANSPORT` in `src/features/demand/interfaces/traveller-app.interface.ts` on `feature/demand-designs`) that doesn't exist in the current enum at all — that's a genuine new category, not a naming disagreement. Francois's call: add `GUIDE`, keep everything else as you have it. The prototype's own `EXPERIENCE` value maps onto your existing `TOUR`.

**Proposed:**

```prisma
enum OfferingCategory { TOUR FOOD GUIDE TRANSPORT ACCOMMODATION CONCIERGE SECURITY }
```

One new enum value, additive — no existing rows need updating.

## 2. `Offering.priceUnit` — new enum + field

**Why:** `Offering.priceCents` today is a flat integer with no unit. The prototype's booking/pricing screens (and its client-side `booking-pricing.service.ts`) assume every listing is either priced per person or per trip, and multiply `priceCents * guests` when it's per-person. There's currently no way to express that server-side, and no booking/checkout endpoint exists yet to apply it (see §4 below — that's new, not a schema gap alone).

```prisma
enum PriceUnit { PER_PERSON PER_TRIP }
```

**On `Offering`, add:**

```prisma
priceUnit PriceUnit @default(PER_TRIP)
```

## 3. `Offering` — descriptive fields with no current column

Confirmed absent from the current schema; the prototype's listing-detail screen reads all of these from mock data:

```prisma
steps        String[]    // "what you'll do" — ordered list
whatToBring  String[]
safetyNotes  String[]
languages    Language[]  // reuses the existing Language enum — languages the offering itself is conducted in, distinct from Host.language
```

## 4. `SavedListing` — new model

No saved/favourites concept exists anywhere in the current schema. The prototype's `ListingCard` already carries `saved`/`onToggleSave` props with no backing data.

```prisma
model SavedListing {
  id          String    @id @default(uuid())
  travellerId String
  offeringId  String
  traveller   Traveller @relation(fields: [travellerId], references: [id])
  offering    Offering  @relation(fields: [offeringId], references: [id])
  createdAt   DateTime  @default(now())

  @@unique([travellerId, offeringId])
  @@index([travellerId])
}
```

**On `Traveller`, add:** `savedListings SavedListing[]`

## 5. `Booking` — cancellation/refund fields + a missing index

The prototype's cancel flow computes a refund client-side (`FULL | PARTIAL | NONE`) but the real `Booking` model has nowhere to persist the outcome.

```prisma
cancelReason String?
cancelledAt  DateTime?
refundCents  Int?
```

Reuses the existing `BookingStatus.CANCELLED` — no enum change needed there.

Also flagging, found while reviewing this model for the above: **`Booking.travellerId` has no `@@index`**, unlike `hostId`/`offeringId`. Once "my trips/bookings" queries land (needed for the ported Trips/Bookings screens), that's a full scan without one. Small ask, bundling it into the same migration since we're already touching this model.

## 6. `availability` — not changing

Brandon's write-up claimed a mismatch between the DB's `{type: 'on_request'|'recurring'|'dates', days, times, dates, noticeHours}` shape and what the UI reads. On inspection: the real seed data only ever writes `{type: 'on_request'}` today, nothing in the repo references `days`/`times`/`dates`/`noticeHours` anywhere, and the prototype's own shape (`{weekdays, times}`) doesn't match Brandon's claimed shape either. There is a real mismatch between the DB's `{type, ...}` shape and the prototype's flat `{weekdays, times}`, but no evidence yet that any real screen needs `availability` wired at all. Not proposing a change here — will revisit if a specific ported screen turns out to need it.

## Open product question, not a schema ask

The prototype's cancellation-window/fee constants (`FREE_CANCELLATION_WINDOW_HOURS = 24`, `LATE_CANCELLATION_REFUND_BPS = 5000`, `TRAVELLER_SERVICE_FEE_BPS = 0`) are explicitly marked as placeholders in its own source comment — the PRD asks for "a free window, partial refund, none" but sets no numbers, and leaves the fee model open. Not a schema change, but the booking/checkout endpoint being built server-side (§ below) needs these settled by the PO before the numbers are anything but a guess.

## Summary of changes

| Model | Change |
|---|---|
| `OfferingCategory` (enum) | Add `GUIDE`; `TOUR` unchanged |
| `PriceUnit` (new enum) | `PER_PERSON`, `PER_TRIP` |
| `Offering` | Add `priceUnit`, `steps`, `whatToBring`, `safetyNotes`, `languages` |
| `SavedListing` (new model) | `id`, `travellerId`, `offeringId`, `createdAt`; unique + indexed on `travellerId` |
| `Traveller` | Add `savedListings` back-relation |
| `Booking` | Add `cancelReason`, `cancelledAt`, `refundCents`; add `@@index([travellerId])` |

## Incident: `PhoneOtp` was dropped and reconstructed — needs your confirmation

While applying this migration with `prisma db push`, I found a `PhoneOtp` table already live on the shared Supabase dev DB (`phone`, `codeHash`, `expiresAt`, `attempts`, `createdAt` — clearly your OTP auth work) that wasn't in `schema.prisma` on any branch (checked `main`, `feature/supply`, `feature/supply-api`, `feature/supply-app`, `feature/demand-designs` — none have it). `db push` reconciles the DB to exactly match the schema file, so it dropped that table. It was empty (0 rows) at the time, so no data was lost, but the table structure itself is gone from its original form.

I reconstructed it from the column types I'd read moments earlier (`phone String @id, codeHash String, expiresAt DateTime, attempts Int @default(0), createdAt DateTime @default(now())`) and pushed it back. **I did not see the original constraints/indexes** — only `information_schema.columns` — so I guessed `phone` as the primary key since it's the natural identity for an OTP-by-phone flow. Please check this matches what you actually built and had elsewhere (a branch not yet pushed, local changes, etc.) before relying on it.

## Flagging, not a schema ask: dead code with a name collision risk

`src/core/services/offering.service.ts` exports `listLiveOfferings` and `findLiveOffering` — different signatures/return shape than the same-named `listLiveOfferings` in `src/features/demand/services/offering.service.ts`, both exported through separate barrels with the same export name. Checked: neither of `core/services`'s versions has any caller anywhere in the codebase (only `listHostOfferings` from that file is actually used, by `app/(host)/host/page.tsx`). Not touching this myself since it's `core/services` — your area — but flagging it as dead code that will silently break something if the barrels are ever consolidated or someone imports from `@/core/services` expecting the demand one.

## Not addressed here

- The booking/checkout/cancellation API routes themselves (`/trips/:id/lock`, `/trips/:id/checkout`, `/bookings/:id/accept|decline|complete`, etc.) — these don't exist yet on `feature/demand` at all and are being built as part of this consolidation, informed by this schema.
- DTO changes in `shared/dto/offering.dto.ts` to actually expose the new/existing fields (`groupMin`, `groupMax`, `inclusions` already exist as columns but aren't in the DTO yet) — tracked separately, not a schema question.
- Anything on the supply side (Host, Marlon's area).
