# Demand-side flow — detailed (with UX research)

Working doc that fleshes out [demand-side-flow.md](demand-side-flow.md) with research on familiar patterns, so our flow is instantly legible to travelers while making our unique bits (trust/impact signals, informal suppliers) intentional rather than accidental gaps.

Research method: [Mobbin MCP](https://mobbin.com) searches against comparable apps (Airbnb Experiences, Viator — both "browse local experiences/tours" marketplaces). Filled in one step at a time, per core MVP loop order.

Status key: 🟩 researched · ⬜ not yet researched

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

## 2. View a listing ⬜

Not yet researched. Source flow doc: click into card → detail view showing description, price, photos, meeting point, supplier info. Filtering/search on this view is a stretch goal.

---

## 3. Book it ⬜

Not yet researched. Source flow doc: traveler selects the experience and confirms a booking.

---

## 4. Pay for it ⬜

Not yet researched. Source flow doc: QR-code based payment (SnapScan-style) or equivalent stubbed flow. No custom payment portal.

---

## 5. View booked experiences in an itinerary view ⬜

Not yet researched. Source flow doc: simple list/timeline of booked experiences — the "did it work" moment, not the drag-and-drop builder.

---

## 6. Review the experience ⬜

Not yet researched (UX/flow still open). Data model resolved: see [demand-side-schema-requirements.md](demand-side-schema-requirements.md) — a `Review` model tied to a completed `Booking`, with `Offering.avgRating`/`reviewCount` denormalized for card display. Source flow doc: post-experience rating/review — explicitly a trust/verification signal, not just feedback.

---

## Running list of gaps/decisions surfaced by research

| # | Gap or decision | Status |
|---|---|---|
| 1 | Browse card needs a trust/impact signal with no direct comparable in Airbnb/Viator — must be designed intentionally | Resolved — vouch count + provenance (`Vouch` model), see schema requirements doc |
| 2 | Verification + community-impact badge data provenance (what generates each badge) | Resolved — split into vouching (`Vouch`) vs. reviews (`Review`), see schema requirements doc |
| 3 | Cost/impact/sustainability filtering, and how it relates to Airbnb-style dates/guests/sort | Resolved — sustainability kept as a display-only optional field, not a filter (see schema requirements doc); dates/guests/sort remain UI-only, no filter pipeline change |
| 4 | Clicking into a card (step 2, "View a listing") | Not yet researched |
| 5 | `Offering.category` enum too narrow for the sectioned feed (missing FOOD, ACCOMMODATION) | Resolved — see schema requirements doc |

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
