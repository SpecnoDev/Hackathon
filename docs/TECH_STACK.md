# Tech Stack & Architecture

North star for the build. Product context lives in `docs/PRD.md`; code conventions live in `CLAUDE.md`.

**Owners** — Henry: platform, auth, API, AI, WhatsApp bot · Marlon: supply (host app) · Francois: demand (traveller app).

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15, App Router | UI and API in one repo, one deploy |
| Hosting | Vercel | Zero-config Next.js with HTTPS, which a PWA requires |
| Database | Postgres (Supabase) | Managed and serverless-friendly |
| Data access | Prisma | Typed schema shared by all three streams |
| Auth | Supabase Auth | Phone OTP, email OTP and Google out of the box |
| Storage | Supabase Storage | Public bucket for photos, private for KYC documents |
| PWA | `app/manifest.ts` + hand-written `public/sw.js` | A manifest and a service worker are all a PWA needs |
| Offline store | IndexedDB, direct | Drafts and outbox live on the phone; no library needed |
| Styling | Tailwind, tokens from `DESIGN.md` | Green `#009A4E` primary, orange `#F58A34` for money; Cal Sans display, Montserrat text. `DESIGN.md` is the source of truth |
| Listing AI | Claude (`@anthropic-ai/sdk`) | Drafts, translates and searches listings; already installed |
| Speech-to-text | Google Speech REST (`speech:recognize`) | One `fetch` with an API key, no SDK |
| Validation | zod | One schema per DTO, used by API and forms |
| Messaging | Meta WhatsApp Cloud API | Already working in `src/features/onboarding` |
| Payments | Mocked | Out of scope for the build; the payout screen is the demo moment |

**Add:** `npm i @prisma/client @prisma/adapter-pg pg @supabase/supabase-js @supabase/ssr` and `npm i -D prisma@7 tsx @types/pg tailwindcss @tailwindcss/postcss`. Nothing else without asking. Pin `prisma`/`@prisma/client` to the same `7.x` — npm's `latest` tag currently resolves to an `8.0.0-rc` release candidate; stay on 7 until 8 is stable.

## Architecture

```
 Host phone (PWA)                    Traveller phone / laptop (PWA)
 service worker + IndexedDB outbox            │
              │                               │
              ▼                               ▼
     ┌──────────────────────────────────────────────┐
     │ Next.js on Vercel                            │
     │ app/(host)   app/(traveller)   app/api/v1/*  │
     │ app/api/webhook  ← WhatsApp bot              │
     │ core/services = all domain logic             │
     └────┬────────────────┬──────────────┬─────────┘
          ▼                ▼              ▼
   Supabase Postgres   Supabase Auth   Supabase Storage
          │
   Claude · Google STT (server only)
```

- Offline is a client concern: the service worker serves the shell, IndexedDB holds drafts, an outbox replays writes when signal returns.
- Server Components call `core/services` directly. Client components and the bot go through `/api/v1`.
- Nothing is held in process memory — every request may hit a fresh instance.

## Repo layout

```
src/
  app/
    (host)/host/…          Marlon    one question per screen, chat-style shell
    (traveller)/…          Francois  /, /explore, /listings/[id], /trips/[id], /bookings
    (auth)/login/…         Henry     phone OTP · email OTP · Google
    api/v1/…               route handlers, thin → core/services
    api/webhook/           exists — Meta webhook
    layout.tsx  manifest.ts
  core/
    constants/  interfaces/  utils/            exist
    guards/                  requireHost · requireTraveller · requireService
    services/                prisma · supabase-server · supabase-browser
                             host · offering · trip · booking · payout · storage
                             ai · stt · whatsapp (exists) · conversation-store
                             local-db (IndexedDB) · sync (outbox)
    layout/                  HostShell · TravellerShell
  features/
    onboarding/              exists — bot KYC flow (Henry)
    auth/                    OTP screens, language picker
    supply/                  Marlon — pages, components, hooks
    demand/                  Francois — pages, components, hooks
  shared/
    dto/                     zod schemas — the API contract
    components/              Button, Input, ChatBubble, ListingCard, TierBadge
    utils/                   validators (exists), money, phone, image
public/  sw.js  icons
prisma/  schema.prisma  seed.ts    10–20 listings across 3–4 regions
```

