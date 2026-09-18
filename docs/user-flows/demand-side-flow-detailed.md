# Demand-side flow — detailed (with UX research)

Working doc that fleshes out [demand-side-flow.md](demand-side-flow.md) with research on familiar patterns, so our flow is instantly legible to travelers while making our unique bits (trust/impact signals, informal suppliers) intentional rather than accidental gaps.

Research method: [Mobbin MCP](https://mobbin.com) searches against comparable apps (Airbnb Experiences, Viator — both "browse local experiences/tours" marketplaces). Filled in one step at a time, per core MVP loop order.

Status key: 🟩 researched · 🟨 partially researched (scope/decisions resolved, comparable-app research still outstanding) · ⬜ not yet researched

---

## 1. Browse listings 🟩

**Source flow doc (unchanged):**
- Traveler lands on the marketplace view, sees all available experiences (tours, food, transport, accommodation, security/concierge — anything a local supplier listed).
- No login required to browse.

**Comparable apps researched:** Airbnb Experiences, Viator (both iOS) — closest real-world analogues since they're literally "browse local experiences/tours as a traveler" marketplaces.

**Common pattern observed:**
- **Card grid**, typically 2 columns: photo → rating (★ + review count) → duration → title → "From $X / person"
- **Heart/save icon** on the top corner of every card (wishlist), independent of login in Airbnb's case
- **Top filter bar** as a persistent pill/bar: location + dates + guest count (Airbnb), or search bar + chips for Dates/Duration/Languages/Sort (Viator)
- **Bottom tab bar**: Explore/Search is home, alongside Wishlist/Saved, Bookings/Trips, Profile — browse is the tab you land on, not buried

### Decision: bottom tab bar (built)

Gap identified late — the tab bar itself hadn't been added to the build even though DESIGN.md already fully specs it (`bottom-nav`, line 647: 64px white bar, top hairline, traveller tabs Explore/Trips/Bookings/Profile, icon above a 14px label, active state in `primary-text` with a filled icon glyph). No new research needed; this was a spec that existed but wasn't wired up.

**Built:**
- `src/core/layout/BottomNav.tsx` — client component (`usePathname` for active-tab state), four tabs: Explore → `/traveller/explore`, Trips → `/traveller/trips`, Bookings → `/traveller/bookings`, Profile → `/traveller/profile`.
- `src/app/traveller/layout.tsx` — wraps every route under `/traveller` so the bar is present on all of them, not just Explore.
- Route constants (`ROUTES.bookings`, `ROUTES.profile`) added to `core/constants/route.constant.ts`; both are now in `TRAVELLER_ROUTES` so the auth-role redirect matrix in `middleware.ts` covers them.
- Trips, Bookings and Profile are stub pages ("Coming soon") for now — their real builds are separate, tracked work (Trips is step 3/5's day-timeline gap below; Bookings and Profile have no flow-doc step yet). This change is scoped to making the tab bar itself real, not building out each destination.

**Fixed as part of the same change:** the listing detail page's `sticky-book-bar` was `fixed bottom-0`, which the new nav bar (also fixed, `bottom-0`) would have sat on top of. Moved the book bar to `bottom-16` (clearing the 64px nav) and increased the page's bottom padding accordingly.

**What this means for our build:**
- Copy the card vocabulary directly — photo, rating, duration, price/person is a solved pattern travelers already read fluently. Not a place to differentiate.
- No-login browsing is consistent with both comparables — they gate personalization (saved dates/guests) behind login/search, not the browse view itself. Confirms our non-negotiable is aligned with existing user expectation, not a novel ask.

**Gap identified (deliberate deviation, not an oversight):**
- Neither Airbnb nor Viator surfaces trust/impact signals on the browse card — only star rating. Our positioning leans on trust/inclusion (unbanked, informal, community-impact suppliers) as the differentiator, so the card likely needs **one additional line or badge** (e.g. "Verified via community" / impact tag) that has no equivalent in either comparable. This should be a deliberate design decision, not left implicit.

**Decisions (confirmed by Francois):**
- Card grid layout: **1 column, wide card** (not 2-column grid) — confirmed against [Viator's Activity detail flow](https://mobbin.com/flows/8f0aa99b-1758-4e76-a9a2-1727ca39d9a6), which is the closest match to what we need.
- Listing detail view opens with a **hero image** at the top, same pattern as that Viator flow.
- Layout pattern from the "common pattern observed" section above (rating, duration, title, price/person) still stands — only the column count/card width changes, not the card content vocabulary.

**Reference flows pulled:**
- [Airbnb — Experience detail](https://mobbin.com/flows/c0e1d7e3-d5d7-430f-b76d-41c98a77b79e)
- [Airbnb — Searching experiences](https://mobbin.com/flows/18079481-8c64-4dad-8511-fd0f9de1c7cb)
- [Viator — Activity detail](https://mobbin.com/flows/8f0aa99b-1758-4e76-a9a2-1727ca39d9a6)
- [Nextdoor — Listing detail](https://mobbin.com/flows/ccf893e0-67f1-4e69-8f47-45f2546782ec) (rougher/informal-marketplace comparable, not yet analyzed in depth)

### Decision: community verification + impact badge

Second research pass, specifically on trust/impact badges, against: [Too Good To Go — Local Hero](https://mobbin.com/screens/9ace4f51-ede0-434d-bd92-d03efe2bf471), [Airtasker — verification badges](https://mobbin.com/screens/020508dc-1558-4a51-9ff0-ac606bf21468), [DoorDash — profile badges](https://mobbin.com/screens/eceb8e84-62ea-4953-8d5a-cf06f15f7c5e), [Fiverr — Vetted Pro + Top Rated](https://mobbin.com/screens/af1504cd-9106-48af-98ba-8f84ca37a356).

**Chosen direction:** Fiverr's pattern — two small badges stacked/shown side by side on the same surface, rather than one badge trying to say both things:
- One badge for **verification** (a vetting/authenticity claim — closer to Airtasker's "Police Check"/"Digital iD" style, verified-by-someone-or-something)
- One badge for **community/impact** (a cause or community-standing claim — closer to Too Good To Go's "Local Hero" pill)

**Data provenance — resolved, see [demand-side-schema-requirements.md](demand-side-schema-requirements.md):** the "community/impact" badge is the PRD's **vouch count with provenance** ("37 Woodstock residents recommended this") — a pre-booking community endorsement, sourced from a survey or nomination flow, tracked by a new `Vouch` model. The "verification" badge is a separate concern from **reviews**, which are post-booking feedback tied to a completed `Booking` (flow-doc step 6) via a new `Review` model. These are two different mechanisms, not one badge derived loosely from "reviews and things" as first assumed in this research pass — see the schema doc for the full model definitions and the reasoning for keeping them separate.

### Decision: location picker

Confirmed against [Viator — Activity detail flow](https://mobbin.com/flows/8f0aa99b-1758-4e76-a9a2-1727ca39d9a6) (same reference flow used for the card/hero-image decisions above): browse leads with a **location picker**, same pattern as Viator — traveler picks/confirms a location before or alongside seeing listings, rather than assuming a single fixed city.

### Decision: empty states — keep simple

For sparse/early-stage inventory (few or no listings in a given location), keep the empty state simple. No further spec beyond that for now — not designing a rich empty-state experience for the hackathon MVP.

### Decision: sectioned feed for mixed listing types

Research pass against apps that mix genuinely different listing types on one browse surface: [Deliveroo home screen](https://mobbin.com/screens/f157dd7d-41a3-419e-a1a6-5953c403fe5f) (horizontal category tab bar — Restaurants/Groceries/Shopping/Reservations — switches feed content, one app shell), [Fiverr filter chips](https://mobbin.com/screens/9332045b-5647-480c-bd40-d4772f7b4e44) (Service type/Seller Level/Delivery Time chips pivot the same card shell across categories without changing its core shape), [Too Good To Go — "Local Heroes" + "Preferred pick-up windows"](https://mobbin.com/screens/1c9bd47f-c101-488f-b6ff-edbe91e1372b) (mixed content split into labeled, independently-scrollable horizontal sections rather than one uniform grid).

**Chosen direction:** section the browse feed by category (Too Good To Go pattern) — e.g. a "Tours" row, a "Food experiences" row, a "Transport" row — rather than forcing tours, transport, accommodation, and security/concierge into one identical card format. These categories have different core facts (duration vs. distance vs. per-hour rate) that don't map cleanly onto a single shared field.
**Fallback if sectioning is too much surface area for the hackathon timeline:** a single unified feed with a category tab switcher (Deliveroo pattern) instead of full sectioning.

### Decision: prototype winner — Variant B (single feed + filter chips)

Prototyped 3 layout variants (see [prototype capture note](#prototype-capture-browse-listings-2026-09-18) below) — sectioned rows, single feed + chips, and location-first hero. **Variant B won**: one vertical scroll of full-width cards, sticky category chips (incl. "All") at top filter the feed, location as a slim top-bar dropdown (not a full-screen gate).

**Not yet integrated into the prototype (follow-up work, not new decisions):**
- Fuller Airbnb-style search/filter bar — dates, guest count, sort, on top of the category chips already built. Only the location dropdown exists today.
- Clicking into a card — this is step 2 of the flow ("View a listing"), not yet researched or decided. Card is currently a dead end in the prototype.

### Remaining open gaps (not yet researched)

1. Filtering (cost/impact/sustainability) — MVP or pitch-only, still unresolved. Now sharpened by the above: does "filtering" mean Airbnb-style dates/guests/sort, or just cost/impact/sustainability tags? Both may be needed.

---

## 2. View a listing 🟩

**Source flow doc (unchanged):**
- Click into an experience card → detail view.
- Shows: description, price, photos, meeting point, supplier info.
- Filtering/search on this view is a stretch goal, not core.

**Comparable apps researched:** Airbnb Experiences, Viator (iOS) — same comparables as step 1.

**Common pattern observed (Mobbin: [Airbnb — Experience detail](https://mobbin.com/flows/c0e1d7e3-d5d7-430f-b76d-41c98a77b79e), [Viator — Activity detail](https://mobbin.com/flows/8f0aa99b-1758-4e76-a9a2-1727ca39d9a6), [Airbnb — Meet your host](https://mobbin.com/screens/d71700a0-2e5e-4274-9d02-75b399408802)):**
- Hero photo, then a **sticky bottom price bar** with the primary CTA ("Reserve" / "Show dates" / "Check availability") — pinned through the whole scroll, on every breakpoint observed.
- Title + duration/location directly under the hero.
- A **standalone trust-signal row** right below the title, before the long description — Airbnb shows this as icon + one-liner items ("Excellent value", "Top-rated Host", "Cancellation flexibility"), not folded into the star rating line.
- Long-form description ("What you'll do" / Overview), truncated with "Read more".
- **Meeting point as its own section with an embedded map pin + address** — not inline text.
- **Host/operator as its own card** — photo, name, verified/badge, rating, review count, years hosting or similar, then a short personal blurb ("Meet your host").
- **Reviews as its own section** — aggregate rating + count header, individual review cards, "See all" when long. Viator explicitly calls out review vetting ("We perform checks on reviews").

**What this means for our build — reconciling against the existing `listings/[id]/page.tsx` draft:**

A detail page already exists (built ahead of this research pass, same as browse-listings step 1's first draft). It already has the right overall shape — hero, title/location, description, host card with story, reviews list, price/Book CTA — but three gaps against the researched pattern, all confirmed as fixes:

1. **Meeting point gets a map.** `Offering.lat`/`lng` already exist and are optional in the schema — no migration needed. Confirmed by [DESIGN.md](../../DESIGN.md)'s Known Gaps section: a traveller-side map is already intended ("green markers on a desaturated tile"), it's host routes that explicitly ban map libraries (`CLAUDE.md`, DESIGN.md §Accessibility and Low Data — "No map tiles on the host side"). No conflict: this is `app/(traveller)`, not `app/(host)`.
2. **Trust signals get standalone treatment**, not folded into the rating line. Maps directly onto components DESIGN.md already specifies — `rating-row` (star + rating + review count) stays as its own line, and vouch count gets its own line/row rather than sharing the rating line, consistent with the two-badge decision already made for the browse card in step 1.
3. **The book CTA becomes a true sticky bottom bar on mobile.** DESIGN.md already specifies this exact component — `sticky-book-bar`: "80px white bar pinned to the bottom of listing detail with the lift shadow. Price and 'per person' left, a `button-primary-compact` 'Book' right." The Responsive Behaviour table confirms this is phone-width behavior specifically ("booking card becomes the sticky bar"); desktop keeps the two-column layout with the booking card in the right-hand sticky sidebar (already built). No new decision needed — this is implementing a component that was already specced but not yet used.

**Decisions (confirmed by Francois):**
- Add the map to the meeting-point section (accept the map-library cost — no library chosen yet, pick the lightest option that renders a single pin).
- Vouch count and verification badge get standalone visual weight, separate from the star-rating line, on the detail view — not just on the browse card.
- Implement `sticky-book-bar` per DESIGN.md's existing spec for phone width; keep the existing sticky sidebar card for desktop/tablet.

**Gap identified and now closed — DTO/API layer:**
- `listings/[id]/page.tsx` currently calls `getOfferingDetail` (a feature service) directly from a Server Component, bypassing `shared/dto`'s "one zod schema per DTO" convention and the `/api/v1` route pattern the rest of the app follows. No `OfferingDetail` schema exists in `shared/dto/offering.dto.ts` — only `offeringSummarySchema` for the list view. Fixing this now: add an `offeringDetailSchema` to `shared/dto/offering.dto.ts` and a `GET /api/v1/offerings/[id]` route, following the same `{ data }` / `{ error }` response shape as the existing offerings list route. This is a `shared/dto` + `api/v1` change — Henry's ownership area per `CLAUDE.md`'s table — flagging before making it.

**Not yet integrated into the prototype (follow-up work, not new decisions):**
- Review vetting language (Viator's "We perform checks on reviews") — no equivalent claim we can make yet since our `Review` model has no moderation step; parking as a copy decision for later, not blocking.
- Filtering/search on this view remains a stretch goal per the source flow doc — untouched by this research pass.

---

## 3. Book it 🟩

**Source flow doc (unchanged):** traveler selects the experience and confirms a booking.

**Resolved first — what "book it" actually means here:** the source flow doc's wording ("selects the experience and confirms a booking") reads like a single-listing checkout, but neither the schema nor the PRD supports that path. The only route that creates a `Booking` is `POST /trips/:id/checkout`, which fires "one booking per locked block" (TECH_STACK.md's API table), and a block only exists on a locked `Trip` that went through add → vote → lock (PRD → Co-create the itinerary; must-demo #5). There is no schema path from "tap Book on a listing" straight to a `Booking` row. Confirmed with Francois: step 3 targets the real trip flow, not a shortcut — the "Book" CTA's job is to get the offering onto a trip as a `TripBlock`, not to create a `Booking` directly. Voting, locking and checkout (which is where `Booking` rows actually get created, and which triggers step 4's pot) are later flow-doc steps, out of scope for this step's build even though they're touched on below for sequencing.

**Known gap going in:** DESIGN.md line 814 already flags this — "the PRD's must-demo list includes a shared day timeline with blocks, a simple vote and a lock... None of those components are specified here yet: day timeline, trip block, vote control, locked state." Step 3 is where that gap has to close, at least for the add-to-trip part of it.

**Current code state (confirmed before planning):** no `trips/` or `bookings/` routes exist under `app/(traveller)/` yet; no `trip.service.ts` or `booking.service.ts` under `core/services/`; no trip/booking zod schemas under `shared/dto/`. The listing detail page's "Book" button (`listings/[id]/page.tsx`, both the desktop sticky sidebar and the mobile `sticky-book-bar`) is a plain `<button>` with no handler — dead, decorative, waiting for this step. The Prisma schema already has `Trip`, `TripMember`, `TripBlock`, `Vote` fully modeled, so nothing here needs a migration.

### What "Book it" covers for this step

1. Tapping **Book** on a listing needs a trip to add itself to. First-time flow: no trip exists yet → prompt to start one (name, dates) → the offering becomes its first block. Returning flow: an open, unlocked trip already exists → add directly, or choose which trip if the traveler is on more than one.
2. Landing surface for "what's on my trip so far" — the day timeline. This is `/trips/[id]`, per TECH_STACK.md's route table, and is the DESIGN.md gap (trip block, day timeline) that needs closing.
3. Explicitly **not** in this step: voting UI, locking, checkout, the pot. Those are real later steps in the flow doc's own numbering (pay-for-it is step 4) and PRD must-demo items #5/#6 — pulling them in here would blur step boundaries the doc has kept clean for steps 1–2.

### Research (comparable apps, Mobbin)

Mobbin was reachable this pass — retried the two hunches from the previous session plus a first-trip empty state, against real screens/flows this time.

**Comparable apps researched:** Airbnb (save-to-wishlist), Wanderlog, Pangea, Viator (itinerary view), Tripsy, Tripadvisor, Vrbo (trip creation), Navan, Polarsteps (add-to-trip bottom sheets).

**Common pattern observed — the "add to X" bottom sheet (Mobbin: [Airbnb — Saving a listing to wishlist](https://mobbin.com/flows/bc4355c5-ff64-4f7c-8108-1760a654883c), [Navan — Add to trip](https://mobbin.com/screens/ce95cb3f-9568-4415-8609-2c6a31235264), [Pangea — Add to Trip](https://mobbin.com/screens/4ae04e0d-fe71-4b71-a2d1-0ebe4ab43d32), [Polarsteps — Add a spot](https://mobbin.com/screens/32c19338-c68a-4aa9-a936-487db3fc085b)):**
- **This confirms the hunch: it's a bottom sheet, not a navigated screen.** Every comparable — a generic wishlist (Airbnb), a business trip tool (Navan), and two dedicated trip planners (Pangea, Polarsteps) — surfaces "add to X" as a sheet layered over the current screen, not a new route. None of them navigate away from the item being added.
- The sheet's primary job is **picking a destination for the item**: an existing trip/list (shown as a named row, e.g. "New York 2025 · 4 saved") or "Create new" inline, without leaving the sheet. Airbnb's flow is a clean 3-step version of this: tap save → sheet lists existing wishlists + "Create new" → typing a name and confirming creates it and immediately shows "Saved to [name]" back on the original screen.
- Secondary, optional fields appear **inside the same sheet**, not as a separate step: Pangea's "Add to Trip" sheet has a type toggle (Spot/Accommodation/Custom), a Want-to-go/Been toggle, then optional "When", "Note", "Link" fields, all collapsed behind "+ Add" buttons rather than shown as empty inputs.
- After confirming, the origin screen shows a **lightweight inline confirmation** ("Saved to New York 2025 · Change") rather than a route change or a modal — the traveler stays exactly where they were.

**Common pattern observed — day-by-day itinerary (Mobbin: [Wanderlog — Itinerary](https://mobbin.com/flows/88a3eab3-6cca-496f-a3cb-bca2011df206)):**
- Wanderlog's itinerary is **tabbed by day** (`Mon 12/1`, `Tue 12/2`, ...) with a horizontally scrollable day-selector strip, not one long scroll — this is the closest real analogue to the day-timeline gap DESIGN.md flags.
- Each day is a vertical list of numbered stops in visit order, each with a thumbnail, name, one-line description, and a time; an "Add a place" affordance sits inline under the day's stop list, not just as a global FAB.
- Flights/lodging get their own distinct row treatment (icon + check-in/check-out) inside the same day list, rather than a separate section — relevant since our trip blocks are mixed-category too (tours, food, transport, accommodation).

**Common pattern observed — first trip / empty state (Mobbin: [Tripsy — Creating a trip](https://mobbin.com/flows/164d40f3-5c8c-4afd-951a-6a0983f48062), [Vrbo — Creating a trip](https://mobbin.com/flows/b878a72d-ea73-425b-8850-d1bd6bb54f21)):**
- First-time empty state is a single clear CTA ("Create a Trip" / "Plan a trip") over short reassurance copy — no multi-field form shown before the CTA is tapped.
- Creation itself is minimal: name + a date-range picker (calendar UI, start/end tap), matching exactly the "name, dates" minimum this doc already scoped — not more fields than that.

**What this means for our build:**
- **Decision made:** the "Book" CTA opens a **bottom sheet** over the listing detail page — not a navigated screen. This is now grounded in four comparables (Airbnb, Navan, Pangea, Polarsteps), not instinct.
- Sheet content, in order: pick an existing open trip (row per trip, e.g. "Cape Town, 12–15 Oct") or "Start a new trip" inline (name + date range, Tripsy/Vrbo pattern) → confirm → offering becomes a `TripBlock` via `POST /trips/:id/blocks` (or `POST /trips` first, for a new trip) → sheet closes, listing page shows an inline "Added to [trip name] · Change" confirmation in place of the Book button, Airbnb-wishlist-style.
- The day-timeline (`/trips/[id]`) should follow Wanderlog's tabbed-by-day pattern, not one long scroll — a horizontally-scrollable day strip with numbered stops underneath. This is the concrete shape for the DESIGN.md gap (day timeline, trip block) once this step's build reaches that surface.
- No comparable exercises optional fields (note, custom time) beyond what's needed here — `TripBlock.startTime` is optional in the schema and can stay a collapsed "+ Add" affordance per the Pangea pattern, not a required field on the sheet.

### Not yet integrated / follow-up work

- Voting UI and lock — separate design pass, needed before step 4 (pay for it) can open a pot on a locked trip. Not covered by this research pass.
- Trip creation UX beyond the minimum (name + dates) — e.g. inviting others via `shareCode` — is part of the same must-demo #5 surface but not required just to get a listing onto a trip.
- `POST /trips`, `POST /trips/:id/blocks`, `GET/POST` trip routes and `shared/dto` trip schemas don't exist yet — needed to implement this step, not yet built.
- The day-timeline surface itself (`/trips/[id]`) is scoped in direction (Wanderlog's day-tab pattern) but not yet detailed screen-by-screen — this research pass covered the add-to-trip sheet in full but only sized the day-timeline destination.

---

## 4. Pay for it ⬜

Not yet researched. Source flow doc: QR-code based payment (SnapScan-style) or equivalent stubbed flow. No custom payment portal.

---

## 5. View booked experiences in an itinerary view ⬜

Not yet researched. Source flow doc: simple list/timeline of booked experiences — the "did it work" moment, not the drag-and-drop builder.

**Tab mapping (resolved):** this lives on the **Bookings** tab, not a new tab and not the Trips tab. `Trips` (`/trips/[id]`) is the pre-booking, co-creating surface — add/vote/lock `TripBlock`s on an unlocked trip (step 3). `Bookings` (`/traveller/bookings`) is the post-checkout surface — actual `Booking` rows, created one-per-locked-block at checkout (step 4), fetched via the existing `GET /bookings?role=traveller` contract (TECH_STACK.md's API table). The bottom-nav's four tabs (Explore, Trips, Bookings, Profile — see the tab-bar decision under step 1) already account for this split; step 5's build target is filling in the `/traveller/bookings` page (currently a stub, see step 1's tab-bar decision) with this list/timeline.

---

## 6. Review the experience ⬜

Not yet researched (UX/flow still open). Data model resolved: see [demand-side-schema-requirements.md](demand-side-schema-requirements.md) — a `Review` model tied to a completed `Booking`, with `Offering.avgRating`/`reviewCount` denormalized for card display. Source flow doc: post-experience rating/review — explicitly a trust/verification signal, not just feedback.

**Tab mapping (resolved):** same Bookings tab as step 5, not a separate surface — the review action hangs off a completed `Booking` row in that same list (e.g. a "Leave a review" affordance on bookings whose status is `COMPLETED`). Steps 5 and 6 are two states of one Bookings-tab build, not two separate destinations.

---

## Running list of gaps/decisions surfaced by research

| # | Gap or decision | Status |
|---|---|---|
| 1 | Browse card needs a trust/impact signal with no direct comparable in Airbnb/Viator — must be designed intentionally | Resolved — vouch count + provenance (`Vouch` model), see schema requirements doc |
| 2 | Verification + community-impact badge data provenance (what generates each badge) | Resolved — split into vouching (`Vouch`) vs. reviews (`Review`), see schema requirements doc |
| 3 | Cost/impact/sustainability filtering, and how it relates to Airbnb-style dates/guests/sort | Resolved — sustainability kept as a display-only optional field, not a filter (see schema requirements doc); dates/guests/sort remain UI-only, no filter pipeline change |
| 4 | Clicking into a card (step 2, "View a listing") | Resolved — sticky book bar, standalone trust row, meeting-point map; see step 2 above |
| 5 | `Offering.category` enum too narrow for the sectioned feed (missing FOOD, ACCOMMODATION) | Resolved — see schema requirements doc |
| 6 | Listing detail page built ahead of research, reaches `shared/dto`/`api/v1` directly from a Server Component with no zod schema or route | Resolved — adding `offeringDetailSchema` + `GET /api/v1/offerings/[id]`, see step 2 above |
| 7 | Source flow doc's step 3 ("traveler selects the experience and confirms a booking") implies single-listing checkout, but the schema/API only create a `Booking` via trip checkout on a locked block | Resolved — step 3 targets add-to-trip (`TripBlock`), not direct booking; see step 3 above |
| 8 | DESIGN.md's day-timeline/trip-block/vote/lock components are unspecified (line 814) | Partially resolved — add-to-trip is a bottom sheet (researched, see step 3), day-timeline sized to Wanderlog's day-tab pattern but not detailed screen-by-screen; vote/lock still fully open, deferred to a later step |
| 9 | Bottom tab bar (Explore/Trips/Bookings/Profile) was specced in DESIGN.md but never wired into the build | Resolved — built, see "Decision: bottom tab bar (built)" under step 1. Trips/Bookings/Profile are stub destinations pending their own builds |
| 10 | Whether steps 5 (view booked experiences) and 6 (review) need their own tab, beyond the four already built | Resolved — no new tab. Both are states of the existing **Bookings** tab (`/traveller/bookings`, currently a stub); Trips stays the pre-booking co-create surface. See tab-mapping notes under steps 5 and 6 |

---

## Prototype capture: browse listings (2026-09-18)

**Question the prototype answered:** does the sectioned-feed / wide-card / dual-badge layout for step 1 feel right before building it for real?

**Method:** 3 structurally different variants built as a throwaway Next.js route (`/prototype-browse-listings`, switchable via `?variant=A|B|C`), per the `prototype` skill:
- **A — Sectioned rows**: horizontal category rows (Too Good To Go pattern), location as a slim top-bar dropdown.
- **B — Single feed + filter chips**: one vertical scroll of full-width cards, sticky chips filter by category, location as a slim top-bar dropdown.
- **C — Location-first hero**: full-screen location gate before any listing renders, then category tabs + feed.

All three shared the same `ListingCard` (photo, dual mocked trust badges, ★rating + reviews, duration, "From R$/person") and the same 9-listing mock dataset across 5 real categories plus a deliberately-empty 6th ("Wellness") to exercise the empty-state pattern.

**Verdict: Variant B won.** Single vertical feed with sticky category filter chips, not sectioned rows, not a location gate.

**Follow-up round (same session):** folded into Variant B directly on `feature/demand` (no separate prototype round) —
- Fuller Airbnb-style search/filter bar: location dropdown, a stubbed/disabled "Any dates" control (not wired up), a guest-count stepper that actually filters (`maxGuests`), a sort dropdown (Recommended / Price low-high / Price high-low / Top rated), and a second chip row for sustainability tags ("Low-impact travel" / "Supports local livelihoods") — deliberately modeled as data separate from the two trust badges, since "does this match my filter" and "is this supplier trustworthy" are different questions.
- Clicking a card now navigates to a stub detail page (`/prototype-browse-listings/listing/[id]`) showing just photo + title, explicitly labeled as a stub — step 2 ("View a listing") itself is still not researched/designed.

**Where the code lives / cleanup note:** the losing variants (A, C) and the `PrototypeSwitcher` were deleted directly from `feature/demand` without first capturing them to a throwaway branch (explicit user call — normally the prototype skill captures the full variant set to a throwaway branch before deleting losers; skipped here to move faster). If A/C are wanted again, they'd need to be re-derived from this doc's earlier description of each, not recovered from git. Surviving files: `page.tsx`, `VariantB.tsx`, `ListingCard.tsx`, `mock-data.ts`, `listing/[id]/page.tsx`.
