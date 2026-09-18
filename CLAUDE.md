# Conventions

Read `docs/TECH_STACK.md` before writing code — it holds the stack, schema and API contract. `docs/PRD.md` holds the product. `DESIGN.md` holds the design system — read it before building any UI; it wins on anything visual. This file is how we write it.

A two-sided travel marketplace PWA: hosts list by voice and get paid without a bank account, travellers co-create an itinerary and book. Hosts are the primary user — when host simplicity and traveller convenience conflict, the host wins.

## Structure

Three folders under `src/`. Nothing else at that level.

- **`core/`** — technical foundation, organised by type: `constants/`, `interfaces/`, `services/`, `offline/`, `guards/`, `utils/`, `layout/`. Cross-cutting only: database, auth, HTTP, AI, app chrome. Never feature logic. `offline/` is the one browser-side corner — IndexedDB and the outbox — kept out of `services/` because that barrel reaches `next/headers`, `node:crypto` and Prisma, so a client component can never import it.
- **`features/`** — organised by feature: `onboarding/`, `auth/`, `supply/`, `demand/`. Inside each, the same by-type split scoped to that feature (`pages/`, `components/`, `services/`, `dto/`, `hooks/`).
- **`shared/`** — reusable and feature-agnostic: `components/`, `dto/`, `utils/`. Presentational or purely functional, with no feature knowledge.

Rules:

- **A feature never imports another feature.** Anything two features need moves up to `shared/` or `core/`.
- **Every folder has an `index.ts` barrel.** Cross-folder imports go through it (`from '@/core/services'`), never deep into a file. Inside a folder, files import each other directly (`from './prisma.service'`) — importing your own barrel creates a cycle.
- **Create a folder only when something goes in it.** Empty scaffolding is bloat.
- File names carry their kind: `whatsapp.service.ts`, `kyc-steps.constant.ts`, `conversation.interface.ts`, `provider-profile.dto.ts`, `validators.util.ts`. Components are `PascalCase.tsx`.

## Code

Write less code. One expressive line beats four, never at the cost of readability.

- Lean, DRY, SOLID. Business logic lives in `core/services` or a feature service — never in a route handler, page or component. Route handlers parse, guard, call a service, return.
- **Reuse before creating.** Use the services, utilities, DTOs and components already here. Add something new only where a real gap exists.
- **No magic strings or numbers.** Any literal that carries meaning gets a named constant in `core/constants` (or the feature's `constants/` if only that feature needs it), including copy that mirrors a threshold.
- Never build an abstraction against a contract you have not seen.
- **Stay in scope.** No drive-by refactors or adjacent fixes; flag them instead.
- **Comments:** none explaining how the code works. Comment only a non-obvious edge case, a landmine, a decision made over an obvious alternative, or a TODO.
- Prefer editing an existing file over adding one. No dead code, no commented-out code, no DTO fields nothing consumes.

## Conventions that matter here

- **Server Components by default.** `'use client'` only for the recorder, forms, drag-and-drop and sync.
- **Validation:** one zod schema per DTO in `shared/dto`, used by both the route handler and the form. Infer the TypeScript type from the schema; never hand-write it twice.
- **Responses:** `{ data }` or `{ error: { code, message } }`. Never leak a stack trace or a Prisma error to the client.
- **Guards:** every non-public handler starts with `requireHost` / `requireTraveller` / `requireService`. Scope every query by the id the guard returned — never by an id from the request body.
- **Money:** integers in cents, everywhere. Format only at the edge, with `shared/utils/money`.
- **Ids created offline** use `crypto.randomUUID()` on the client, and the API upserts by that id so a replayed write is a no-op.
- **Env:** read lazily at call time through `requireEnv` / `optionalEnv` in `core/constants` — a missing value must fail the request, not the build. Only `NEXT_PUBLIC_*` may reach the browser.
- **Prisma** is reached through the single client in `core/services/prisma.service.ts`. Never instantiate another.
- **Offline:** a host action saves to IndexedDB and enqueues in the outbox before it touches the network, and the UI says so.
- **Keep host routes light** — no chart, map or drag-and-drop library under `app/(host)`. Check `next build` route sizes before pushing.
- **Accessibility:** large touch targets, labels on icons, high contrast. Hosts use entry-level Androids in sunlight.

## Security

- Never log, echo or return a secret value.
- ID numbers are hashed with `ID_HASH_SALT` and the raw value discarded. ID documents go to the private bucket and are served only via short-lived signed URLs, never to a traveller.
- Keep the webhook's HMAC verification. Keep OTP rate limits on.
- No card data in this codebase — payments are a mock reference string.
- Flag an N+1, an unbounded query, an unauthenticated endpoint or a secret heading for the client as soon as you see it, even if the prompt did not ask.

## Git

- `main` is the trunk and always runs. `feature/supply` and `feature/demand` are long-lived; branch sub-features off them and merge back.
- Never stage, commit, branch or push unless you were explicitly asked to in that message.
- Never credit AI in a commit message, PR or ticket.
- Commit frequently — one large late commit reads as pre-built work.

## Ownership

| Area | Owner |
|---|---|
| Platform: schema, `shared/dto`, guards, `api/v1`, auth, AI, bot | Henry |
| `app/(host)`, `features/supply` | Marlon |
| `app/(traveller)`, `features/demand` | Francois |

Touching someone else's area: say so first. Changing the schema or a shared DTO: commit it to `main` and tell the team.
