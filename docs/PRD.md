# Travel Hackathon PRD

2026-09-18 · Miles Wolfe (Specno) · Living copy: https://claude.ai/code/artifact/905d20e9-5c9f-48cd-b522-fbbea6ccdfb5

## One-Line Statement

A marketplace that removes the technological and financial barriers on both sides of local South African tourism: hosts list by voice and get paid without a bank account, and groups of friends and family co-create their journey and pay for it together, stokvel-style, so nobody has to front the bill.

Working name: TBD (see Decisions Needed). Everything below is a starting position for the 24-hour build; items marked *to validate* need a real-world check before they are stated as fact in the pitch.

**Why this wins.** Most travel hackathon entries will be traveller-facing apps that make booking prettier. Ours attacks financial inclusion at both ends. The demo has two money shots: a host speaking a voice note in isiXhosa on an entry-level Android and watching a payout land on her phone number, and a group of four friends filling a shared pot from four phones until the trip confirms itself. That is Idea, Design, Impact and Pitch in two 60-second sequences, and it lands squarely on the brief's themes of financial inclusion, experiential travel, sharing experience, and building for the journey, not the destination.

## The Problem

Tourism is one of South Africa's largest job-creating sectors, but its benefits concentrate in hotels, franchises and established operators. The people with the most authentic offering (the local guide, the taxi driver, the home cook, the crafter, the person who knows who to call) are structurally excluded from the platforms where travellers spend money. Money flows past the people who make a place worth visiting.

The exclusion has three causes, and the product must answer all three:

| Exclusion | What incumbents assume | Reality for the host |
| --- | --- | --- |
| Technological | Good smartphone, cheap reliable data, written English, photo editing, long web forms | Entry-level Android, a rationed prepaid bundle, patchy coverage, more comfort speaking than typing |
| Financial | Identity verified with a card; payouts to a bank account | Unbanked or underbanked, lives on cash, receives money via eWallet-style products |
| Trust | A brand, reviews and verification the host already has | No way to be found or trusted by a stranger, so demand never reaches them and the informal economy stays informal |

**The demand-side gap.** Travellers want authentic local experiences and will pay for them, but have no safe, trusted way to find, book and pay a local individual. They get a sanitised, operator-led version of the country instead. Groups of friends and family, in particular, have no good way to plan a journey together, agree on it, and pay for it without one person carrying the cost.

*To validate for the pitch:* current SA unbanked/underbanked share, tourism's contribution to GDP and jobs, and the share of tourism spend reaching township and rural economies. Use a sourced figure or say "approximately". Never an invented statistic on stage.

## Theme Alignment: The Journey, Not the Destination

The brief asks teams to build for the journey. Our product is about who a traveller spends the journey with, and about the journey a host takes from "I have something to offer" to "I have been paid". Both journeys are visible on screen in the demo.

| Brief theme | How we hit it |
| --- | --- |
| Experiential travel | Listings are people and their stories, not products; travellers choose a host |
| Eco / local travel | Spend stays in the community; low-data, low-footprint tooling |
| Learning as you travel | Cultural exchange, host storytelling, multilingual listings |
| Independent travel | Self-steered, drag-and-drop, group-voted itinerary |
| Sharing experience | Co-created group itinerary, shared pot, shareable links, two-way reviews, host stories |
| Financial inclusion | Voice-first onboarding, bank-account-optional payouts, tiered KYC for hosts; stokvel-style split payment for travellers |
| On-the-ground support | A named, verified local behind every experience; WhatsApp contact |
| Security | Tiered verification, share-trip, emergency button, regulated-category checks |
| Transport | A first-class listing category (taxi, bakkie, transfers) |
| Language barriers | Voice in the host's language, auto-translation both ways |
| Moments of memory | Photo/video-rich listings; post-trip reviews with photos |

## USP and Inclusion Principles

**The unique value is financial inclusion at both ends.** Every marketplace can show listings to travellers. Ours is built so that a person with an entry-level phone, no bank account and limited written English can go from "I have something to offer" to "I have been paid" without help, and so that a group of friends or family can go from "we should do something" to a confirmed, fully paid trip without one person carrying the cost.

Five pillars of the USP:

