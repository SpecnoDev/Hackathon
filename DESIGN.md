---
version: alpha
name: "Hosted"
website: ""
description: "A warm, photography-led two-sided marketplace for local South African tourism services, built on a white canvas with a national green (#009A4E) as the single product voltage and a sunset orange (#F58A34) reserved for money and warmth. Type pairs Cal Sans (display, one weight) with Montserrat (everything else) at generous sizes, because the primary user is a host on an entry-level Android in sunlight. Soft 12px base radius, pill buttons, one shadow tier. Two densities share one token set: a large, calm host app (18px body, 56px buttons, one question per screen) and a denser, more photographic traveller app (16px body, 48px buttons, card grids). Red exists in the brand triad but inside the product it belongs to errors only."

colors:
  primary: "#009A4E"
  primary-active: "#00703A"
  primary-tint: "#E6F4EC"
  primary-disabled: "#A6DCC0"
  primary-text: "#00703A"
  accent: "#F58A34"
  accent-active: "#D9721F"
  accent-tint: "#FDECDD"
  on-accent: "#050505"
  brand-red: "#FF2E2E"
  error: "#C41E1E"
  error-tint: "#FDE4E4"
  ink: "#050505"
  body: "#2B2B2B"
  muted: "#5C5C5C"
  muted-soft: "#8A8A8A"
  hairline: "#E0E0E0"
  hairline-soft: "#EFEFEF"
  border-strong: "#BDBDBD"
  canvas: "#FFFFFF"
  surface-soft: "#F6F6F6"
  surface-strong: "#EDEDED"
  surface-dark: "#121212"
  on-primary: "#FFFFFF"
  on-dark: "#FFFFFF"
  star-rating: "#F58A34"
  scrim: "#000000"

typography:
  display-xl:
    fontFamily: "'Cal Sans', 'Montserrat', -apple-system, system-ui, Roboto, sans-serif"
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.5px
  display-lg:
    fontFamily: "'Cal Sans', 'Montserrat', sans-serif"
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.3px
  display-md:
    fontFamily: "'Cal Sans', 'Montserrat', sans-serif"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.2px
  earnings-display:
    fontFamily: "'Cal Sans', 'Montserrat', sans-serif"
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -1px
  title-lg:
    fontFamily: "'Montserrat', -apple-system, system-ui, Roboto, sans-serif"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0
  title-md:
    fontFamily: "'Montserrat', sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0
  title-sm:
    fontFamily: "'Montserrat', sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0
  body-host:
    fontFamily: "'Montserrat', sans-serif"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-md:
    fontFamily: "'Montserrat', sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: "'Montserrat', sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0
  caption:
    fontFamily: "'Montserrat', sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0
  badge:
    fontFamily: "'Montserrat', sans-serif"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.2px
  button-lg:
    fontFamily: "'Montserrat', sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0
  button-md:
    fontFamily: "'Montserrat', sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: 0
  button-sm:
    fontFamily: "'Montserrat', sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0
  link:
    fontFamily: "'Montserrat', sans-serif"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0
    textDecoration: underline
  nav-label:
    fontFamily: "'Montserrat', sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0

rounded:
  none: 0px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 64px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.full}"
    padding: 16px 24px
    height: 56px
  button-primary-compact:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 14px 24px
    height: 48px
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
  button-primary-disabled:
    backgroundColor: "{colors.primary-disabled}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.full}"
    padding: 16px 24px
    height: 56px
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.full}"
    padding: 15px 23px
    height: 56px
  button-tertiary-text:
    backgroundColor: transparent
    textColor: "{colors.primary-text}"
    typography: "{typography.link}"
  button-destructive:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.error}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 14px 24px
    height: 48px
  voice-record-button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    height: 96px
  voice-record-button-recording:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.full}"
    height: 96px
  language-tile:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.title-lg}"
    rounded: "{rounded.lg}"
    padding: 24px
    height: 72px
  option-tile:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.lg}"
    padding: 20px
    height: 64px
  option-tile-selected:
    backgroundColor: "{colors.primary-tint}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.lg}"
    padding: 20px
    height: 64px
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-host}"
    rounded: "{rounded.md}"
    padding: 16px
    height: 56px
  otp-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-md}"
    rounded: "{rounded.md}"
    height: 64px
  step-indicator:
    backgroundColor: "{colors.hairline}"
    textColor: "{colors.muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    height: 4px
  step-indicator-active:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.full}"
    height: 4px
  top-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    height: 56px
  bottom-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.muted}"
    typography: "{typography.nav-label}"
    height: 64px
  bottom-nav-item-active:
    backgroundColor: transparent
    textColor: "{colors.primary-text}"
    typography: "{typography.nav-label}"
  search-bar-pill:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    padding: 14px 20px
    height: 56px
  category-chip:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.full}"
    padding: 10px 16px
    height: 40px
  category-chip-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-dark}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.full}"
    padding: 10px 16px
    height: 40px
  listing-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
  listing-card-photo:
    rounded: "{rounded.md}"
  verified-badge:
    backgroundColor: "{colors.primary-tint}"
    textColor: "{colors.primary-text}"
    typography: "{typography.badge}"
    rounded: "{rounded.full}"
    padding: 4px 10px
  status-pill-draft:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.muted}"
    typography: "{typography.badge}"
    rounded: "{rounded.full}"
    padding: 4px 10px
  status-pill-review:
    backgroundColor: "{colors.accent-tint}"
    textColor: "{colors.ink}"
    typography: "{typography.badge}"
    rounded: "{rounded.full}"
    padding: 4px 10px
  status-pill-live:
    backgroundColor: "{colors.primary-tint}"
    textColor: "{colors.primary-text}"
    typography: "{typography.badge}"
    rounded: "{rounded.full}"
    padding: 4px 10px
  status-pill-paused:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.ink}"
    typography: "{typography.badge}"
    rounded: "{rounded.full}"
    padding: 4px 10px
  status-pill-rejected:
    backgroundColor: "{colors.error-tint}"
    textColor: "{colors.error}"
    typography: "{typography.badge}"
    rounded: "{rounded.full}"
    padding: 4px 10px
  tier-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-host}"
    rounded: "{rounded.lg}"
    padding: 20px
  booking-request-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-host}"
    rounded: "{rounded.lg}"
    padding: 20px
  earnings-display-card:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.earnings-display}"
    rounded: "{rounded.xl}"
    padding: 24px
  earnings-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-host}"
    padding: 16px 0
  payout-option-tile:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.lg}"
    padding: 20px
  payout-option-tile-selected:
    backgroundColor: "{colors.primary-tint}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.lg}"
    padding: 20px
  payout-confirmation:
    backgroundColor: "{colors.accent-tint}"
    textColor: "{colors.ink}"
    typography: "{typography.body-host}"
    rounded: "{rounded.lg}"
    padding: 20px
  offline-banner:
    backgroundColor: "{colors.accent-tint}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    padding: 12px 16px
    height: 44px
  success-banner:
    backgroundColor: "{colors.primary-tint}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 16px
  error-banner:
    backgroundColor: "{colors.error-tint}"
    textColor: "{colors.error}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 16px
  host-story-block:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  voice-note-player:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: 12px 16px
    height: 56px
  rating-row:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
  review-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 16px
  price-summary:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 20px
  sticky-book-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    padding: 12px 16px
    height: 80px
  date-picker-day:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    height: 44px
  date-picker-day-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    height: 44px
  toast:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 14px 16px
  empty-state:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    typography: "{typography.body-host}"
    padding: 48px 24px
  skeleton:
    backgroundColor: "{colors.surface-strong}"
    rounded: "{rounded.md}"
  dark-hero:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-xl}"
    padding: 32px 24px
