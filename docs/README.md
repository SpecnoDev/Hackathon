# docs/

Shared context for the team's Local Experience Marketplace build. This is also what each teammate's Claude session should read first before touching code.

| File | What it is | Owner | Authoritative for |
| --- | --- | --- | --- |
| `PRD.md.pdf` | The spec: features, flows, MVP scope, demo script, build plan | Miles | Anything it covers — it wins where documents disagree |
| `PRD-context.md` | Session decisions, rationale, backlog reasons, and the list of open conflicts with the PRD | Marlon | The *why* behind decisions, and tracking where the PRD hasn't been settled yet |
| `discussions/discussion1.md`, `discussions/discussion2.md` | Francois's recordings — summary + full transcript | Francois | Primary source for what was actually decided in the two sessions |

## Reading order

1. `PRD.md.pdf` — the spec.
2. `PRD-context.md`, "Where this differs from the PRD" — the five open conflicts and three softer differences between the spec and the session record.
3. `PRD-context.md`, "Open items" — what still needs deciding, including the PRD's hour-0 decisions.

## Not yet in this folder

- Henry's tech-stack doc (owner: Henry, decided in discussion 2)
- Design tokens / brand guidelines (PRD says apply the Specno UI guidelines)
- The product name (candidates are listed in `PRD-context.md`, "Open items")

## Branching

Per discussion 2: `main` is the trunk. `feature/demand` (Francois) and `feature/supply` (Marlon) are long-running branches; sub-features branch off those.
