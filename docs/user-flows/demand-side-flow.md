# Demand-side user flow

Source of truth for what Francois builds on the demand (traveler) side. Derived from discussion 2 (2026-09-18). Supply-side onboarding, WhatsApp look-and-feel, and backend/storage are out of scope for this doc — see Henry/Marlon's tracks.

## Core MVP flow (must build, in order)

This is the sequence agreed as the non-negotiable baseline — "can I browse, book, pay, see it in my itinerary, and review it."

1. **Browse listings**
   - Traveler lands on the marketplace view, sees all available experiences (tours, food, transport, accommodation, security/concierge — anything a local supplier listed).
   - No login required to browse.
   - A persistent bottom tab bar (Explore, Trips, Bookings, Profile) frames every traveler screen, not just this one — Explore is the tab the traveler lands on, matching the pattern in comparable apps (see detailed doc, step 1).

2. **View a listing**
   - Click into an experience card → detail view.
   - Shows: description, price, photos, meeting point, supplier info.
   - Filtering/search on this view is a stretch goal, not core — core is just "can I see the listing."

3. **Book it**
   - Traveler selects the experience and confirms a booking.

4. **Pay for it**
   - QR-code based payment (SnapScan-style), or equivalent stubbed/mocked flow.
   - No custom payment portal needs to be built — assume/stub an existing rail (SnapScan or "Send Money to cell number" for unbanked suppliers on the receiving end — that's a supply-side concern, not demand-side UI).

5. **View booked experiences in an itinerary view**
   - A simple list/timeline of what the traveler has booked — dates, times, experiences.
   - This is the "did it work" moment — not the drag-and-drop builder (that's nice-to-have, see below).
   - Lives on the **Bookings** tab (see step 1's tab bar) — the Trips tab is the pre-booking co-create surface, Bookings is post-checkout.

6. **Review the experience**
   - Post-experience rating/review.
   - Called out explicitly as a trust/verification signal for the marketplace, not just feedback — reviews are what let travelers trust unverified/informal local suppliers.
   - Same Bookings tab as step 5 — reviewing hangs off a completed booking in that list, not a separate screen.

## Nice-to-have (only after core flow works)

Explicitly deprioritized in the discussion — do not start these until steps 1–6 above work end-to-end.

- **Drag-and-drop itinerary builder** — visual timeline with start/end dates, drag experiences into slots.
- **Co-created itineraries** — invite friends/family, shared timeline, crew voting to lock in activities.
- **Stokvel / escrow group payment** — pooled fund, debit-order contributions ahead of a trip, held in escrow until the trip.
- **Search by interests/passions** — surfacing experiences that match traveler-stated interests.
- **Self-guided/geofenced audio tours** — GPS-triggered commentary at checkpoints, offline-capable.
- **Offline mode** — itinerary, translator, and photo storage available without connectivity (flagged as important for real-world travel, but not required for the hackathon demo).
- **Currency conversion / travel wallet** — auto-converting global wallet, raised as a trend but explicitly parked as a feature, not the differentiator.

## Explicit non-goals for demand-side UI

- No custom payment gateway — use/stub an existing QR rail.
- No WhatsApp Business API integration on the demand side (that's a supply-side onboarding concern, and even there it's "look and feel" only, not real WhatsApp).
- Not competing with Airbnb Experiences or "best of Cape Town" search — demand-side listings surface supply that's specifically excluded from those (unbanked, no digital presence, local-only).

## Why this order

Per the discussion: features vs. the core problem are different things, and judges won't be impressed by itinerary bells and whistles if the basic marketplace loop (browse → book → pay → review) doesn't work. Reviews matter more than usual here because the trust/verification problem is central to the pitch — travelers are booking informal, unverified local suppliers, so review visibility is part of the safety story, not just UX polish.

## Open questions / not yet decided

- Whether any filtering (cost, impact, sustainability) ships in the listing view for the hackathon, or is presentation-only ("we'd filter by these in v2").
- Exact shape of the itinerary view (flat list vs. calendar/timeline) for MVP — timeline visuals are explicitly a stretch, so default to the simplest list that satisfies "can I see what I booked."
- Tech stack is Next.js (single repo, API routes in-repo), Postgres + SQLite for offline-first — confirm with Henry's scaffold once pushed.