---

## Overview

This is the design system for a two-sided marketplace that lets local South Africans (guides, drivers, home cooks, concierges) list bookable services and lets travellers find, book and pay for them. The system borrows Airbnb's discipline (one accent, soft radii, photography over typographic muscle, plain copy) and swaps its neutrality for something that could only have been made here: a national green as the single product voltage, a sunset orange for warmth and money, black rather than near-black ink, and a type pairing with more personality than a geometric sans.

The primary user of the system is the **host**, not the traveller. A host may be on a R1,500 Android, on prepaid data, outdoors, and more comfortable speaking than typing. Every default in this file is set for that person first: white canvas for sunlight, 18px body, 56px buttons, one question per screen, no information carried by colour alone, and fonts loaded in as few weights as possible. The traveller app uses the same tokens at a denser setting.

**Key characteristics:**
- One product accent: `{colors.primary}` (#009A4E) carries primary buttons, active navigation, selected states, the verified badge and the wordmark. Used the way Airbnb uses Rausch: one or two moments per screen, never as decoration.
- One warm accent with a job: `{colors.accent}` (#F58A34) is for money and warmth. Earnings, "paid", ratings, category tags, the recording state of the voice button, and offline notices. Always with black text on it, never as text on white.
- Red is brand, not UI: `{colors.brand-red}` (#FF2E2E) lives in the logo, the deck and marketing alongside green and orange. Inside the product, red means error or destructive and nothing else, so the three colours never form a traffic light on a screen.
- Two typefaces, clear jobs: **Cal Sans** (one weight, display only, never below 24px) for screen titles, big numbers and the wordmark. **Montserrat** for everything else in Regular, Medium and SemiBold only.
- Two densities, one system: host screens are large and calm; traveller screens are denser and more photographic. Same tokens, different defaults (see Two Densities).
- Soft shapes: pill buttons, 12px cards, 16px tiles, 24px on the one dark earnings card. No hard corners except the page grid.
- One shadow tier, used rarely. Depth comes from photography, tinted surfaces and rounded clipping.
- Authenticity comes from people, not pattern. Host portraits, host voice notes and host stories are the brand texture. There is no decorative "African" pattern anywhere in the product.

## Status and Precedence

This file is the single source of truth for how the product looks, reads and feels. Owner: Brandon (design). It replaces every earlier decision about design tokens in this repo:

| Earlier decision | Where it was made | Now |
|---|---|---|
| Specno Blue `#489dda` as the brand colour and PWA theme | `docs/TECH_STACK.md` (Styling row, manifest theme); the PRD's "Brand" requirement (`docs/PRD.md` Non-functional requirements, PDF p.18) | `{colors.primary}` #009A4E, with `{colors.accent}` #F58A34 for money and warmth |
| Nunito headings, Inter body | `docs/TECH_STACK.md` Styling row; the same PRD "Brand" requirement | Cal Sans for display, Montserrat for everything else |
| "Design tokens from Specno guidelines" | The PRD's 24-hour build plan, hours 0 to 2 (`docs/PRD.md`, PDF p.19); `docs/README.md` | The front matter of this file |

Where documents disagree, the rule is simple. Anything visual is decided here: colour, type, radius, spacing, elevation, motion, component anatomy and copy tone. Anything about what the product does is decided by `docs/PRD.md.pdf` and `docs/TECH_STACK.md`: features, flows, scope, data and routes. This file follows them. If a component here implies a feature those documents do not have, the feature is not in scope until they say so.

Terminology: this file says **host** and **traveller**, matching the PRD and the database schema. The glossary's "supplier" and the WhatsApp bot's "provider" are the same person as the host.

## Colors

### Brand and accent
- **Green** (`{colors.primary}` #009A4E): The product's single voltage. Primary CTAs, active bottom-nav item, selected option tiles, verified badge fill, step indicator, the record button at rest. Contrast with white is 3.66:1. That clears the 3:1 bar for icons, control fills and large text (24px and up) but not the 4.5:1 bar for smaller text, which includes today's button labels; see Known Gaps. Use `{colors.primary-text}` for any green text.
- **Green Active** (`{colors.primary-active}` #00703A): Pressed state on primary buttons and the dark end of the green ramp.
- **Green Text** (`{colors.primary-text}` #00703A): Any green that is text or a thin icon: links, active nav label, verified badge label, success copy. Passes AA on white.
- **Green Tint** (`{colors.primary-tint}` #E6F4EC): Selected cards and tiles, success banners, the "live" status pill, the verified badge background.
- **Green Disabled** (`{colors.primary-disabled}` #A6DCC0): Disabled primary buttons. Keep white text; the button reads as inactive from the tint alone and the label stays legible enough for a disabled state.
- **Orange** (`{colors.accent}` #F58A34): The warm accent. Earnings highlights, the recording state, star ratings, category tags, payout confirmation backgrounds, the accent button for money actions ("Get paid", "Withdraw"). Contrast on white is about 2.5:1, so it is a fill colour only, always paired with `{colors.on-accent}` black text (8.3:1). Never orange text on white.
- **Orange Active** (`{colors.accent-active}` #D9721F): Pressed accent button.
- **Orange Tint** (`{colors.accent-tint}` #FDECDD): The "in review" pill, offline banners, payout confirmations, warm empty states.
- **Brand Red** (`{colors.brand-red}` #FF2E2E): Brand triad only. Wordmark, splash, deck, marketing. Do not use as a UI accent.

### Semantic
- **Error** (`{colors.error}` #C41E1E): Error copy, destructive button labels, rejected status text. Passes AA on white. Error icons may use `{colors.brand-red}` at large sizes.
- **Error Tint** (`{colors.error-tint}` #FDE4E4): Error banners and the rejected pill.
- **Success**: uses the green ramp (`{colors.primary-tint}` background with `{colors.primary-text}` copy) plus a check icon and a sentence. Because green is also the primary, a success state is never a lone green fill.
- **Warning**: uses the orange tint plus an icon and copy. Because orange is also the accent, a warning is never carried by colour alone.

### Text
- **Ink** (`{colors.ink}` #050505): Headlines, body on the host side, button labels on light fills. Near-black rather than pure black, chosen for maximum contrast on cheap panels in sunlight.
- **Body** (`{colors.body}` #2B2B2B): Long-form traveller copy where ink feels heavy (descriptions, reviews).
- **Muted** (`{colors.muted}` #5C5C5C): Secondary text, captions, inactive nav labels, helper copy. Passes AA on white; use this, not muted-soft, for anything that must be read.
- **Muted Soft** (`{colors.muted-soft}` #8A8A8A): Placeholders and disabled text only.
- **Star Rating** (`{colors.star-rating}` #F58A34): The star glyph is orange; the number next to it is ink. This is a deliberate departure from Airbnb's all-ink rating, because orange is the system's warmth and ratings are a warm signal here.

### Surface
- **Canvas** (`{colors.canvas}` #FFFFFF): Page floor everywhere in the product. Light-only for the host app; sunlight legibility wins.
- **Surface Soft** (`{colors.surface-soft}` #F6F6F6): Price summaries, host story block, inactive chips, input backgrounds when a screen has many fields.
- **Surface Strong** (`{colors.surface-strong}` #EDEDED): Skeletons, draft and paused pills, icon button circles.
- **Surface Dark** (`{colors.surface-dark}` #121212): The one dark surface in the product: the earnings display card and the traveller home hero. Green and orange sit on it beautifully; use it for exactly these brand moments and nowhere else.

### Hairlines
- **Hairline** (`{colors.hairline}` #E0E0E0): Default 1px border on cards, inputs, dividers, inactive step indicator.
- **Hairline Soft** (`{colors.hairline-soft}` #EFEFEF): List separators in long lists.
- **Border Strong** (`{colors.border-strong}` #BDBDBD): Focused input border before the 2px ink treatment, disabled outline buttons.

### Scrim
- **Scrim** (`{colors.scrim}` #000000 at 50%): Modal and sheet backdrop.

### Proportions
Roughly 60 percent neutrals, 30 percent green, 10 percent orange, red almost never. If a screen has more than two green elements or more than one orange element, something is wrong.

## Typography

### Font families
- **Cal Sans** for display. It ships in a single SemiBold weight, which is a gift for data cost: one file. Use it for screen titles (`{typography.display-md}` and up), the earnings number, the hero, and the wordmark. Never below 24px and never for running text, buttons or labels.
- **Montserrat** for everything else. Load Regular (400), Medium (500) and SemiBold (600) only, latin subset, `font-display: swap`. No Bold, no Light, no italics. Montserrat runs wide, so keep line lengths short (the 390px frame does this for you) and line height at 1.5 on body.

Stack: `'Cal Sans', 'Montserrat', -apple-system, system-ui, Roboto, sans-serif` for display; `'Montserrat', -apple-system, system-ui, Roboto, sans-serif` for text. If the webfonts fail to load on a slow connection the system font renders first and swaps; nothing depends on the webfont for layout.

### Hierarchy

| Token | Family | Size | Weight | Line height | Use |
|---|---|---|---|---|---|
| `{typography.earnings-display}` | Cal Sans | 48px | 600 | 1.1 | "R1 250" on the earnings card. The system's one loud moment. |
| `{typography.display-xl}` | Cal Sans | 36px | 600 | 1.15 | Traveller home hero, welcome screen |
| `{typography.display-lg}` | Cal Sans | 28px | 600 | 1.2 | Host screen questions ("What do you offer?") |
| `{typography.display-md}` | Cal Sans | 24px | 600 | 1.25 | Screen titles, listing title on detail, OTP digits |
| `{typography.title-lg}` | Montserrat | 20px | 600 | 1.3 | Language tiles, section heads on host side |
| `{typography.title-md}` | Montserrat | 18px | 600 | 1.3 | Option tiles, card titles, top bar title, sticky bar price |
| `{typography.title-sm}` | Montserrat | 16px | 600 | 1.3 | Traveller card titles, list headings |
| `{typography.body-host}` | Montserrat | 18px | 400 | 1.5 | Default body on the host side |
| `{typography.body-md}` | Montserrat | 16px | 400 | 1.5 | Default body on the traveller side, inputs |
| `{typography.body-sm}` | Montserrat | 14px | 400 | 1.45 | Traveller card meta, review text, fee lines |
| `{typography.caption}` | Montserrat | 14px | 500 | 1.3 | Field labels, helper text, offline banner, rating row |
| `{typography.badge}` | Montserrat | 12px | 600 | 1.2 | Status pills, verified badge. The only 12px in the system. |
| `{typography.button-lg}` | Montserrat | 18px | 600 | 1.2 | Host-side buttons |
| `{typography.button-md}` | Montserrat | 16px | 600 | 1.25 | Traveller-side buttons |
| `{typography.button-sm}` | Montserrat | 14px | 600 | 1.3 | Chips, inline pills |
| `{typography.link}` | Montserrat | 16px | 500 | 1.5 | Inline links, always underlined, in `{colors.primary-text}` |
| `{typography.nav-label}` | Montserrat | 14px | 600 | 1.2 | Bottom nav labels |

### Principles
Sizes are larger than Airbnb's across the board because the host is reading on a small, low-resolution screen, often outdoors. Nothing on the host side goes below 14px except the 12px badge, which is always paired with a tint fill and never carries information on its own.

Cal Sans gives the system its personality but is used sparingly: one title per screen, the earnings number, the hero. If two Cal Sans elements appear on one screen, demote one to `{typography.title-lg}`. Cal Sans sets its word spaces very tight, and at display sizes with negative tracking the words run together, so every display style adds `word-spacing: 0.1em` (the `font-display` utility carries it).

The loud moment is money. Airbnb's is the 64px rating; ours is the 48px earnings number on a dark card, because "how much did I make" is the peak trust signal for a host and the impact signal for the pitch.

## Layout

### Spacing
- Base unit 4px with a 2px micro-step. Tokens: `{spacing.xxs}` 2 · `{spacing.xs}` 4 · `{spacing.sm}` 8 · `{spacing.md}` 12 · `{spacing.base}` 16 · `{spacing.lg}` 24 · `{spacing.xl}` 32 · `{spacing.xxl}` 48 · `{spacing.section}` 64.
- Screen gutter: `{spacing.base}` 16px on phones, `{spacing.lg}` 24px on the host side where the extra breathing room helps focus.
- Stack rhythm on host screens: question (`display-lg`) → `{spacing.sm}` → helper (`caption` muted) → `{spacing.lg}` → controls → `{spacing.xl}` → primary button pinned to the bottom with `{spacing.base}` inset.
- Card internal padding: `{spacing.lg}` 24px on tier, booking and earnings cards; `{spacing.base}` 16px on listing cards and reviews.
- Gutters between cards: `{spacing.base}` 16px in traveller grids; `{spacing.md}` 12px between stacked tiles on the host side.

### Grid and container
- Mobile first. The product is designed at 390px and the host app is mobile-only by intent.
- Traveller listing grid: 1-up on phones, 2-up from 744px, 3-up from 1128px, capped at 1200px.
- Host screens never go multi-column. On a tablet or desktop the host app renders as a centred 480px column on `{colors.surface-soft}`.
- Listing detail on desktop: content left (about 64 percent), sticky booking card right (about 32 percent). On phones the booking card becomes `{component.sticky-book-bar}`.

### Whitespace
Host screens are deliberately empty: one question, one set of controls, one button. Traveller screens are denser, with cards 16px apart under an open hero, in the Airbnb pattern of "open at the fold, dense below".

## Elevation

One shadow tier plus flat.

- **Flat**: nearly everything. Cards separate from the canvas with a 1px `{colors.hairline}` border or a tinted surface, not a shadow.
- **Lift**: `box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.08)`. Used on the sticky book bar, the search bar at rest, bottom sheets, and the floating verified badge over a photo. That is the whole list.
- **Scrim**: `{colors.scrim}` at 50 percent behind sheets and modals.

No shadow on buttons, no shadow on option tiles, no hover elevation on the host side (there is no hover on a phone).

## Components

### Buttons
**`button-primary`**: Green pill, white label at `{typography.button-lg}`, 56px tall, full width on the host side. The one call to action per screen: "Continue", "Publish", "Accept booking".

**`button-primary-compact`**: The same button at 48px with `{typography.button-md}` for the traveller side and inline contexts.

**`button-primary-active`**: Background flips to `{colors.primary-active}`. No transform, no shadow.

**`button-primary-disabled`**: `{colors.primary-disabled}` fill, white label. Used when a required field is empty; the helper copy above says what is missing.

**`button-accent`**: Orange pill with black label. Money actions only: "Get paid", "Withdraw to my phone", "Confirm payout". Its rarity is what makes it mean money.

**`button-secondary`**: White pill, 1px ink border, ink label. "Type it instead", "Decline", "Skip for now".

**`button-tertiary-text`**: Underlined green-text link. "Show more", "Change language".

**`button-destructive`**: White pill, error-red label, 1px `{colors.error}` border. "Cancel booking", "Delete offering". Always followed by a confirmation sheet.

### Voice
**`voice-record-button`**: A 96px green circle with a white microphone glyph, centred on the screen, with "Hold to describe what you offer" beneath in `{typography.body-host}`. The signature host component.

**`voice-record-button-recording`**: Flips to orange with a black waveform glyph, an animated 4px orange ring at 60 percent opacity pulsing outward, and a live timer in `{typography.caption}` beneath. Release ends the recording and moves straight to the drafted listing.

**`voice-note-player`**: A white pill with a play glyph, a simple waveform in `{colors.hairline}` with played portion in `{colors.primary}`, and a duration. Appears on the listing detail so travellers can hear the host in their own voice.

### Onboarding
**`language-tile`**: A 72px white tile with a 1px hairline border, `{rounded.lg}`, the language name in `{typography.title-lg}` in its own script and orthography ("isiXhosa", "Afrikaans"). Four tiles stacked full width. Selected state uses the option-tile-selected treatment.

**`option-tile`** and **`option-tile-selected`**: The one-question-per-screen answer control. 64px white tile with hairline border; selected flips the fill to `{colors.primary-tint}`, the border to 2px `{colors.primary}`, and adds a check glyph at the right edge. Multi-select tiles use the same treatment.

**`otp-input`**: Four 64px boxes with `{typography.display-md}` digits, hairline borders, focused box gets a 2px ink border. Auto-advance, auto-submit.

**`text-input`**: White field, 1px hairline border, `{rounded.md}`, 56px tall, `{typography.body-host}` value, label above in `{typography.caption}` ink (not muted; labels must be read). On focus the border becomes 2px ink. Error state adds a 2px `{colors.error}` border and a line of `{typography.caption}` error copy with an icon beneath.

**`step-indicator`**: A row of 4px segments, one per step, `{colors.hairline}` at rest and `{colors.primary}` for completed and current, with "Step 2 of 5" in `{typography.caption}` muted to the right. Sits directly under the top bar.

**`tier-card`**: A white card with `{rounded.lg}` explaining one verification tier: tier name in `{typography.title-md}`, what it unlocks in `{typography.body-host}`, and a `{component.verified-badge}` preview. Current tier gets the primary-tint fill.

### Navigation
**`top-bar`**: 56px white bar, back chevron left, screen title centred in `{typography.title-md}`, optional text action right in `{typography.link}`. 1px hairline beneath. Inner screens only.

**`page-title`**: The four host tab roots (Offerings, Bookings, Earnings, Profile) have no top bar. The tab's name sits top-left in `{typography.display-xl}` ink with 16px above and 32px below, the way Airbnb titles its tabs. It is the screen's one Cal Sans element, so section headings beneath it use `{typography.title-lg}`. A top bar never repeats the heading under it: when a screen has both, the bar names the flow ("New offering", "Offering") and the heading asks the question.

**`bottom-nav`**: 64px white bar with a top hairline. Host tabs: Offerings, Bookings, Earnings, Profile. Traveller tabs: Explore, Trips, Saved, Profile. Bookings live inside Trips, because a traveller thinks of "my trip", not "my booking". The bar is the same component on both sides. Icon above a 14px label; muted at rest.

**`bottom-nav-item-active`**: Icon and label in `{colors.primary-text}`, icon switches to its filled variant. No underline, no pill.

### Search and browse (traveller)
**`search-bar-pill`**: 56px white pill with the lift shadow, a search glyph, and placeholder copy in `{typography.body-md}` muted ("Where are you going?"). Tapping opens the full-screen search: one line in the traveller's own words with example prompts, recent searches, popular places as chips, a day and a guest stepper, and one primary button. On results the pill turns into a two-line summary (the place in `{typography.title-sm}`, the day and guests in `{typography.caption}` muted) that reopens the search.

**`category-chip`** and **`category-chip-active`**: pills in a horizontal scroll strip, 48px tall so a thumb cannot miss, each with its glyph from the outline set. Rest is `{colors.surface-soft}` with ink label; active is ink fill with white label. The traveller strip reads All, Experiences, Food, Guides, Transport. Food and Guides are chips of their own because that is how a traveller looks, even though the schema files them under wider categories; the mapping is a Known Gap. Transport and Security appear in the strip but are credential-gated in the hackathon build (PRD p.12); their gated look is a Known Gap.

**`listing-card`**: Photo-first. 4:3 image clipped at `{rounded.md}`, a `{component.verified-badge}` floating top-left over the photo with the lift shadow, a save heart top-right: a 36px white circle with the lift shadow inside a 48px hit area, outlined at rest and filled when saved, so the shape carries the state and not a colour. Beneath: title in `{typography.title-sm}`, town and duration in `{typography.body-sm}` muted, the host's 24px portrait with "Hosted by Nomsa" because every listing is a person, then a `{component.rating-row}` left and the price ("From R350 per person", or "for the group") in `{typography.title-sm}` right. A listing with no reviews says "New" instead of showing zero stars.

**`listing-card-photo`**: The photo plate alone, reused in saved lists and the host's "My offerings".

**`rating-row`**: An orange star glyph, the rating in ink `{typography.caption}`, the count in muted ("4.8 (23)").

**`host-story-block`**: On listing detail. `{colors.surface-soft}` block with `{rounded.lg}`, the host's portrait at 56px circle, their first name and town in `{typography.title-md}`, the verified badge, their story in `{typography.body-md}`, and a `{component.voice-note-player}`. This block is the brand; give it room.

**`review-card`**: White card, reviewer initial in a `{colors.surface-strong}` circle, name and date in `{typography.caption}`, rating row, review text in `{typography.body-md}` `{colors.body}`.

**`editorial-rail`**: A home-screen row: a `{typography.title-lg}` heading with an optional "See all" link, then listing cards 288px wide scrolling sideways. The row bleeds to the screen edge so the next card peeks in, and snaps with the page gutter as scroll padding so the first card lines up with the heading. Rows on home: Near you, Loved by travellers, Browse by place, Just added, Hosts in a town.

**`photo-carousel`**: Listing detail opens with it. Native scroll snapping, 4:3 on a phone, 16:9 from tablet, 21:9 on a desktop so the title stays in view. A counter ("2 of 5") sits bottom-right in a `{colors.scrim}` pill at 70 percent with white `{typography.badge}` text. Back, share and save float over the top as 48px white circles with the lift shadow.

**`rating-breakdown`**: Top of "All reviews". The average in `{typography.display-lg}` beside one orange star and the review count, then five rows: the star label, a bar in ink on `{colors.surface-strong}`, and the number of votes, so the bar is never the only signal.

**`trip-card`**: The Trips tab. Drawn like the host's `offering-card`: the photo is the card and the trip's status pill floats on it with the lift shadow. Beneath: title, "Hosted by", then the day and the guests, each with its glyph. A finished trip that has no review yet carries a "Leave a review" link under the card.

**`action-row`**: Trip detail, and any screen with several quiet things to do. Glyph, label in `{typography.title-sm}`, chevron, 56px tall, soft hairline between rows. The screen keeps exactly one loud button, pinned in the footer, and a destructive action sits last in the content, never in the footer.

**`star-input`**: Leaving a review. Five 48px stars in a radio group; chosen stars fill with `{colors.star-rating}`, the rest stay in `{colors.border-strong}`, and the choice is written out underneath ("4 stars") so it never rests on the orange fill alone.

**`safety-sheet`**: Reachable from every trip in every state. Share my trip (a link), the local emergency numbers as large `tel:` rows with the number in `{typography.title-lg}`, and Report a problem.

**`plan-stop`**: One stop in a trip plan: the listing in one line (thumbnail, title, host), a Book button or the trip's status pill, then a control row of 48px round buttons: earlier, later, the day with minus and plus, and remove. The drive time to the stop sits above it in `{typography.caption}` muted with a car glyph. A plan has one green button, Share plan.

**`place-page`**: The PRD's browse-by-place entry. A full-width photo, the town in `{typography.display-xl}`, one paragraph, the hosts who live there as portrait tiles on `{colors.surface-soft}`, then one `editorial-rail` per category.

### Booking
**`date-picker-day`** and **`date-picker-day-selected`**: circles in a month grid; selected is green fill with white numeral. Unavailable days are `{colors.muted-soft}` with a strike, and a line under the grid says so in words. Today gets an ink ring, never a colour, so it does not compete with the chosen day. As built the cells are 48px for thumbs and give way to the token's 44px only on a 360px phone, where seven 48px cells do not fit. Start times sit under the calendar as chips; a listing with no set times says "Any time. Your host confirms."

**`price-summary`**: `{colors.surface-soft}` block with line items in `{typography.body-md}` (price × guests, service fee) and a total row in `{typography.title-md}`. Fees are always shown before payment.

**`sticky-book-bar`**: 80px white bar pinned to the bottom of listing detail with the lift shadow. Price and "per person" left in `{typography.title-md}` and `{typography.caption}`; a `{component.button-primary-compact}` "Book" right.

**`booking-request-card`**: Host side. White card, `{rounded.lg}`, 20px padding. Traveller first name and group size in `{typography.title-md}`, date and time in `{typography.body-host}`, "You will receive R510" in `{typography.title-md}` with a small orange dot, then two buttons side by side: `{component.button-primary}` Accept and `{component.button-secondary}` Decline. The most important host card after earnings. As built: the traveller's initial in a 48px `{colors.surface-strong}` circle leads the card, the offering title sits under the name in `{typography.caption}` muted, the date row carries a calendar glyph, and the group-payment line and "Answer by" deadline sit above the buttons.

### Host lists and listings
**`offering-card`**: Host "My offerings". Photo-first and borderless: the `listing-card-photo` plate, the status pill floating top-left with the lift shadow, then title in `{typography.title-md}` and price and duration in `{typography.body-host}` muted. With no photo the plate becomes the nudge: a camera glyph and "Add photos". 32px between cards; whitespace separates them, not borders.

**`next-steps-card`**: First-run guidance, inline, never a tutorial. White card, hairline border, `{rounded.lg}`, 20px padding. "Your next steps" in `{typography.title-lg}` with "1 of 3 done" in `{typography.caption}` muted, a three-segment progress bar that fills from the left in `{colors.primary}`, then one row per step: a 40px numbered circle (ink outline; green tint with a check when done), title in `{typography.title-md}`, one line in `{typography.caption}` muted, chevron. Done rows go muted and stop being links. The card removes itself when every step is done. On an empty Offerings tab it sits below the `empty-state`; once there is an offering it moves to the top.

**`detail-row`**: The row for anything a host reviews or a traveller reads as a fact. 24px outline icon in ink, top-aligned with the label; label in `{typography.title-md}` ink; the answer beneath in `{typography.body-host}` `{colors.body}`, clamped to three lines; a muted chevron when the row opens an editor. 20px vertical padding, soft hairline between rows. Visuals break up the text: a host finds "Price" by the banknote before reading a word. Each field owns one icon everywhere it appears (`DRAFT_ROW_ICONS` in code), host side and traveller side. An empty optional row shows a green plus and "Add this"; an empty required row, after the host tries to continue, shows the alert glyph and the same words in `{colors.error}`. The "You will receive" note under Price carries the small orange dot. On the traveller's listing the same row drops the chevron and steps down to `{typography.title-sm}` over `{typography.body-md}` ("Things to know").

**`steps-timeline`**: "What you will do". 40px `{colors.surface-soft}` circles numbered in `{typography.title-sm}`, joined by a 1px `{colors.hairline}` line, each step one sentence in `{typography.body-md}`. Airbnb gives every step a photo; we do not, because a host goes live on three photos and the traveller is on mobile data.

**`listing-detail`**: The order of a listing, borrowed from Airbnb's experience page and used by the host's preview and the traveller's detail alike. Photos (one plate; a lead plate over two for three photos; a two-by-two grid from four). A centred header: town and kind in `{typography.caption}` muted, the title in `{typography.display-lg}`, duration and group size muted, then the `rating-row` or a "New" pill. Two rows: "Hosted by" with the host's initial or portrait and their badge, and the meeting place on a `{colors.surface-soft}` map-pin tile. The description. Then sections, each opened by a soft hairline and a `{typography.title-lg}` heading: What you will do (`steps-timeline`), What is included (green checks), When you can come, Meet your host (`host-story-block` with the voice note), Things to know (`detail-row`: who can come, how active it is, what to bring, category extras, languages, cancelling). The `sticky-book-bar` closes it. Left out on purpose: the review carousel until reviews exist, and the map, which belongs to the traveller side only. On the traveller side the `host-story-block` moves up to sit directly under the header, because the person has to be on the first screenful; the header is left-aligned there (category, duration and town in `{typography.caption}`, the title, then the rating row and badge); two reviews show with a "Show all" button; and "Add to a trip plan" closes the page. From 1128px the page is two columns with the price and the Book button in a card that stays in view on the right, and the bar at the bottom steps aside.

### Status
**`verified-badge`**: Green-tint pill, green-text label with a check glyph: "Verified" or "Community verified". On photos it gets the lift shadow.

**`status-pill-draft`**, **`status-pill-review`**, **`status-pill-live`**, **`status-pill-paused`**, **`status-pill-rejected`**: 12px SemiBold labels in tinted pills. Draft and paused are grey, in review is orange tint with ink text, live is green tint with green text, rejected is red tint with red text. Each pill also carries a distinct leading glyph (dot, clock, check, pause, cross) so the state is legible without colour.

### Money
**`earnings-display-card`**: The one dark card. `{colors.surface-dark}` with `{rounded.xl}`, "Total earned" in `{typography.caption}` `{colors.on-dark}` at 70 percent, the amount in `{typography.earnings-display}` white, then two columns beneath for Pending and Paid out in `{typography.title-md}` with the Paid out value in `{colors.accent}`. Sits at the top of the Earnings tab.

**`earnings-row`**: A per-booking line beneath the card: traveller name and date left, amount right, a small status pill.

**`payout-option-tile`** and **`payout-option-tile-selected`**: The "How you get paid" choices: Bank account, Cash send to my phone, Mobile wallet, Cash pickup at a shop. Each tile carries a title, a one-line plain-language description in `{typography.caption}` muted ("Withdraw at any ATM with a PIN, no bank account needed"), and the selected treatment from option tiles.

**`payout-confirmation`**: Orange-tint block with `{rounded.lg}`: "R510 sent to 082 xxx xxxx. Withdraw at any ATM with your PIN." in `{typography.body-host}` ink, with a `{component.button-tertiary-text}` "How does this work?" beneath. This is the impact screen for the pitch.

### Feedback
**`offline-banner`**: A 44px orange-tint strip under the top bar with a cloud-off glyph and "You are offline. We will upload when you are connected." in `{typography.caption}` ink. Persistent while offline; never blocks the host from continuing.

**`success-banner`**: Green-tint block with a check glyph and a sentence. Used for "Your listing is live" and payout success.

**`error-banner`**: Red-tint block, error-red copy, an icon, and the fix in the same sentence ("We could not read your ID photo. Try again in better light.").

**`toast`**: Ink pill with white text, 3 seconds. For quiet confirmations only ("Saved"). On the host side it drops in just under the top bar, not at the bottom: the bottom of a host screen holds the pinned primary button and the nav, and a toast must never cover the next action. It says what really happened, so offline it reads "Saved on your phone", never "We told the traveller".

**`empty-state`**: Centred stack: a line illustration, a title in `{typography.title-lg}` ink, one sentence in `{typography.body-host}` muted, and one button. The illustration is 120 by 96, 2px strokes, drawn in `{colors.border-strong}` with exactly one `{colors.primary}` stroke marking the thing the host will add (`{colors.hairline}` was tried first and vanished on a cheap screen). It shows the object the tab will hold: a listing card for Offerings, a calendar for Bookings, a phone receiving money for Earnings, a magnifier for a missing record. The title is a promise, not an absence ("Your money shows here", never "No earnings"). The button is primary only when it is the screen's main task ("Create my first offering"); otherwise secondary, pointing at the step that fills the tab ("See my offerings", "See how you get paid"). One empty state per tab, never one per empty section, and no `earnings-display-card` while it would only say R0.

**`skeleton`**: `{colors.surface-strong}` blocks at the component's radius, no shimmer on the host side (animation costs battery and attention), a slow shimmer on the traveller side.

### Brand moments
**`dark-hero`**: The traveller home hero on `{colors.surface-dark}`: a `{typography.display-xl}` white headline, a one-line sub in `{colors.on-dark}` at 70 percent, and the search pill below. The wordmark in green. This and the earnings card are the only places the dark surface appears.

## Two Densities

| Setting | Host app | Traveller app |
|---|---|---|
| Body text | `{typography.body-host}` 18px | `{typography.body-md}` 16px |
| Buttons | `{component.button-primary}` 56px, full width | `{component.button-primary-compact}` 48px |
| Screen gutter | 24px | 16px |
| Layout | One question or task per screen | Cards, grids, scroll |
| Minimum text size | 14px (badge 12px only inside a tinted pill) | 12px |
| Hover states | None | Subtle lift on cards |
| Motion | Minimal | Modest |
| Skeletons | Static | Shimmer |
| Photography | The host's own photos, unretouched | Same photos, larger |
| Dark surface | Earnings card only | Home hero only |

Both densities pull from the same colour, radius and spacing tokens, so components move between apps without restyling.

## Motion

- Host side: transitions are cuts or 150ms fades. The only animation is the recording ring on the voice button and a 300ms count-up on the earnings number the first time it appears.
- Traveller side: 200ms ease-out on sheet and card transitions, a slow skeleton shimmer, a gentle scale on the save heart.
- Respect `prefers-reduced-motion` everywhere.

## Imagery and Iconography

- Photography is the brand. Host portraits are unretouched, eye-level, in their own place. Listing photos are the host's own, compressed client-side to about 200 KB, displayed at 4:3 on cards and full-width on detail.
- No stock photography of "Africa". No decorative pattern derived from any specific cultural tradition (Ndebele, shweshwe, beadwork, Basotho blankets). Those belong to specific communities and using them as brand texture is a misstep.
- If a graphic motif is needed, derive an abstract one from the flag's chevron geometry (a stepped or triangular mark) and use it in exactly three places: the logomark, the empty-state illustration and the loading state.
- Icons: a single outlined set at 24px with a 2px stroke (Lucide or Phosphor), filled variants for active nav. Every icon has a text label on the host side.

## Voice and Copy

- Warm, direct, second person. "You'll get R510 by tomorrow", not "Payout scheduled".
- One idea per sentence. Host-side copy reads at roughly a Grade 6 level.
- Every error says what happened and what to do next in one sentence.
- Money is always in rand with a space thousands separator ("R1 250").
- Local words are welcome where natural ("Sharp, your listing is live") but light, and anything in isiXhosa, isiZulu or Afrikaans is checked by a first-language speaker before it ships.
- No em-dashes in product copy; use full stops, commas or colons.

## Accessibility and Low Data

- WCAG 2.1 AA is the target throughout. Every text pair in the component list passes except white labels on the green fill, which is recorded in Known Gaps. Green text always uses `{colors.primary-text}`; orange is never text on white; muted text never drops below `{colors.muted}`.
- Nothing is carried by colour alone: every state has a glyph or a word.
- Touch targets: 56px buttons and 64px tiles on the host side; 48px minimum everywhere; 44px date cells.
- Focus is a 2px ink border, no glow.
- Fonts: Cal Sans (one file) plus three Montserrat weights, latin subset, swap. Target under 120 KB of font total.
- Images lazy-load, are served at display size, and are never autoplaying video.
- Host-side first load target under 500 KB. No map tiles on the host side; a text town name and a "share location" action instead.
- The host app renders correctly with fonts blocked, images blocked and JavaScript delayed.

## Responsive Behaviour

| Name | Width | Key changes |
|---|---|---|
| Phone | < 744px | The design target. Host app full-width single column with pinned bottom button. Traveller listing grid 1-up, booking card becomes the sticky bar. |
| Tablet | 744 to 1128px | Host app renders as a centred 480px column on `{colors.surface-soft}`. Traveller grid 2-up. |
| Desktop | > 1128px | Host app unchanged (centred column). Traveller grid 3-up, listing detail two-column with sticky booking card right, content capped at 1200px. |

## Using This in the Repo

The stack is Next.js 15 with Tailwind (see `docs/TECH_STACK.md`). Tokens are defined once, in the front matter of this file, and mirrored once, in the Tailwind theme. Nothing else hard-codes a hex value, a font name or a radius.

### Token mapping
Tailwind v4 reads its theme from CSS variables in an `@theme` block in `src/app/globals.css`. Each token maps by name:

| Front matter | Theme variable | Utility |
|---|---|---|
| `colors.<name>` | `--color-<name>` | `bg-primary`, `text-primary-text`, `border-hairline` |
| `rounded.<name>` | `--radius-<name>` | `rounded-md` is 12px, `rounded-lg` is 16px. These replace Tailwind's default radius values |
| `typography.<name>` | `--text-<name>` with its `--line-height`, `--letter-spacing` and `--font-weight` | `text-body-host`, `text-display-lg` |
| Font stacks | `--font-display` (Cal Sans), `--font-sans` (Montserrat) | `font-display`, `font-sans` |
| Lift shadow | `--shadow-lift` | `shadow-lift` |
| Breakpoints | `--breakpoint-tablet` 744px, `--breakpoint-desktop` 1128px | `tablet:grid-cols-2`, `desktop:grid-cols-3` |

Spacing uses Tailwind's built-in 4px scale rather than named utilities: xxs is `0.5`, xs `1`, sm `2`, md `3`, base `4`, lg `6`, xl `8`, xxl `12`, section `16`. No colour and type style share a name, so `text-*` utilities stay unambiguous.

### Components
`docs/TECH_STACK.md` names the shared components. They map to the specs in this file:

| Code (`src/shared/components`, `src/core/layout`) | Spec here |
|---|---|
| `Button` | One component. Variants: `button-primary`, `button-primary-compact`, `button-accent`, `button-secondary`, `button-tertiary-text`, `button-destructive` |
| `Input` | `text-input`, `otp-input` |
| `ListingCard` | `listing-card`, `listing-card-photo`, `rating-row` |
| `TierBadge` | `verified-badge`, with `tier-card` for the explainer |
| `EmptyState`, `EmptyIllustration` | `empty-state` and its four illustrations |
| `OfferingDraftStack`, `ListingPreview`, `NextStepsCard`, `OfferingCard` (in `src/features/supply/components`) | `detail-row`, `listing-detail` with `steps-timeline`, `next-steps-card`, `offering-card` |
| `HostShell` | `top-bar`, `step-indicator`, `offline-banner`, host `bottom-nav`, the primary button pinned to the bottom, and the centred 480px column from tablet up |
| `TravellerShell` | `top-bar` or `search-bar-pill`, traveller `bottom-nav`, the pinned action, and two widths: `page` (1200px) for browsing grids, `column` (the host's 480px) for forms, receipts and anything read top to bottom |
| `ChatBubble` | Not specified here. See Known Gaps |

Density belongs to the shell, not to each component. Inside `HostShell` a `Button` defaults to 56px and body text to 18px. Inside `TravellerShell` they default to 48px and 16px. See Two Densities.

### Fonts
Load both families with `next/font` so they are self-hosted and the app makes no runtime request to a font CDN: Montserrat at 400, 500 and 600, latin subset, and Cal Sans as one file. Cal Sans has a single face, and depending on where the file comes from that face is registered as weight 400 or 600. Declare it at 600 to match the tokens, or set `font-synthesis: none` on display styles, so the browser never fakes a bold on top of it. Both families are OFL licensed, so if build-time downloads are unreliable, commit the files and use `next/font/local`.

### Budgets and the manifest
- Host routes stay under 500 KB first load, with fonts under 120 KB of that. No map, chart or drag-and-drop library under `app/(host)`. `CLAUDE.md` carries the same rule.
- PWA manifest: `background_color` is `{colors.canvas}` and `theme_color` is `{colors.primary}`. This replaces the Specno Blue theme.

## Known Gaps

- Dark mode: the host app is light-only by decision. A traveller dark theme is possible on the same tokens but not specified here.
- Map styling on the traveller side (marker colour, tile tint) is not specified; the intent is green markers on a desaturated tile.
- Illustration style for empty states: set by the first four (offerings, bookings, earnings, missing record); see `empty-state`. They are plain objects, not yet the chevron-derived motif described under Imagery, which still waits on the logomark.
- Category icons for the chip strip are not chosen; keep them from the same 24px outline set.
- The logomark and wordmark are not yet designed. The brand triad (green, orange, red on black or white) is the palette for that work.
- Right-to-left and non-latin scripts are out of scope for now; the four launch languages are all latin-script.

Gaps against the PRD and the tech stack:

- Group itinerary: the PRD's must-demo list includes a shared day timeline with blocks, a simple vote and a lock (PRD p.13). None of those components are specified here yet: day timeline, trip block, vote control, locked state.
- Chat-style host screens: decided against. A chat onboarding was built and tried on 18 September; it only suited half of the onboarding, so host screens stay one question per screen with a step indicator. `docs/TECH_STACK.md` still names a `ChatBubble` component and a chat-style host shell; both should come off its lists.
- Earnings preview before publishing: the PRD demo shows "You will receive R510" on the publish step. No component covers it yet. The `payout-confirmation` treatment (orange tint, ink text) is the obvious candidate.
- Booking status pills: offerings have five status pills, bookings have none. Requested, confirmed, declined, completed and cancelled need the same glyph-plus-tint treatment.
- Gated categories: Transport and Security appear in the chip strip but are credential-gated in the hackathon build. Their gated look is not specified.
- Listing facts the schema does not hold yet: the PRD asks every listing for "what to bring" and "what to expect", and experiences for "physical difficulty" and "age suitability". The host app now captures all four (steps, what to bring, how active it is, who can come) and `listing-detail` shows them, but the `Offering` model in `docs/TECH_STACK.md` has no columns for them, nor for the price unit.
- Cancelling: `listing-detail` shows a cancellation line because the PRD requires cancellation terms on every listing, but the PRD sets no window. The 24 hours shown is a placeholder for the product owner to replace. Accessibility notes ("can a wheelchair user join"), which Airbnb lists under Things to know, are not captured at all.
- Traveller prototype, open decisions: the fee a traveller pays is shown as a "Service fee" line but set to R0, because the PRD leaves the fee model open; cancelling gives everything back up to 24 hours before and half after that, both placeholders; the chip strip's Food and Guides are not schema categories; travellers sign in by phone code here while `docs/TECH_STACK.md` says email code or Google; photography is hotlinked stand-ins until hosts upload their own; the meeting-point map and the results map are placeholders; a shared trip or plan link only opens on the phone that made it, because trips and plans live on the device until the API exists.
- Badge wording by tier: the schema has three tiers (registered, identity, community). Which tiers show "Verified" and which show "Community verified" needs confirming with the product owner.

Open accessibility decisions:

- White labels on the green fill: `{colors.on-primary}` on `{colors.primary}` measures 3.66:1. That clears the 3:1 bar for icons and control fills, so the record button's microphone glyph is fine. Button labels at 18px and 16px SemiBold and the selected date numeral are text below 24px, so WCAG AA asks for 4.5:1. Two ways to close it without changing the brand green: use `{colors.ink}` labels on the green fill (5.56:1), or fill text-bearing buttons with a darker green of the same hue (#008945 reaches 4.5:1 with white) and keep #009A4E for icons, borders and indicators. Not decided.
- Control borders in sunlight: `{colors.hairline}` on white is 1.32:1 and `{colors.border-strong}` is 1.88:1. Inputs and option tiles are white on a white canvas, so that 1px line is the only thing marking their edge, and WCAG 1.4.11 asks for 3:1 there. On a cheap panel outdoors the edge may disappear. `{colors.muted-soft}` (#8A8A8A, 3.45:1) at 1.5px on host-side controls would close it. Not decided.