## Data model

Henry owns migrations. Everyone else: pull, then `npx prisma generate`.

Prisma 7 (installed version) removed `url`/`directUrl` from the `datasource` block in `schema.prisma` — the CLI now reads the connection from `prisma.config.ts` at the repo root, and `PrismaClient` takes a driver adapter instead of reading `DATABASE_URL` implicitly. Both pieces already exist:

```ts
// prisma.config.ts — CLI only (generate, migrate, db pull). Points at DIRECT_URL.
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: { url: env('DIRECT_URL') },
});
```

```ts
// core/services/prisma.service.ts — runtime queries, pooled via DATABASE_URL.
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
export const prisma = new PrismaClient({ adapter });
```

`npm i @prisma/adapter-pg pg` and `npm i -D @types/pg` on top of the packages listed above — needed by the driver adapter.

```prisma
generator client { provider = "prisma-client-js" }

datasource db {
  provider = "postgresql"
}

enum Language         { EN AF XH ZU }
enum ContactChannel   { IN_APP WHATSAPP SMS }
enum VerificationTier { REGISTERED IDENTITY COMMUNITY }
enum OfferingCategory { EXPERIENCE TRANSPORT CONCIERGE SECURITY }
enum OfferingStatus   { DRAFT IN_REVIEW LIVE PAUSED REJECTED }
enum BookingStatus    { REQUESTED CONFIRMED DECLINED COMPLETED CANCELLED }
enum PayoutChannel    { BANK CASH_SEND WALLET CASH_PICKUP }
enum PayoutStatus     { PENDING SENT }

model Host {
  id             String           @id @default(uuid())
  authUserId     String?          @unique
  phone          String           @unique          // E.164 — the identity
  fullName       String
  language       Language         @default(EN)
  contactChannel ContactChannel   @default(WHATSAPP)
  serviceArea    String
  story          String?
  photoUrl       String?
  tier           VerificationTier @default(REGISTERED)
  idNumberHash   String?                           // never the raw ID
  idDocumentPath String?                           // private bucket
  payoutChannel  PayoutChannel?
  payoutPhone    String?
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt
  offerings      Offering[]
  bookings       Booking[]
  payouts        Payout[]
}

model Offering {
  id             String           @id              // client-generated
  hostId         String
  host           Host             @relation(fields: [hostId], references: [id])
  category       OfferingCategory
  status         OfferingStatus   @default(DRAFT)
  title          String
  description    String
  sourceLanguage Language
  translations   Json?                             // { en: {title, description}, xh: {…} }
  priceCents     Int
  durationMin    Int?
  groupMin       Int              @default(1)
  groupMax       Int?
  inclusions     String[]
  meetingPoint   String
  town           String
  region         String
  lat            Float?
  lng            Float?
  photos         String[]
  availability   Json                              // { type: 'on_request'|'dates'|'recurring', … }
  voiceNotePath  String?
  transcript     String?
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt
  blocks         TripBlock[]
  bookings       Booking[]

  @@index([status, region])
  @@index([hostId])
}

model Traveller {
  id         String       @id @default(uuid())
  authUserId String       @unique
  email      String       @unique
  name       String
  phone      String?
  language   Language     @default(EN)
  createdAt  DateTime     @default(now())
  trips      TripMember[]
  bookings   Booking[]
  votes      Vote[]
}

model Trip {
  id          String       @id @default(uuid())
  organiserId String
  name        String
  startDate   DateTime     @db.Date
  endDate     DateTime     @db.Date
  shareCode   String       @unique
  locked      Boolean      @default(false)
  createdAt   DateTime     @default(now())
  members     TripMember[]
  blocks      TripBlock[]
}

model TripMember {
  tripId      String
  travellerId String
  trip        Trip      @relation(fields: [tripId], references: [id])
  traveller   Traveller @relation(fields: [travellerId], references: [id])

  @@id([tripId, travellerId])
}

model TripBlock {
  id         String    @id                         // client-generated
  tripId     String
  offeringId String
  day        DateTime  @db.Date
  startTime  String?
  position   Int
  addedById  String
  trip       Trip      @relation(fields: [tripId], references: [id])
  offering   Offering  @relation(fields: [offeringId], references: [id])
  votes      Vote[]
  booking    Booking?

  @@index([tripId, day])
}

model Vote {
  blockId     String
  travellerId String
  up          Boolean
  block       TripBlock @relation(fields: [blockId], references: [id])
  traveller   Traveller @relation(fields: [travellerId], references: [id])

  @@id([blockId, travellerId])
}

model Booking {
  id                String        @id @default(uuid())
  offeringId        String
  hostId            String
  travellerId       String
  blockId           String?       @unique
  status            BookingStatus @default(REQUESTED)
  date              DateTime
  groupSize         Int
  totalCents        Int
  feeCents          Int
  hostReceivesCents Int
  paymentRef        String?
  respondBy         DateTime
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
  offering          Offering      @relation(fields: [offeringId], references: [id])
  host              Host          @relation(fields: [hostId], references: [id])
  traveller         Traveller     @relation(fields: [travellerId], references: [id])
  block             TripBlock?    @relation(fields: [blockId], references: [id])
  payout            Payout?
}

model Payout {
  id          String        @id @default(uuid())
  bookingId   String        @unique
  hostId      String
  amountCents Int
  channel     PayoutChannel
  destination String                                // masked: "082 *** 1234"
  status      PayoutStatus  @default(PENDING)
  sentAt      DateTime?
  booking     Booking       @relation(fields: [bookingId], references: [id])
  host        Host          @relation(fields: [hostId], references: [id])
}

model ConversationSession {
  waId      String   @id
  state     Json
  updatedAt DateTime @updatedAt
}

model ProcessedWebhookMessage {
  id         String   @id
  receivedAt DateTime @default(now())
}
```

