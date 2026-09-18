# Demand-side schema requirements

What the demand-side UI (browse feed, listing detail, reviews) needs from the data model, checked against the `Offering` model currently drafted in [docs/TECH_STACK.md](../TECH_STACK.md#data-model). This is a requirements doc, not a migration — schema/migrations are Henry's to author and merge (see `CLAUDE.md` ownership table). The goal here is to hand him a precise, justified spec instead of leaving him to guess from the UI alone.

Grounded in: [demand-side-flow-detailed.md](demand-side-flow-detailed.md) (step 1 decisions, badge research), [demand-side-flow.md](demand-side-flow.md) (step 6, reviews as trust signal), `docs/PRD-context.md` (vouching as one of four MVP journeys).

## Why this doc exists

The browse-listings prototype (`src/app/prototype-browse-listings/`) built its card against mock data with `rating`, `reviewCount`, a "Community Verified" badge, and a "High Impact" badge. None of those have a home in the `Offering` model as currently drafted — there's no `Review` model, and no field capturing what the PRD calls the actual differentiator: **local vouching with visible provenance** ("37 Woodstock residents recommended this"). This doc separates the two concerns cleanly, since they were conflated in the prototype's mock data but are genuinely different things:

- **Vouching** — a pre-booking community endorsement. Exists independent of any booking. Sourced from a survey or nomination flow. This is the PRD's actual MVP journey (#4 of 4).
- **Reviews** — post-booking feedback. Requires a completed booking to exist. This is flow-doc step 6.



## 1. `Offering.category` — enum needs two more values, and a rename to stop colliding with "Experience"

**Current:** `EXPERIENCE | TRANSPORT | CONCIERGE | SECURITY`

**Problem (scope):** the browse feed sections/filters by category (decided in demand-side-flow-detailed.md's sectioned-feed research), and the flow doc's own MVP scope names food and accommodation as listing types alongside tours, transport, and security/concierge. `EXPERIENCE` alone can't distinguish a cooking class from a walking tour from a place to stay — three categories the browse UI treats as visually and semantically distinct.

**Problem (naming):** [docs/glossary.md](../glossary.md) defines **Experience** as the whole listing entity — "a single bookable offering from a supplier (a tour, cooking class, transport, accommodation, security/concierge, etc.)." That's the plain-English/pitch word for what the schema calls `Offering`. Having `OfferingCategory.EXPERIENCE` reuse the same word for just *one* category (as opposed to food/transport/accommodation/etc.) collides with that broader meaning. Once `FOOD` is split out as its own category, "experience" no longer means anything specific as a category label — it's really "tours and activities." Renaming to `TOUR` removes the collision without touching the `Offering` model name itself (which stays as-is — renaming the model would ripple through the API table, file paths, and relations documented elsewhere in `TECH_STACK.md`, which is a bigger change than this doc is scoped to propose).

**Proposed:**

```prisma
enum OfferingCategory { TOUR FOOD TRANSPORT ACCOMMODATION CONCIERGE SECURITY }
```



## 2. Vouching — new model + a denormalized counter

**Why it's not just a field:** provenance is the product, per the PRD ("the badge is only worth something if its provenance is legible on the listing"). A bare `Offering.vouchCount: Int` can't say *who* vouched or *where they're from* — that needs its own rows.

```prisma
enum VouchSource { SURVEY NOMINATION }

model Vouch {
  id          String      @id @default(uuid())
  offeringId  String
  offering    Offering    @relation(fields: [offeringId], references: [id])
  voucherArea String                              // e.g. "Woodstock" — the provenance the card displays
  source      VouchSource
  createdAt   DateTime    @default(now())

  @@index([offeringId])
}
```

**On** `Offering`**, add:**

```prisma
vouchCount Int @default(0)   // denormalized from Vouch — avoids a count query on every card render
vouches    Vouch[]
```

**Open question for Henry/team:** per `PRD-context.md`, vouch data for the demo is "either seeded from a mock community survey or captured through a lightweight nominate-a-local flow the judges can try. Not yet decided." This schema supports either — seeding rows directly, or building the nominate flow later — without changing shape either way.

## 3. Reviews — new model + denormalized aggregates on `Offering`

**Why it needs a** `Booking` **relation:** flow-doc step 6 frames reviews explicitly as a trust/safety signal, not just feedback, because suppliers are informal and unverified. A review tied to nothing would be as trustworthy as an anonymous internet review — the whole point is it's tied to a real, completed transaction.

```prisma
model Review {
  id         String   @id @default(uuid())
  bookingId  String   @unique                     // one review per booking; also proves the review is real
  booking    Booking  @relation(fields: [bookingId], references: [id])
  offeringId String
  offering   Offering @relation(fields: [offeringId], references: [id])
  travellerId String
  traveller  Traveller @relation(fields: [travellerId], references: [id])
  rating     Int                                  // 1–5; enforce range in the zod DTO, not the DB
  comment    String?
  createdAt  DateTime @default(now())

  @@index([offeringId])
}
```

**On** `Offering`**, add:**

```prisma
avgRating   Float? // recomputed on new review; null until the first review exists
reviewCount Int    @default(0)
reviews     Review[]
```

**On** `Booking`**, add:**

```prisma
review Review?
```



## 4. Sustainability tag — one optional field, not a filter system

Per `docs/PRD-context.md`'s backlog, sustainability/impact filtering and ranking is explicitly **out of MVP scope** ("needs supplier data we will not have at demo time"). The browse prototype built a filterable chip for this anyway, ahead of this decision. Team call: keep a lightweight tag for pitch/demo flavor, but no filter pipeline or ranking logic around it.

```prisma
enum SustainabilityTag { LOW_IMPACT_TRAVEL SUPPORTS_LOCAL_LIVELIHOODS }
```

**On** `Offering`**, add:**

```prisma
sustainabilityTag SustainabilityTag?   // optional, display-only — not filterable, not ranked
```



## Summary of changes to `docs/TECH_STACK.md`'s draft schema


| Model                          | Change                                                                                                                               |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `OfferingCategory` (enum)      | Rename `EXPERIENCE` → `TOUR` (naming collision with the glossary's "Experience" = the whole `Offering`); add `FOOD`, `ACCOMMODATION` |
| `Offering`                     | Add `vouchCount`, `vouches`, `avgRating`, `reviewCount`, `reviews`, `sustainabilityTag`                                              |
| `Vouch` (new)                  | `id`, `offeringId`, `voucherArea`, `source`, `createdAt`                                                                             |
| `VouchSource` (new enum)       | `SURVEY`, `NOMINATION`                                                                                                               |
| `Review` (new)                 | `id`, `bookingId` (unique), `offeringId`, `travellerId`, `rating`, `comment`, `createdAt`                                            |
| `SustainabilityTag` (new enum) | `LOW_IMPACT_TRAVEL`, `SUPPORTS_LOCAL_LIVELIHOODS`                                                                                    |
| `Booking`                      | Add `review` (back-relation)                                                                                                         |




## Not addressed here

- API routes for creating a `Vouch` or `Review` (`/api/v1` additions — Henry's area per `docs/TECH_STACK.md`'s API table).
- The nominate-a-local UI flow, if that's the chosen vouch data source — undecided per `PRD-context.md`.
- Anything on the supply side (Host, Marlon's area) — this doc is demand-side only.