1. **Onboarding that meets people where they are.** Voice-first listing creation in the host's own language, one question at a time, on a low-data, offline-capable PWA, with WhatsApp and SMS as first-class channels. Community Champions (elected locally, surveyed via WhatsApp/Yazi or Facebook forums) act as the human on-ramp for hosts who need a hand.
2. **Verification that builds trust without re-excluding.** Tiered KYC: start with a phone number and an ID, earn trust through credentials *or* community endorsement rather than paperwork the host may not have.
3. **Payouts that work without a bank account.** Cash-send to a phone number, mobile wallets, retail cash pickup. Being unbanked is not a barrier to earning.
4. **Dignity and control.** Hosts see exactly what they earn in rand before publishing, own their listings, set their own prices and availability, and are treated as entrepreneurs, not gig labour.
5. **Group payment that works like a stokvel.** The itinerary opens a shared pot, split per person; everyone pays their share from their own phone; the trip confirms when the pot is full. Nobody fronts the bill, nobody chases, and hosts receive a confirmed, fully paid group.

**Mission:** reduce technological and financial exclusion in travel so lower-LSM South Africans can contribute to and benefit from tourism.

**Design principles.** Every feature in this PRD is held to these:

| Principle | What it means in practice |
| --- | --- |
| Low data | Supply-side first load under 500 KB; aggressive image compression on upload; no video autoplay; text-first screens |
| Offline first | Hosts can create/edit offerings and see bookings without signal; sync later; never lose work |
| Low literacy, low friction | Voice-first; one question per screen; big touch targets; icons with labels; EN/AF/XH/ZU at MVP, all 11 languages as the goal |
| Bank account optional | A host must be able to get paid without one |
| Entry-level device | Runs well on a ~R1,500 Android; PWA not app-store; WhatsApp/USSD for the lowest-tech hosts |
| Trust by design | Verification and safety protect both sides without becoming a barrier that re-excludes |
| Supply side first | When host simplicity and traveller convenience conflict, the host wins |

## Users

**Hosts (supply) are the primary user.**

| Host persona | What they offer | What they need |
| --- | --- | --- |
| The local guide | Walks, stories, the area, the people; may or may not be a registered guide | Flexible income; to show their place properly |
| The transport operator | Minibus taxi, bakkie, small-town e-hailing: airport runs, transfers, lifts to the trailhead | Bookings that fit around existing routes |
| The home cook or maker | Traditional meals, a shebeen, baking, brewing, crafts; small groups at home or a community venue | Simple availability; a fair price |
| The concierge | Knows who to call: arranges the braai, the boat, the choir, the farm visit | To sell access and coordination |
| The security escort | Foot or vehicle escort, night escort, event presence (regulated: PSIRA) | Credential-gated listing |
| The Community Champion | Elected by their community; onboards and vouches for neighbouring hosts | A simple champion view and endorsement power |

Shared traits to design for: entry-level Android, prepaid data, may be unbanked, prefers speaking to typing, low written English, high trust in WhatsApp and voice notes, paid in cash today, may share one phone within a household, may have a day job and limited availability.

**Travellers (demand).**

| Traveller persona | Wants | Needs |
| --- | --- | --- |
| International visitor | "Real" South Africa beyond the Waterfront and the lodge | Safety, English, clear expectations, card payment |
| Domestic traveller | Something local on a holiday, family visit or road trip | Easy discovery by place and route |
| Business traveller | A free evening or half day filled at short notice | Instant book, close by |
| Group organiser | A family trip, bachelor weekend or team offsite everyone agrees on | Co-created itinerary, group voting, split payment so nobody fronts the bill |

The group organiser is the demand-side persona the demo should centre. Today this person picks everything, pays everything and chases everyone; our co-created, voted itinerary and stokvel-style pot remove all three burdens. Add a fourth demand persona for the pitch: the domestic group that would never book a R2,400 experience on one card but will happily put in R600 each.

## Solution Overview

A two-sided PWA marketplace. Hosts list by voice and get paid to a phone number. Groups of friends and family co-create a journey from those listings, vote on it, and pay for it together stokvel-style, each contributing their share into a pot that confirms the bookings when full. The platform holds the money and releases it to the hosts after each experience happens.

~~~mermaid
flowchart LR
  A[Community surveyed<br/>WhatsApp / Facebook] --> B[Champion elected<br/>and inducted]
  B --> C[Host records voice note<br/>in own language]
  C --> D[AI drafts listing<br/>host reviews and publishes]
  D --> E[Travellers browse<br/>and co-build itinerary]
  E --> F[Group votes<br/>and fills the pot]
  F --> G[Host accepts<br/>via app or WhatsApp]
  G --> H[Experience happens]
  H --> I[Payout to phone number<br/>no bank account needed]
~~~

Reading left to right: supply is built by communities and champions, converted into listings by voice, consumed by groups planning and paying together, and closed by a payout the host can actually collect.