## API — `/api/v1`

`{ data }` on success, `{ error: { code, message } }` on failure. Bodies validated by the matching zod schema in `shared/dto`. Auth modes: **session** (Supabase cookie), **service** (`Authorization: Bearer ${INTERNAL_API_TOKEN}`, for the bot), **public**.

| Method | Path | Auth | Owner |
|---|---|---|---|
| POST | `/hosts` | service | Henry — bot posts its profile here; upsert by phone |
| GET, PATCH | `/hosts/me` | host | Marlon |
| GET | `/hosts/me/earnings` | host | Marlon |
| POST | `/offerings` | host, service | Marlon — upsert by client id |
| PATCH | `/offerings/:id` | host (owner) | Marlon |
| GET | `/offerings?region=&category=&q=&lang=` | public | Francois |
| GET | `/offerings/:id` | public | Francois |
| POST | `/ai/transcribe` | host | Henry — audio + language → `{ transcript }` |
| POST | `/ai/draft-listing` | host | Henry — transcript → structured draft + translations |
| POST | `/storage/sign-upload` | host | Henry |
| POST | `/trips` | traveller | Francois |
| POST | `/trips/join/:shareCode` | traveller | Francois |
| POST | `/trips/:id/blocks` | member | Francois — upsert by client id |
| DELETE | `/blocks/:id` | member | Francois |
| POST | `/blocks/:id/vote` | member | Francois |
| POST | `/trips/:id/lock` | organiser | Francois |
| POST | `/trips/:id/checkout` | organiser | Francois — one booking per locked block |
| GET | `/bookings?role=host\|traveller` | session | both |
| POST | `/bookings/:id/accept` · `/decline` | host, service | Marlon |
| POST | `/bookings/:id/complete` | host | Marlon — creates the payout |
| — | `/api/webhook` | Meta HMAC | Henry (exists) |

