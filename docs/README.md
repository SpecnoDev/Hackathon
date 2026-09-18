# docs/

Shared context for the team's Local Experience Marketplace build. This is also what each teammate's Claude session should read first before touching code.

| File | What it is | Owner | Authoritative for |
| --- | --- | --- | --- |
| `PRD.md.pdf` | The spec: features, flows, MVP scope, demo script, build plan | Miles | Anything it covers — it wins where documents disagree |
| `PRD-context.md` | Derived from the PRD: problem framing, who we serve, the reasoning behind what is in and out, the hour-0 open items, and the session positions the PRD superseded | Marlon | The *why*; not a second source of decisions — the PRD decides |
| `TECH_STACK.md` | Stack, architecture, database schema, API contract, ownership split | Henry | How we build it — the schema and endpoints every stream codes against |
| `glossary.md` | Shared terminology, short and specific to how we use each term | Francois | What words mean here — add to it as terms come up |
| `discussions/discussion1.md`, `discussions/discussion2.md` | Francois's recordings — summary + full transcript | Francois | Primary source for what was actually decided in the two sessions |

## Reading order

1. `PRD.md.pdf` — the spec.
2. `PRD-context.md`, "Open items (hour 0)" — what still needs deciding.
3. `PRD-context.md`, "Superseded session positions" — so you know which earlier ideas are closed.
4. `TECH_STACK.md` — stack, schema and API contract; then `CLAUDE.md` in the repo root for the code conventions.

## Not yet in this folder

- Design tokens / brand guidelines (PRD says apply the Specno UI guidelines; `TECH_STACK.md` names the Tailwind tokens)
- The product name (candidates are listed in `PRD-context.md`, "Open items (hour 0)")

## Branching

Per discussion 2: `main` is the trunk. `feature/demand` (Francois) and `feature/supply` (Marlon) are long-running branches; sub-features branch off those.