**Supply side.** Communities are reached through WhatsApp (Yazi) surveys or Facebook community forums and elect Community Champions. Champions are inducted through a conversational interview in a WhatsApp-like UI, then help onboard hosts around them. Any host can record a voice note describing what they offer; AI transcribes, translates and drafts the structured listing, which the host corrects and publishes. Verification is tiered so a phone number and ID are enough to start.

**Demand side.** Travellers browse listings by place, category or route, as a visual timeline. A group drags experience blocks onto a shared itinerary, votes, and locks it. A group pot opens for the total; each person pays their share from their own phone and the bookings confirm when the pot is full, so nobody fronts the bill for everyone. Each host accepts with one tap. After completion the host is paid to a bank account, a cash-send number, a wallet or a retail pickup.

**What is new here** versus incumbents: voice-to-listing in SA languages, community endorsement as a trust tier, unbanked payouts as a first-class flow, group co-creation with voting as the planning model, and stokvel-style split payment that removes the biggest barrier to booking a group experience.

## Supply-Side Flows

### Register

- Phone number is the identity. OTP over SMS or WhatsApp. No email.
- Choose language first, before anything else. Then choose how to be contacted (in-app, WhatsApp, SMS), since hosts may not open the app daily.
- Optional profile photo taken in-app, auto-compressed.
- Progressive profile: start listing before the profile is complete; cannot go live until verified.
- Registration needs signal for OTP; everything after tolerates disconnection.
- Alternative entry (*to validate for MVP*): message a WhatsApp number to start onboarding conversationally, or be onboarded by a Community Champion.

### Verify (tiered KYC)

Two goals in tension: enough trust for a traveller to book a stranger, low enough friction that the people the platform exists for are not excluded.

| Tier | Requirement | Can do |
| --- | --- | --- |
| 0 Registered | Phone verified | Draft offerings; not live |
| 1 Identity verified | SA ID, passport or asylum/refugee permit + in-app selfie (liveness, face match) | List and accept bookings up to a value cap |
| 2 Community or credential verified | Tourist guide number, PSIRA number, operating licence + PrDP, a reference from a Tier 2 host, or endorsement from a partner (tourism office, community org, NGO, Community Champion) | Cap removed; "verified" badge; same-day payout |

Community endorsement is the path for hosts who have no formal credentials but are known and trusted locally. This is where the Champion model earns its place. The payments partner carries FICA compliance (*to validate:* Yoco, Peach Payments, Ozow, Stitch, PayFast). POPIA: minimum data, clear consent, ID documents encrypted and never shown to travellers. Document capture must work on a bad camera in bad light, with retries.

### Create an offering (voice-to-listing)

The single most important supply-side flow and the first of the demo's two centrepieces.