## Auth

- Hosts sign in with a phone OTP; travellers with an email OTP or Google. Language is chosen before anything else.
- Supabase test phone numbers carry fixed OTP codes, so no SMS provider is needed for the demo. Set the email template to `{{ .Token }}` so travellers get a code, not a link.
- On first sign-in, `ensureForAuthUser()` matches the profile by phone or email and sets `authUserId` — a host onboarded by the bot keeps the same row.
- Guards resolve the session to a profile id; every service call is scoped by it. Never trust an id from the request body.
- Registration needs signal. Everything after it works offline.

## Offline

- `public/sw.js`: precache the shell, network-first for `GET /api/v1/offerings*`, cache-first for photos, never cache auth or mutations. Registered from a small client component in the root layout.
- `app/manifest.ts` — name, icons, `display: standalone`, theme and background colours from `DESIGN.md`.
- IndexedDB via `core/services/local-db.service.ts`: `drafts`, `outbox` (`{ id, method, path, body, attempts }`), `bookings` cache.
- Writes save locally first and show *Saved on your phone · waiting to upload*. `sync.service` flushes the outbox on `online`, on app start, and after any successful request.
- Ids for offline-created rows are generated by `crypto.randomUUID()` on the client and upserted server-side, so a replayed write is a no-op.
- Voice notes are recorded with `MediaRecorder` and kept in IndexedDB until they upload.

## Rules

- Host routes stay under **500 KB** first load. Server Components by default; no chart, map or drag-and-drop libraries under `(host)`.
- Money is always integers in cents. `PLATFORM_FEE_BPS` in `core/constants`; `hostReceivesCents` is computed once in `booking.service` so the "You will receive R510" preview and the payout agree.
- Photos are resized on the device with a canvas before upload (max 1280 px). Three photos to go live.
- Only `NEXT_PUBLIC_*` values reach the browser. Service keys, `DATABASE_URL`, `ANTHROPIC_API_KEY` and `INTERNAL_API_TOKEN` are server-only.
- ID numbers are hashed and the raw value discarded; ID photos live in the private bucket behind short-lived signed URLs and are never shown to travellers.
- zod on every request body; a guard on every non-public handler; the webhook keeps its HMAC check.
- No card data anywhere — payments are a mock reference string.

## Environment

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=   # older projects call this the anon key
SUPABASE_SECRET_KEY=                    # older projects call this the service role key
DATABASE_URL=                      # Connect → ORMs → Prisma; pooler :6543 ?pgbouncer=true&connection_limit=1
DIRECT_URL=                        # :5432, migrations

NEXT_PUBLIC_APP_URL=http://localhost:3000
INTERNAL_API_TOKEN=                # bot → /api/v1
ID_HASH_SALT=

ANTHROPIC_API_KEY=
GOOGLE_STT_API_KEY=

WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_APP_SECRET=
WHATSAPP_VERIFY_TOKEN=
WHATSAPP_GRAPH_VERSION=v21.0
PROFILE_API_URL=http://localhost:3000/api/v1/hosts
PROFILE_API_TOKEN=                 # same value as INTERNAL_API_TOKEN
```

Use `.env` — every `.env*` file except `.env.example` is git-ignored. Values are shared out of band, never committed. Anything the deployed app needs must also be set in Vercel → Environment Variables.

## Setup

```bash
git clone git@github.com:SpecnoDev/Hackathon.git && cd Hackathon
npm i
cp .env.example .env        # paste the shared values
npx prisma generate
npm run dev                 # http://localhost:3000
npm run tunnel              # HTTPS URL for a phone or the Meta webhook
```

## Branching

`main` is the trunk and always runs. `feature/supply` (Marlon) and `feature/demand` (Francois) are long-lived — branch sub-features off them and merge back. Platform work (schema, `shared/dto`, guards, `api/v1`, seed) goes straight to `main`; rebase onto it often. Integrate at the hour 14–16 checkpoint. Commit frequently — one large late commit reads as pre-built work.
