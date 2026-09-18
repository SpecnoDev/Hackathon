# Glossary

Shared terminology for the team. Source: discussion 1 & 2, demand-side flow docs, README.
Add to this as new terms come up — keep definitions short and specific to how *we* use the term, not a generic dictionary definition.

## Product concept

- **Demand side** — the traveler-facing half of the marketplace: browse, book, pay, view itinerary, review. Francois's track.
- **Supply side** — the local-entrepreneur-facing half: onboarding, KYC, listing services, managing bookings, receiving payment. Marlon/Henry's track.
- **Two-sided marketplace** — the overall product shape: supply (entrepreneurs) and demand (travelers) meeting on one platform.
- **Experience** — a single bookable offering from a supplier (a tour, cooking class, transport, accommodation, security/concierge, etc.). The core unit of listing.
- **Trickle-down (impact)** — the problem framing: tourism revenue currently concentrates in large hotels/conglomerates; the product's goal is to route financial benefit down to local, informal entrepreneurs.
- **Financial exclusion** — target suppliers are unbanked or under-banked and can't easily receive payment through normal merchant rails.
- **Technological exclusion** — target suppliers have no website, no Instagram, no Airbnb presence, and are generally not comfortable with self-serve tech platforms.
- **Green Market Square model** — sourcing approach where someone goes physically to an entrepreneur (e.g. a craft market vendor), photographs their goods/service, and builds their listing for them, since they won't self-list. Named after the Cape Town craft market used as the example.
- **Supplier acquisition** — how suppliers/entrepreneurs are found and brought onto the platform (Yazzie surveys, Facebook community groups, personal outreach). Explicitly out of scope to build for the hackathon — mention only in the pitch.
- **Aggregated community knowledge** — sourcing local suppliers by polling a community ("who runs the best tour here?") rather than relying on self-registration.
- **Yazzie** — reference model: a WhatsApp/SMS-based survey platform operating across Africa that pays respondents (~R10/survey) and aggregates answers for brands. Cited as inspiration for supplier-sourcing surveys.

## Trust & safety

- **KYC (Know Your Customer)** — identity verification step for suppliers before they can list an experience. Checks against blacklists/red lists/politically-exposed-person databases. MVP: manual verification of one ID, or stubbed; Stitch API is the real-world candidate.
- **Stitch** — South African identity-verification API considered for real KYC (paid, out of scope to integrate for the hackathon — mention as the intended real solution).
- **Verification badge** — UI signal on a listing indicating the supplier passed some vetting/authenticity check (distinct from the impact badge).
- **Community/impact badge** — UI signal on a listing indicating community standing or impact (e.g. sustainability, local enrichment). Both badges are meant to be derived from review data, not a separate workflow — exact derivation still undefined as of the discovery discussion.
- **Vetting** — human-in-the-loop safety check on a new supplier (e.g. a "dummy" trial run of their experience, checking equipment/route) — a proposed but unbuilt safety mechanism.

## Payments

- **QR-code payment / SnapScan-style flow** — the assumed/stubbed payment rail for the hackathon demo: traveler scans a supplier's QR code to pay. No custom payment gateway is being built.
- **Send Money (to cell number)** — proposed payout path for unbanked suppliers: money sent to a phone number, redeemable at any ATM without a bank account.
- **Stokvel** — South African informal group-savings/lending model; referenced as the inspiration for the "travel fund" feature (a group pools money toward a shared trip via debit-order contributions).
- **Travel fund / escrow** — nice-to-have feature: a shared pool of money (stokvel-style) that a group contributes to ahead of a trip, held until the itinerary is locked in.

## Demand-side flow terms

- **Browse → Book → Pay → Itinerary → Review** — the non-negotiable core MVP loop for the demand side, in this order. Everything else (drag-and-drop builder, crew voting, filters) is a nice-to-have layered on top.
- **Itinerary view** — the traveler's list/timeline of what they've booked. MVP is a simple list, not the drag-and-drop timeline.
- **Drag-and-drop itinerary builder** — nice-to-have: a visual timeline (start date → end date) where experiences are dragged into slots.
- **Co-created itinerary** — nice-to-have: multiple travelers (friends/family) collaboratively build one shared itinerary.
- **Crew voting** — nice-to-have: group members vote/poll on proposed experiences to lock them into a shared itinerary.
- **Review** — post-experience rating left by a traveler; explicitly framed as a trust/verification signal for informal suppliers, not just feedback — feeds the verification/impact badges.

## Supply-side flow terms

- **Onboarding (supplier)** — the flow a supplier goes through to register, verify identity (KYC), and list their first experience.
- **Conversational onboarding** — chat-style Q&A (WhatsApp-look-and-feel) used to build a supplier's profile instead of a traditional web form — "What's your name? What do you offer?" etc.
- **WhatsApp look-and-feel** — UI design choice: the supplier onboarding *looks and feels* like a WhatsApp chat for familiarity, but is actually a PWA screen, not the real WhatsApp Business API (ruled out — see below).
- **AI middle layer** — proposed AI step that takes a supplier's raw conversational answers and compiles them into a listing: writes the description, recommends pricing, generates a cover image.

## Technical / architecture terms

- **PWA (Progressive Web App)** — the chosen app format: installable via direct URL, no app store submission needed, works on low-end phones and works offline via a service worker. Requires a web manifest, a service worker file, and HTTPS.
- **Web manifest** — PWA config file specifying icon, theme colors, and install behavior.
- **Service worker** — script enabling a PWA's offline functionality (caching, background sync).
- **Offline-first** — architecture principle: writes go to a local SQLite store first, then sync to the central Postgres database once connectivity returns.
- **Next.js (single repo / full-stack)** — chosen framework: one repo holds both frontend and API routes, no separate backend service.
- **Feature branch** — per-workstream branch off `main` (e.g. `feature/demand`, `feature/supply`); sub-features branch off the feature branch and merge back in before the feature branch merges to `main`.
- **Work tree methodology** — working in parallel on independent components/prototypes, then pulling latest and integrating once a piece is ready, to avoid blocking teammates.
- **JTBD (Job To Be Done)** — used loosely in team planning to mean "the discrete task someone owns" (e.g. "my JTBD is the PRD").

## Roles (this hackathon team)

- **Team captain** — Miles: owns visibility/communication, PRD, and presentation.
- **Tech stack owner** — Henry: writes the tech stack doc, scaffolds the Next.js repo, explores the WhatsApp-look-and-feel onboarding PoC (time-boxed).
- **Supply-side frontend** — Marlon.
- **Demand-side frontend** — Francois.

## Event terms

- **Builders Table 2026** — the hackathon this project is being built for (organiser: MakeReign, Parkview/Woodstock, Cape Town).
- **MVP (this context)** — the minimum browse → book → pay → itinerary → review loop that must work end-to-end for the judged demo; distinct from "nice to have" features that are pitch-only or stretch goals.
