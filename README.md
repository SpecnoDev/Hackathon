# Local Experience Marketplace — working name TBD

Name candidates are in `docs/PRD-context.md`, under "Open items (hour 0)".

"A marketplace that removes the technological and financial barriers on both sides of local South African tourism: hosts list by voice and get paid without a bank account, and groups of friends and family co-create their journey and pay for it together, stokvel-style, so nobody has to front the bill."

## Demo

TBD

- [ ] Screenshots (2–4)
- [ ] Screen recording link
- [ ] Prototype URL

## The problem

Tourism is one of South Africa's largest job-creating sectors, but its benefits concentrate in hotels, franchises and established operators. The local guide, taxi driver, home cook and crafter are excluded on three fronts: technology (entry-level Android, prepaid data, more comfort speaking than typing), finance (unbanked, paid in cash), and trust (no way to be found or trusted by a stranger). Travellers get a sanitised, operator-led version of the country instead. Groups of friends and family have no good way to plan a journey together, agree on it, and pay for it without one person carrying the cost.

## What we built

**Shipped so far** (Fri 18 Sep, ~13:00)

- Next.js 15 scaffold with the `src/core` / `src/features` / `src/shared` structure from `CLAUDE.md`.
- WhatsApp onboarding bot — a Meta Cloud API webhook walks a host through KYC steps (name, SA ID with checksum validation, email, service area, ID photo), Claude structures the host's own words into offerings with categories and rates, and the profile posts to a mock registry. See `SETUP.md`.

**Targets for submission** (the PRD's must-demo list — targets, not claims)

- [ ] Host onboarding with phone OTP (mocked) and language selection
- [ ] Voice-to-listing in at least one language beyond English
- [ ] Host earnings and payout screen with "you will receive Rx" before publishing and a completed payout to a phone number
- [ ] Traveller marketplace across 3–4 SA regions with listing detail, host story and verification badge
- [ ] Group itinerary — shared day timeline, drag-and-drop or tap-to-add, vote, lock
- [ ] Stokvel-style group payment — a pot opens for the locked itinerary, split per person; each traveller pays their share from their own phone (mock); progress visible; bookings confirm when full. Host accept from the app; WhatsApp accept as a mock message
- [ ] Seed data — 10–20 realistic listings in real places

## How it works

- One PWA, two shells: host (chat-style, under 500 KB first load) and traveller (visual timeline).
- Voice note → Google Speech → Claude drafts the listing → host reviews one field per screen → publish.
- Supabase Postgres via Prisma, Supabase Auth and Storage, `/api/v1` route handlers over `core/services`.
- IndexedDB outbox so drafts and bookings survive no signal.
- Payments mocked. The locked itinerary opens a stokvel-style group pot — each traveller pays their share, bookings confirm when it fills. Money is integers in cents; the pot filling and the payout landing are the two demo moments.

Full detail: `docs/TECH_STACK.md`.

## Running it

```bash
git clone git@github.com:SpecnoDev/Hackathon.git && cd Hackathon
npm i
cp .env.example .env     # fill in the shared values
npm run dev              # http://localhost:3000
npm run tunnel           # HTTPS URL for a phone or the Meta webhook
```

The WhatsApp bot needs the Meta test-number setup in `SETUP.md` (~20 min, no business verification). The Prisma/Supabase steps in `docs/TECH_STACK.md` → Setup apply once those packages are added.

## Team

**Name:** TBD

- Marlon — supply side: the host PWA
- Henry — tech stack and platform (auth, API, AI); WhatsApp onboarding
- Francois — demand side: the traveller PWA
- Miles — team captain; PRD, product documentation, presentation
- Brandon — UI and design lead

## Docs

`docs/README.md` is the index.

- `docs/PRD.md` — the spec, decision of record (Miles)
- `docs/PRD.md.pdf` — earlier export, superseded by PRD.md
- `docs/PRD-context.md` — why, backlog reasoning, hour-0 open items, superseded session positions (Marlon)
- `docs/TECH_STACK.md` — stack, schema, API contract, repo layout (Henry)
- `docs/glossary.md` — shared terminology (Francois)
- `CLAUDE.md` — code conventions
- `SETUP.md` — WhatsApp bot setup and test script

## Branching

`main` is the trunk and always runs. `feature/supply` (Marlon) and `feature/demand` (Francois) are long-lived — sub-features branch off them and merge back. Platform work (schema, `shared/dto`, guards, `api/v1`, seed) goes straight to `main`. Integrate at the hour 14–16 checkpoint. Commit frequently — one large late commit reads as pre-built work.

## What's next

- Tiered KYC with a real provider, real cash-send payouts, and escrow for pooled group funds.
- A recurring travel stokvel; WhatsApp as an onboarding channel; offline sync; the community endorsement flow.

## Event details

- **Event:** Builders Table 2026, organised by MakeReign
- **Location:** Parkview, Woodstock, Cape Town — in person only, no remote participation
- **Format:** 3–5 people per team, 16–20 teams, ~100 participants, R500 per person
- **Theme:** intersection of AI and digital product — software, not hardware
- **Deliverable:** a working prototype (web, mobile, or agent) plus a
  five-minute pitch covering problem, target audience, approach, and next steps
- **Judged on:** does it work, is the problem real, how does it look, how is
  it presented
- **Judging format:** repo-first — all teams submit their repository by
  **11:59 Saturday**; judges review the submitted repos and select finalists
  from them; only finalists then present at 13:00
- **Prize:** R50,000 cash to the winning team; team retains full IP
- **Rule:** no pre-built project work — repositories are reviewed at submission

### Schedule — Friday 18 September

- 08:00 — Registration & check-in
- 08:45 — Welcome & opening
- 09:00 — Challenge brief revealed
- 10:00 — Build sprint 1
- 12:00 — Lunch
- 12:30 — Build sprint 2
- 15:00 — Break
- 15:15 — Build sprint 3
- 16:45 — Day 1 checkpoint & submission
- 17:00 — Networking & dinner
- 18:00 — Evening sprint (until late)

### Schedule — Saturday 19 September

- 08:30 — Doors open
- 09:00 — Welcome back & final brief
- 09:30 — Build sprint 4
- 11:30 — Submission window opens
- **11:59 — SUBMISSION CLOSES (final deadline)**
- 12:00 — Lunch
- 13:00 — Finalist presentations & awards
- 16:30 — Cocktail hour
- 18:00 — Afterparty

## Status

**Submission deadline: 11:59 Saturday 19 September — no extensions.**

Brief revealed 09:00 Friday 18 September; build under way.

Commit frequently throughout the event — a single large late commit looks
like pre-built work.

### Pre-submission checklist

- [x] Repo pushed to remote
- [ ] README filled in (pitch, demo, problem, what we built, how it works, running it)
- [ ] Screenshots added
- [ ] Demo clip linked
- [ ] Run instructions verified on a clean machine