~~~mermaid
flowchart TD
  A[Host records voice note<br/>in own language] --> B[Speech-to-text]
  B --> C[Translate + draft structured listing]
  C --> D[Host reviews, corrects,<br/>one field per screen]
  D --> E[Add 3 photos<br/>client-side compressed]
  E --> F[Price suggested from<br/>category and comparables]
  F --> G[Preview in traveller's language]
  G --> H[Publish or save offline]
~~~

- AI drafts: title, description, category, duration, group size, suggested price, inclusions, meeting point. Category-specific questions per the Categories section.
- Guided form fallback: one question per screen, plain language, examples, save-as-you-go, resumable offline.
- Photos: take or upload, compressed on device; AI suggests the lead photo and flags unusable ones. Three photos is enough to go live.
- Location: pin, town name, or a shared WhatsApp location. Works without precise GPS.
- Availability: specific dates, recurring days, or "on request with confirmation" (default for hosts with day jobs).
- Offline: drafts save locally with a clear "waiting to upload" state.

### Manage offerings and bookings

- Offering statuses: draft, in review, live, paused, rejected (with a plain-language reason). Edit, pause, duplicate, delete. Simple performance view: views, bookings, earnings.
- Moderation: automated checks first, human review for flagged items.
- Booking requests arrive by push, WhatsApp or SMS per host preference. Accept or decline with one tap, including from WhatsApp.
- Booking detail: who, when, how many, what they paid, meeting point, traveller's number (revealed after acceptance).
- Calendar/list of upcoming bookings, usable offline. Host cancellation with reason and consequences explained; repeat cancellations affect ranking.
- Mark as completed, which triggers payout.

### Get paid (the financial half of the supply-side USP)

The platform collects from the travellers, holds the money, and pays the host after completion (escrow-style). Payout must work without a bank account. Payout options in priority order (*to validate* fees, limits, API availability):

| Channel | Examples | For whom |
| --- | --- | --- |
| Bank account (instant EFT) | Any SA bank | Banked hosts |
| Cardless cash-send to a phone number | FNB eWallet, Standard Bank Instant Money, Absa CashSend, Nedbank Send-iMali | Primary unbanked path; withdraw at ATM or retailer with a PIN |
| Mobile money / wallet | MTN MoMo, VodaPay, Shoprite Money Market | Airtime, groceries, bills without cash |
| Cash pickup voucher | Shoprite, Pick n Pay, Boxer, Pep | Hosts far from an ATM |
| Cash on the day | Platform does not touch it; smaller traveller-paid fee | Bridge only; weaker trust and dispute protection |

Requirements: show the host exactly what they will receive in rand *before* they publish, after fees. Payout within 24 hours of completion, same day for Tier 2. Earnings screen shows total earned, pending, paid out, per booking; this is the impact screen for the pitch. Fee model to decide (commission of 15 to 20% is the industry norm; keep the host-side fee low and visible). Tier 1 hosts may be capped per month until Tier 2. Hosts are independent; provide an annual earnings statement; no withholding at MVP.

Worked example for the demo: a R600 township food tour at a 15% platform fee shows the host "You will receive R510" before publishing, and "R510 sent to 082 xxx xxxx via eWallet" after completion.

## Demand-Side Flows

### Browse

- Entry points: by place ("what is there to do in Montagu"), by category, and by route for travellers moving between places.
- Filters: category, price, date, group size, language spoken, verification tier, distance.
- Listing card: lead photo, title, host first name + verification badge, price, duration, rating, town.
- Listing detail: photos, description translated into the traveller's language, inclusions, meeting point, host profile and story, reviews, availability, cancellation terms, safety notes. The host's story matters: travellers are choosing a person, not a product.
- Natural-language search backed by AI ("somewhere to eat real food near Beaufort West tonight").

### Co-create the itinerary with friends and family

Planning a group trip is where travel usually falls apart: one person chooses, chases and pays, and the rest go along or drop out. Our itinerary is built by the whole group, and the group pays for it together (next section). This is the demand-side USP.

~~~mermaid
flowchart LR
  A[Organiser starts a trip<br/>and invites the group] --> B[Anyone drags listings<br/>onto the day timeline]
  B --> C[Group votes<br/>on each block]
  C --> D[Conflicts and travel time<br/>flagged automatically]
  D --> E[Itinerary locked<br/>when the group agrees]
  E --> F[Group pot opens<br/>split per person]
  F --> G[Each host accepts<br/>their booking]
~~~

- A trip is a shared, Facebook-style timeline grouped by day. Every invited traveller can add blocks; the group votes; the organiser locks it.
- Travel time between items is shown and conflicts are warned.
- AI assist: "plan my day in Graaff-Reinet" proposes a set of listings the group can then edit and vote on.
- Share the itinerary as a link (a growth loop: friends see it, hosts share their bookings).
- Book all items in one pot or one at a time.

### Book and pay together (stokvel-style group payment)

Group travel usually fails at the money: one person fronts the whole bill, then chases everyone else. The barrier to paying for a group experience is high, so the group either downgrades or does not book. We borrow the stokvel model South Africans already trust: a shared pot, each person contributes, the booking confirms when the pot is full.

~~~mermaid
flowchart LR
  A[Itinerary locked] --> B[Group pot created<br/>total split per person]
  B --> C[Each traveller pays their share<br/>from their own phone]
  C --> D[Pot progress visible to all<br/>nudges to stragglers]
  D --> E[Pot full: bookings confirmed<br/>hosts notified]
  E --> F[Funds held until completion<br/>then paid to hosts]
~~~

- The pot is created from the locked itinerary. Default split is equal per person; the organiser can adjust shares (a child, someone skipping one activity) or cover a friend.
- Each traveller pays their share with their own method: card, Apple/Google Pay, instant EFT, SnapScan/Zapper, or a cash-send voucher for unbanked travellers. No one needs to front the full amount.
- Everyone sees pot progress (R1,800 of R2,400, 3 of 4 paid) and a deadline. WhatsApp nudges go to stragglers; the organiser never has to chase.
- Hosts see a request-to-book when the pot opens and a confirmed, fully paid booking when it fills. Instant book where the host allows it; otherwise a response deadline (say 4 hours) with automatic release of the hold.
- If the pot does not fill by the deadline, contributions are refunded automatically or the group can shrink the itinerary and re-split.
- Funds are held until completion, then released to each host. Refunds follow the cancellation policy per person. Receipts by email or WhatsApp. ZAR with an approximate conversion for international travellers.
- Confirmation includes meeting points, host contacts (after acceptance) and add-to-calendar for the whole group.
- Phase 2: a recurring travel stokvel, where a group saves toward a trip over months and the platform suggests itineraries the pot can already afford.

### Manage bookings and stay safe

- Upcoming and past bookings with status: requested, pot open, confirmed, completed, cancelled. Cancel with clear terms (free window, partial refund, none). Reschedule request to the host.
- Contact host in-app with WhatsApp fallback.
- Safety: share trip with a contact; emergency button with local emergency numbers and location sharing.

### Review

- Prompt after completion, both directions. Star rating + short text, optional photos.
- Moderated for abuse; shown once both sides submit or a window passes. Hosts can respond once.
- Low-rated or reported experiences trigger a support workflow.

## Offering Categories

Each category gets its own short listing template so voice-to-listing asks the right questions.

| Category | Examples | Category-specific fields | Regulatory note (*to validate*) |
| --- | --- | --- | --- |
| Experiences | Township walk, home-cooked meal, farm visit, craft workshop, storytelling, choir, fishing, hike | Duration, group min/max, inclusions, physical difficulty, age suitability, languages | Food safety for meals; guiding may need registration if it is the core service |
| Transport | Airport transfer, town-to-town, day drive, lift to trailhead, luggage transfer | Vehicle type and seats, luggage capacity, pickup radius, per-trip vs per-km pricing, child seats | Operating licence, PrDP, roadworthy, passenger liability insurance |
| Concierge and guides | Full-day local guide, multi-stop day, arranging access to places or people | Areas covered, languages, specialities, per-hour or per-day pricing | Provincial tourist guide registration (Tourism Act) |
| Security | Foot or vehicle escort, night escort, event presence, vehicle following | PSIRA grade, armed/unarmed, coverage area, hours | PSIRA registration mandatory; never list unregistered providers |

Hackathon recommendation: seed and demo Experiences and Concierge/guides only; show Transport and Security as categories in the UI but gated behind Tier 2 credentials, which tells judges we have thought about compliance without building it.

## Trust, Safety and Compliance

- Both sides verified: host tiers as above; travellers by phone plus payment method. Badges visible on listings and profiles.
- Safety notes on every listing: meeting point, what to bring, what to expect.
- Share-trip and emergency button for travellers; "report a problem" for both sides.
- Insurance: explore a platform-level public liability policy for hosts (*to validate with a broker*). A real barrier for small operators and a strong pitch point.
- Regulated categories (transport, security, registered guiding) require the credential at Tier 2 before going live.
- POPIA: lawful basis, consent, data minimisation, right to deletion, ID documents encrypted at rest and never shown to other users.
- Pooled traveller funds: held with the payments partner, released only on completion, refunded automatically on an unfilled pot (*to validate:* escrow and FICA treatment of pooled funds).
- Content moderation on listings, photos and reviews.
- Terms, cancellation policy and community guidelines in plain language and in the host's language.
- Community Champions add a human trust layer: an endorsement is logged, visible as a badge, and revocable.

## Hackathon MVP Scope (24 Hours)

Build the thinnest end-to-end slice that proves both halves of the USP on stage. Everything must be demoable on a phone.

**Must demo**

1. Host onboarding with phone OTP (mocked OTP is fine) and language selection.
2. Voice-to-listing in at least one language beyond English (isiXhosa or isiZulu preferred, Afrikaans as fallback): record, transcribe, draft, host edits, publish.
3. Host earnings and payout screen showing a completed payout to a phone number (cash-send), with the "you will receive Rx" shown before publishing.
4. Traveller marketplace: browse by place and category across 3 to 4 SA regions; listing detail with the host's story and verification badge.
5. Group itinerary: shared day timeline, drag-and-drop (or tap-to-add) blocks, simple vote, lock.
6. Stokvel-style group payment: a pot opens for the locked itinerary, split per person; each traveller pays their share from their own phone (payment mock or gateway sandbox); pot progress visible to all; bookings confirm when full. Host accept from the app; a WhatsApp accept shown as a mock message.
7. Seed data: 10 to 20 realistic listings from realistic personas in real places (e.g. Observatory bike tour, Stellenbosch tram tour, a Langa home-cooked meal, a Soweto walk, a Hogsback hike, a Karoo farm visit).

**Phase 2 (in the PRD, not the build)**

Tiered KYC with a real provider, real cash-send payouts, real pooled-funds escrow, recurring travel stokvel, WhatsApp onboarding channel, offline sync, AI itinerary planning, reviews, category templates for transport and security with credential checks, community endorsement flow, insurance partnership, Facebook forum aggregation.

**Explicitly out of scope**

Accommodation, flights, native app-store apps, USSD, multi-currency settlement, rich in-app chat, loyalty, real payments or bank linking.

**Fallbacks if time runs short (decide at hour 12):** drop drag-and-drop for tap-to-add; drop voting for organiser-only lock; drop live speech-to-text for a pre-recorded voice note with cached transcription; simulate the other travellers' pot contributions with a button rather than four real phones; keep the host payout screen and the group pot screen no matter what.

## The Demo Script

Judges score Idea, Execution, Design, Pitch and Impact. The pitch should be one story told through two people, not a feature tour. Aim for 4 minutes of demo inside a 6 to 7 minute slot.

| Minute | Beat | On screen | Judging box it ticks |
| --- | --- | --- | --- |
| 0:00 | The hook: "Tourism is one of SA's biggest employers. Here is who it leaves out, on both sides." One sourced stat. | Title slide, one number | Pitch, Impact |
| 0:30 | Meet the host: Nomsa in Langa cooks for visitors, gets paid in cash when a friend sends someone. No website, no bank account. | Photo of a persona, one line | Idea |
| 1:00 | Nomsa taps the WhatsApp-style app, picks isiXhosa, records a 20-second voice note about her meal. | Live on phone: voice recording | Design, Execution |
| 1:30 | The listing drafts itself in English and isiXhosa: title, price suggestion, photos. She fixes one word and sees "You will receive R510" before publishing. | Live: AI draft, edit, publish | Execution, Design, Impact |
| 2:15 | Meet the travellers: four friends on a Cape Town weekend. Thandi usually plans, pays and chases. Today one friend finds Nomsa's meal and drags it onto Saturday, the others add and vote, the itinerary locks. | Live: shared timeline, votes | Idea, Design |
| 3:00 | The stokvel moment: a pot opens for R2,400, split R600 each. Contributions land from different phones; the bar fills; "Pot full, trip confirmed." Nomsa gets a WhatsApp and accepts with one tap. | Live: group pot filling, host accept | Execution, Impact |
| 3:45 | Saturday happens. Nomsa marks it complete. "R510 sent to 082 xxx xxxx via eWallet." Her earnings screen shows the month. | Live: payout + earnings | Impact |
| 4:15 | Zoom out: the same flow for a taxi driver in Soweto, a hiking guide in Hogsback, a farm in the Karoo; and for a church group, a family reunion, a matric trip. | Map with seeded listings across regions | Impact, Idea |
| 4:40 | The ask and the roadmap: tiered KYC, real cash-send, champions in every community, a recurring travel stokvel. One slide. | Roadmap | Pitch |
| 5:00 | Close on the line: "We built for the host's journey and the group's journey, so travel has someone real at the end of it." | Title slide | Pitch |

Rules for the demo: pre-record the voice note as a fallback and cache the transcription; never rely on venue Wi-Fi for speech-to-text; rehearse the handoff between phones; assign one presenter to narrate and one to drive; hold both money shots on screen for at least five seconds, the pot filling and the payout landing. If four phones is too fragile, two real phones plus simulated contributions is fine, but say so.

## Judging Criteria Alignment

| Criterion | Our answer | Proof point in the demo |
| --- | --- | --- |
| Idea | Financial inclusion at both ends: voice-first, bank-account-optional supply side; co-created, stokvel-paid group journeys on the demand side | Nomsa's voice note becomes a listing; friends vote on it and fill a shared pot |
| Execution | A working PWA covering onboarding, voice-to-listing, marketplace, group itinerary, group pot, host accept and payout, end to end | Two phones, one continuous flow, no slides mid-demo |
| Design | WhatsApp-familiar UI for hosts (one question per screen, big targets, own language); visual timeline and pot progress for travellers; low-data by principle | Language picker first; "You will receive R510" before publish; the pot bar filling |
| Pitch | One story, two people, one sourced number, a clear roadmap | The demo script above |
| Impact | Rand into unbanked hands; hosts who never typed a listing; groups who could never book on one card; regions with no listings on incumbents | Payout to a phone number; pot filling from several phones; map of seeded listings across regions; impact metrics slide |

## Checkpoint Submission

**Prototype link:** [add once deployed]

**250-word write-up (draft; trim to 250 before submitting):**

Tourism is one of South Africa's largest job-creating sectors, yet the people with the most authentic offering (the local guide, the taxi driver, the home cook, the person who knows who to call) are structurally locked out of the platforms where travellers spend money. Listing on those platforms assumes a good phone, cheap data, written English and a bank account to be paid into. Many hosts have an entry-level Android, a rationed prepaid bundle, more comfort speaking than typing, and no bank account. If you cannot list and cannot be paid, you cannot participate.

We built a two-sided marketplace that removes those barriers on the supply side. A host chooses their language, records a voice note describing what they offer, and AI drafts a structured, translated listing they correct and publish in minutes. Verification is tiered so a phone number and ID are enough to start, with community endorsement as a path to full trust. Payouts go to a bank account, a cash-send phone number, a mobile wallet or a retail pickup. The host sees exactly what they will receive in rand before publishing.

On the demand side, groups of friends or family co-create a journey: they drag experiences onto a shared timeline, vote, and lock the plan. Then they pay like a stokvel: a pot opens for the trip, each person contributes their share from their own phone, and the bookings confirm when the pot is full. Nobody fronts the bill, and each host accepts with one tap, including from WhatsApp.

Our prototype demonstrates the full loop across several South African regions: voice to listing, listing to group itinerary, shared pot to a payout the host can actually collect. We built for the host's journey and the group's journey, so travel has someone real at the end of it.

## Tech Stack, Architecture and Non-Functional Requirements

Team default, to be confirmed by the devs:

| Layer | Choice | Notes |
| --- | --- | --- |
| App | Next.js PWA on Vercel | One codebase, two shells: host (WhatsApp-like, text-first) and traveller (visual timeline) |
| Backend | Supabase: auth, Postgres, storage, row-level security, edge functions | Edge functions for sync and webhooks |
| AI | Speech-to-text for SA languages; LLM for listing drafting, translation, natural-language search | Evaluate isiXhosa/isiZulu accuracy on day one; fall back to English + review step if poor. For the demo, cache transcriptions |
| Payments | One SA gateway for card + instant EFT (*to validate:* Peach, Yoco, Ozow, Stitch) plus a payout provider | Mocked at hackathon; sandbox if one is quick. Pooled funds need an escrow-capable partner in phase 2 |
| Messaging | WhatsApp Business API via Twilio, Clickatell or 360dialog; SMS via Clickatell | Mocked as on-screen WhatsApp messages at hackathon; Yazi for community surveys |
| Maps | Google Maps or Mapbox on the demand side; static or none on the supply side | Saves data for hosts |
| Analytics | Impact metrics instrumented from day one | Even in the demo, log the events |

**Non-functional requirements**

- Low-end performance: supply-side first load under 500 KB, right-sized images, no heavy client frameworks on critical paths.
- Offline: supply-side drafts, offerings and bookings available offline; sync with conflict handling; clear unsynced state. (Phase 2 for the build; design for it now.)
- Data cost: tell hosts roughly how much data an action uses where material (photo upload).
- Languages: UI in EN, AF, XH, ZU at MVP with a path to all 11; listings translated automatically both ways.
- Channels: PWA primary; WhatsApp for notifications and simple actions; SMS fallback; USSD later.
- Accessibility: WCAG 2.1 AA, large touch targets, high contrast, screen-reader labels, readable in bright sunlight.
- Resilience: host actions queue during load shedding or signal loss; travellers are told the host may respond late.
- Security: OTP auth, encrypted PII, payments handled entirely by the partner.
- Brand: apply the Specno UI guidelines (Specno Blue, Nunito/Inter, minimalist components) so the prototype looks finished, not hacked.

## Success and Impact Metrics

The pitch should promise to measure these, and the prototype should show a mock impact dashboard built from them.

**Impact metrics**

| Metric | Why it matters | Target |
| --- | --- | --- |
| Hosts onboarded who are unbanked, first-time platform sellers, or from areas with no incumbent listings | The exclusion we exist to remove | Majority of hosts |
| Rand paid out to hosts, and share via non-bank channels | Money reaching people, not intermediaries | Track from day one |
| Time from registration to first live listing | Proves the onboarding USP | Under 15 minutes with voice-to-listing |
| Hosts onboarded voice-only, and without a bank account | Proves both halves of the supply USP | Report both |
| Group bookings paid via shared pot; average contributors per pot; pots that fill | Proves the demand-side USP: groups book what one card never would | Majority of group trips paid by pot; fill rate above 80% |
| Average host earnings per month; hosts for whom it is a meaningful supplement | Livelihood impact | Define "meaningful" with hosts |
| Bookings completed; repeat bookings | The marketplace works | Track |

**Product metrics**

- Supply: registration completion, verification completion by tier, publish rate, acceptance rate, response time.
- Demand: search-to-booking conversion, itinerary share rate, pot fill rate and time-to-fill, cancellation rate, review rate, rating distribution.
- Trust: disputes per 100 bookings, safety reports, fraud rate.

## 24-Hour Build Plan

Work in two parallel streams (host app, traveller app) that meet at hour 16. Assign owners in the right-hand column.

| Hours | Host stream | Traveller stream | Shared / owner |
| --- | --- | --- | --- |
| 0 to 2 | Confirm stack, scaffold PWA, pick STT/LLM provider and test isiXhosa/isiZulu once | Wireframe timeline, listing card and pot screen | Seed data: 10 to 20 listings across 3 to 4 regions; personas; photos. Design tokens from Specno guidelines |
| 2 to 6 | OTP mock, language picker, WhatsApp-style shell | Browse by place/category, listing detail with host story | Supabase schema: hosts, listings, trips, blocks, votes, pots, contributions, bookings, payouts |
| 6 to 10 | Voice record, transcribe, LLM draft, review screens | Shared trip timeline, add blocks (tap first, drag if time) | AI prompt for listing drafting and translation |
| 10 to 14 | Publish flow with "you will receive Rx"; offerings list | Voting, lock, group pot: split, contribute, progress bar, confirm | Hour 12 checkpoint: apply fallbacks if behind |
| 14 to 16 | Booking inbox, one-tap accept, mock WhatsApp accept | Booking confirmation, itinerary share link | Connect the streams end to end |
| 16 to 19 | Mark complete, payout to phone number, earnings screen | Polish timeline and pot, map of seeded listings | Impact dashboard mock |
| 19 to 21 | Bug fixes, brand polish, mobile QA on a real low-end Android | Bug fixes, brand polish | Deploy to Vercel; prototype link |
| 21 to 23 | Record fallback voice note and cache transcription | Rehearse traveller phones and simulated contributions | Write checkpoint submission; build 5-slide deck; rehearse demo twice |
| 23 to 24 | Buffer | Buffer | Final rehearsal; charge phones; submit |

## Decisions Needed and Open Questions

**Decide before the build starts (hour 0):**

- [ ] Working name and one-line tagline. Candidates to react to: *Khaya Trails* (khaya = home), *Ubuntu Journeys*, *Local Ledger*, *Hlala* (stay/sit). Pick something a host can say and a judge can spell.
- [ ] Demo language for voice-to-listing: isiXhosa, isiZulu or Afrikaans, based on the hour-0 STT test.
- [ ] Demo persona and region set (recommended: Langa meal, Observatory bike tour, Stellenbosch tram, Soweto walk, Hogsback hike, Karoo farm).
- [ ] Drag-and-drop vs tap-to-add for the itinerary, and whether voting ships or organiser-lock only.
- [ ] Fee shown in the demo (recommend 15% so the host-receives number is clean).
- [ ] Pot demo: four real phones, or two real phones plus simulated contributions? Decide by hour 2 and build the simulate button either way.

**Open questions for the PO (phase 2):**

- Fee model: commission only, traveller fee only, or split? What rate keeps hosts whole?
- Which payout channel first: cash-send or a retailer wallet? Which has a usable API?
- Require registered tourist-guide status for all guiding, or only where the host positions as a guide?
- List security at MVP given PSIRA, or hold the category?
- Instant book vs request-to-book as default for hosts with day jobs.
- Who moderates listings at launch, and what is the SLA?
- Insurance: platform policy or host's own?
- Speech-to-text quality in isiXhosa and isiZulu: provider and fallback.
- Hosts who share a phone: one device, several hosts?
- How community endorsers (tourism offices, NGOs, Champions) get onboarded and what they see.
- Pot rules: deadline length, partial-fill options (shrink the trip vs refund), who can adjust shares, and whether one person may cover another.
- Regulatory view on holding pooled traveller funds (escrow, FICA, deposit-taking) and which payments partner supports it.
- Brand and tone of voice.

## Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Two-sided cold start | Seed one area deeply with real hosts rather than the country thinly; partner with local tourism offices, community organisations and Champions for supply |
| Payout compliance (FICA, limits) re-introduces exclusion | Tiered model; a partner that supports low-KYC wallets |
| Pooled funds treated as deposit-taking | Escrow-capable payments partner holds the pot; platform never touches funds directly; validate with counsel before launch |
| Safety incident on either side | Verification, share-trip, insurance, responsive support |
| AI transcription quality in SA languages | Human review and English fallback; for the demo, pre-recorded note with cached transcription |
| Regulated categories (transport, security) carry legal exposure | Credentials required before go-live; start with experiences and guiding |
| Extractive-platform perception | Low, visible host fee; earnings transparency on every screen |
| Hackathon: venue Wi-Fi fails during live STT | Cached transcription; offline-capable demo build; hotspot on a second phone |
| Hackathon: two streams do not integrate in time | Shared schema at hour 2; integration checkpoint at hours 14 to 16; fallbacks decided at hour 12 |
| Hackathon: demo looks like a feature tour | Follow the demo script; one story, two people, two money shots |
