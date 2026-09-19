---
version: alpha
name: "Hosted"
website: ""
description: "A warm, photography-led two-sided marketplace for local South African tourism services, built on a warm sand canvas with a natural green (#7FBB53) as the single product voltage, carried on ink labels rather than white, and a sunset orange (#F58A34) reserved for money and warmth. Type pairs Onest SemiBold (display and wordmark) with Montserrat (everything else) at generous sizes, because the primary user is a host on an entry-level Android in sunlight. Soft 12px base radius, square-cornered blocks rather than pills, one shadow tier. Two densities share one token set: a large, calm host app (18px body, 56px buttons, one question per screen) and a denser, more photographic traveller app (16px body, 48px buttons, card grids). Red exists in the brand triad but inside the product it belongs to errors only."

colors:
  primary: "#7FBB53"
  primary-active: "#6FAD42"
  primary-tint: "#EEF6E5"
  primary-disabled: "#C3DFAA"
  primary-text: "#446F26"
  primary-deep: "#3D6522"
  accent: "#F58A34"
  accent-active: "#D9721F"
  accent-tint: "#FDECDD"
  on-accent: "#050505"
  brand-red: "#FF2E2E"
  error: "#C41E1E"
  error-tint: "#FDE4E4"
  ink: "#050505"
  body: "#322C24"
  muted: "#5F574B"
  muted-soft: "#8D8478"
  hairline: "#E6DCCB"
  hairline-soft: "#EFE7D8"
  border-strong: "#C9BBA4"
  canvas: "#FFFDF8"
  sand: "#FAF5EC"
  surface-soft: "#F3EBDD"
  surface-strong: "#EADFCD"
  surface-dark: "#121212"
  on-primary: "#050505"
  on-dark: "#FFFFFF"
  star-rating: "#F58A34"
  scrim: "#000000"

typography:
  display-xl:
    fontFamily: "'Onest', 'Montserrat', -apple-system, system-ui, Roboto, sans-serif"
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.5px
  display-lg:
    fontFamily: "'Onest', 'Montserrat', sans-serif"
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.3px
  display-md:
    fontFamily: "'Onest', 'Montserrat', sans-serif"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.2px
  earnings-display:
    fontFamily: "'Onest', 'Montserrat', sans-serif"
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

containers:
  host: 480px
  form: 560px
  page: 1200px

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
  web-header:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.muted}"
    typography: "{typography.nav-label}"
    height: 64px
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
- Two typefaces, clear jobs: **Onest** (SemiBold, display only, never below 24px) for screen titles, big numbers and the wordmark. **Montserrat** for everything else in Regular, Medium and SemiBold only.
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
- **Onest** for display. One SemiBold weight, which is a gift for data cost: one file. It replaced Cal Sans, whose single face was heavier than the logo's line and faked its own bold. Use it for screen titles (`{typography.display-md}` and up), the earnings number, the hero, and the wordmark. Never below 24px and never for running text, buttons or labels.
- **Montserrat** for everything else. Load Regular (400), Medium (500) and SemiBold (600) only, latin subset, `font-display: swap`. No Bold, no Light, no italics. Montserrat runs wide, so keep line lengths short (the 390px frame does this for you) and line height at 1.5 on body.

Stack: `'Onest', 'Montserrat', -apple-system, system-ui, Roboto, sans-serif` for display; `'Montserrat', -apple-system, system-ui, Roboto, sans-serif` for text. If the webfonts fail to load on a slow connection the system font renders first and swaps; nothing depends on the webfont for layout.

### Hierarchy

| Token | Family | Size | Weight | Line height | Use |
|---|---|---|---|---|---|
| `{typography.earnings-display}` | Onest | 48px | 600 | 1.1 | "R1 250" on the earnings card. The system's one loud moment. |
| `{typography.display-xl}` | Onest | 36px | 600 | 1.15 | Traveller home hero, welcome screen |
| `{typography.display-lg}` | Onest | 28px | 600 | 1.2 | Host screen questions ("What do you offer?") |
| `{typography.display-md}` | Onest | 24px | 600 | 1.25 | Screen titles, listing title on detail, OTP digits |
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

Onest gives the system its personality but is used sparingly: one title per screen, the earnings number, the hero. If two display elements appear on one screen, demote one to `{typography.title-lg}`. Onest sets at a normal width and needs no word-spacing correction, which Cal Sans did.

The loud moment is money. Airbnb's is the 64px rating; ours is the 48px earnings number on a dark card, because "how much did I make" is the peak trust signal for a host and the impact signal for the pitch.

## Layout

### Spacing
- Base unit 4px with a 2px micro-step. Tokens: `{spacing.xxs}` 2 · `{spacing.xs}` 4 · `{spacing.sm}` 8 · `{spacing.md}` 12 · `{spacing.base}` 16 · `{spacing.lg}` 24 · `{spacing.xl}` 32 · `{spacing.xxl}` 48 · `{spacing.section}` 64.
- Screen gutter: `{spacing.base}` 16px on phones, `{spacing.lg}` 24px on the host side where the extra breathing room helps focus.
- Stack rhythm on host screens: question (`display-lg`) → `{spacing.sm}` → helper (`caption` muted) → `{spacing.lg}` → controls → `{spacing.xl}` → primary button pinned to the bottom with `{spacing.base}` inset.
- Card internal padding: `{spacing.lg}` 24px on tier, booking and earnings cards; `{spacing.base}` 16px on listing cards and reviews.
- Gutters between cards: `{spacing.base}` 16px in traveller grids; `{spacing.md}` 12px between stacked tiles on the host side.

### Grid and container
- Mobile first. The product is designed at 390px; the host app is phone-primary by intent — the host is a person on an Android in sunlight — but is not phone-only. See Host app on tablet and desktop below.
- Traveller listing grid: 1-up on phones, 2-up from 744px, 3-up from 1128px, capped at 1200px.
- Host screens share one container from 744px up: every screen fills `{containers.page}` under a persistent `{component.web-header}`, left-aligned on `{colors.canvas}`; only form control groups inside a screen constrain to `{containers.form}`. See Host app on tablet and desktop below.
- Listing detail on desktop: content left (about 64 percent), sticky booking card right (about 32 percent). On phones the booking card becomes `{component.sticky-book-bar}`.

### Host app on tablet and desktop
The host stays the primary user and the phone stays the design target for density and one-task-per-screen focus: below 744px the host app is exactly today's phone experience, unchanged in every particular. From 744px up it stops reading as a stretched phone and becomes a proper web layout with its own navigation, on every host screen. This supersedes both tonight's grid-only pass, which left the bottom nav pinned at every width and every flow a 480px column regardless of viewport, and the centred-card pass that followed it, which put every linear flow in a 560px card beside a 1200px header and grid screens — two widths on one screen, still reading as a phone page under a web header.

- **Header and navigation** — `{component.web-header}` appears from 744px up and replaces `{component.bottom-nav}`, which becomes phone-only; the host app never shows both at once. Full spec for each under Navigation.
- **Inner screens** — `{component.top-bar}` keeps its phone form below 744px. From 744px up it collapses into an inline back link and a page heading sitting above the content; see the `top-bar` tablet-and-up variant under Navigation.
- **Container** — every host screen, list and flow alike, fills `{containers.page}` (1200px) from 744px up, with `{spacing.lg}` (24px) gutters, left-aligned on `{colors.canvas}`: no soft-surface page background and no card wraps page content at this width or above (no border, radius or padding block around it). Only a form control group — text/phone/OTP inputs, option-tile lists, text areas, the voice recorder, selects — constrains to `{containers.form}` (560px, renamed from `containers.host-card`) and stays left-aligned inside the page; headings, helper text, detail rows, lists, cards and grids run the full page width. `{containers.host}` (480px) stays reserved for the phone width it already names.
- **Primary action** — `{component.button-primary}` in the shell's `footer` slot stays pinned full-width at the bottom of the phone screen, unchanged. From 744px up it becomes an ordinary inline button at the end of the screen's content, natural width (`w-auto`), left-aligned with the content above it, not pinned. Where a screen carries two actions (Accept and Decline, Profile's two settings actions) they sit in one row with a `{spacing.sm}`-scale gap between them.
- **List screens** — Offerings, Bookings, Earnings — the `tablet:grid-cols-2 desktop:grid-cols-3` grid on `{component.offering-card}` and the `booking-request-card` sections is a content rule inside the shared page container, not a container rule of its own; payout history and the dark earnings card stay single column. `page-title` is unaffected, since a tab root — including Profile — never had a `top-bar` to collapse.
- **Profile** — the fourth tab root, full width like the rest, not a card: the identity row (initial, name, town, phone) sits across the top, the settings list runs full width beneath it, and its two actions sit inline in one row at the end, per Primary action above.

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
**`top-bar`**: 56px white bar, back chevron left, screen title centred in `{typography.title-md}`, optional text action right in `{typography.link}`. 1px hairline beneath. Inner screens only, phone only (< 744px); the tablet-and-up form below is a variant of this component, not a second one.

*Tablet and up variant*: the bar itself disappears; its job moves into the content, left-aligned at the top of the `{containers.page}` container described under Host app on tablet and desktop. The back chevron becomes an inline back link — chevron plus label in `{typography.link}` (underlined, `{colors.primary-text}`). The screen title becomes the page heading in `{typography.display-md}` ink, left-aligned, `{spacing.sm}` below the back link. The optional text action moves from the bar's right edge to sit beside this heading, same baseline, still `{typography.link}`. A `step-indicator`, where the screen has one, keeps sitting directly under the heading, unchanged from its phone position directly under the bar.

**`page-title`**: The four host tab roots (Offerings, Bookings, Earnings, Profile) have no top bar. The tab's name sits top-left in `{typography.display-xl}` ink with 16px above and 32px below, the way Airbnb titles its tabs. It is the screen's one display element, so section headings beneath it use `{typography.title-lg}`. A top bar never repeats the heading under it: when a screen has both, the bar names the flow ("New offering", "Offering") and the heading asks the question.

**`bottom-nav`**: 64px white bar with a top hairline. Phone only (< 744px) on the host side, where `{component.web-header}` takes over from 744px up; pinned at every width on the traveller side, which has no web-header equivalent and is out of scope for this amendment. Host tabs: Offerings, Bookings, Earnings, Profile. Traveller tabs: Explore, Trips, Bookings, Profile, matching the traveller routes in `docs/TECH_STACK.md`. A Saved tab returns when favourites exist. Icon above a 14px label; muted at rest.

**`bottom-nav-item-active`**: Icon and label in `{colors.primary-text}`, icon switches to its filled variant. No underline, no pill.

**`web-header`**: Host only, tablet and up (≥ 744px), replacing `{component.bottom-nav}` at that width. A 64px `{colors.canvas}` bar spanning the top of the `{containers.page}` frame, with a 1px `{colors.hairline}` bottom edge, sticky above the content the same way the phone shell's top-bar-and-banner stack sticks today — above `{component.offline-banner}`, which continues to render directly beneath it. Horizontal padding is `{spacing.lg}` at the frame edges. The app name sits left in `{typography.title-lg}` `{colors.primary-text}`, the wordmark's colour, ahead of the wordmark itself being designed (see Known Gaps). The four host tabs (Offerings, Bookings, Earnings, Profile) follow immediately after, left-aligned, as plain text links in `{typography.nav-label}` with `{spacing.lg}` between them: text only, no icon, since a 64px horizontal bar has no room for the icon-above-label pairing `bottom-nav` uses and four words are already unambiguous without one. The active tab matches `bottom-nav-item-active`'s intent exactly: label in `{colors.primary-text}`, no underline, no pill. "Sign out" sits right, pushed to the far edge, as a text action in `{typography.link}`.

### Search and browse (traveller)
**`search-bar-pill`**: 56px white pill with the lift shadow, a search glyph, and placeholder copy in `{typography.body-md}` muted ("Where are you going?"). Tapping opens a full-screen search sheet.

**`category-chip`** and **`category-chip-active`**: 40px pills in a horizontal scroll strip. Rest is `{colors.surface-soft}` with ink label; active is ink fill with white label. The strip follows the four `OfferingCategory` values in the schema: Experiences, Guides and concierge, Transport, Security. Food is an Experience, not a category of its own. Transport and Security appear in the strip but are credential-gated in the hackathon build (PRD p.12); their gated look is a Known Gap.

**`listing-card`**: Photo-first. 4:3 image clipped at `{rounded.md}`, a `{component.verified-badge}` floating top-left over the photo with the lift shadow, a save heart top-right in a white circle (post-MVP: there is no saved-listings model yet, so leave the heart out of the hackathon build). Beneath: title in `{typography.title-sm}`, town and duration in `{typography.body-sm}` muted, a `{component.rating-row}`, and the price ("From R350 per person") in `{typography.title-sm}` right-aligned.

**`listing-card-photo`**: The photo plate alone, reused in saved lists and the host's "My offerings".

**`rating-row`**: An orange star glyph, the rating in ink `{typography.caption}`, the count in muted ("4.8 (23)").

**`host-story-block`**: On listing detail. `{colors.surface-soft}` block with `{rounded.lg}`, the host's portrait at 56px circle, their first name and town in `{typography.title-md}`, the verified badge, their story in `{typography.body-md}`, and a `{component.voice-note-player}`. This block is the brand; give it room.

**`review-card`**: White card, reviewer initial in a `{colors.surface-strong}` circle, name and date in `{typography.caption}`, rating row, review text in `{typography.body-md}` `{colors.body}`.

### Booking
**`date-picker-day`** and **`date-picker-day-selected`**: 44px circles; selected is green fill with white numeral. Unavailable days are `{colors.muted-soft}` with a strike.

**`price-summary`**: `{colors.surface-soft}` block with line items in `{typography.body-md}` (price × guests, service fee) and a total row in `{typography.title-md}`. Fees are always shown before payment.

**`sticky-book-bar`**: 80px white bar pinned to the bottom of listing detail with the lift shadow. Price and "per person" left in `{typography.title-md}` and `{typography.caption}`; a `{component.button-primary-compact}` "Book" right.

**`booking-request-card`**: Host side. White card, `{rounded.lg}`, 20px padding. Traveller first name and group size in `{typography.title-md}`, date and time in `{typography.body-host}`, "You will receive R510" in `{typography.title-md}` with a small orange dot, then two buttons side by side: `{component.button-primary}` Accept and `{component.button-secondary}` Decline. The most important host card after earnings. As built: the traveller's initial in a 48px `{colors.surface-strong}` circle leads the card, the offering title sits under the name in `{typography.caption}` muted, the date row carries a calendar glyph, and the group-payment line and "Answer by" deadline sit above the buttons.

### Host lists and listings
**`offering-card`**: Host "My offerings". Photo-first and borderless: the `listing-card-photo` plate, the status pill floating top-left with the lift shadow, then title in `{typography.title-md}` and price and duration in `{typography.body-host}` muted. With no photo the plate becomes the nudge: a camera glyph and "Add photos". 32px between cards; whitespace separates them, not borders.

**`next-steps-card`**: First-run guidance, inline, never a tutorial. White card, hairline border, `{rounded.lg}`, 20px padding. "Your next steps" in `{typography.title-lg}` with "1 of 3 done" in `{typography.caption}` muted, a three-segment progress bar that fills from the left in `{colors.primary}`, then one row per step: a 40px numbered circle (ink outline; green tint with a check when done), title in `{typography.title-md}`, one line in `{typography.caption}` muted, chevron. Done rows go muted and stop being links. The card removes itself when every step is done. On an empty Offerings tab it sits below the `empty-state`; once there is an offering it moves to the top.

**`detail-row`**: The row for anything a host reviews or a traveller reads as a fact. 24px outline icon in ink, top-aligned with the label; label in `{typography.title-md}` ink; the answer beneath in `{typography.body-host}` `{colors.body}`, clamped to three lines; a muted chevron when the row opens an editor. 20px vertical padding, soft hairline between rows. Visuals break up the text: a host finds "Price" by the banknote before reading a word. Each field owns one icon everywhere it appears (`DRAFT_ROW_ICONS` in code), host side and traveller side. An empty optional row shows a green plus and "Add this"; an empty required row, after the host tries to continue, shows the alert glyph and the same words in `{colors.error}`. The "You will receive" note under Price carries the small orange dot. On the traveller's listing the same row drops the chevron and steps down to `{typography.title-sm}` over `{typography.body-md}` ("Things to know").

**`steps-timeline`**: "What you will do". 40px `{colors.surface-soft}` circles numbered in `{typography.title-sm}`, joined by a 1px `{colors.hairline}` line, each step one sentence in `{typography.body-md}`. Airbnb gives every step a photo; we do not, because a host goes live on three photos and the traveller is on mobile data.

**`listing-detail`**: The order of a listing, borrowed from Airbnb's experience page and used by the host's preview and the traveller's detail alike. Photos (one plate; a lead plate over two for three photos; a two-by-two grid from four). A centred header: town and kind in `{typography.caption}` muted, the title in `{typography.display-lg}`, duration and group size muted, then the `rating-row` or a "New" pill. Two rows: "Hosted by" with the host's initial or portrait and their badge, and the meeting place on a `{colors.surface-soft}` map-pin tile. The description. Then sections, each opened by a soft hairline and a `{typography.title-lg}` heading: What you will do (`steps-timeline`), What is included (green checks), When you can come, Meet your host (`host-story-block` with the voice note), Things to know (`detail-row`: who can come, how active it is, what to bring, category extras, languages, cancelling). The `sticky-book-bar` closes it. Left out on purpose: the review carousel until reviews exist, and the map, which belongs to the traveller side only.

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

**`landing-page`**: the public front door at `/`, and the only place both apps are described at once. A wordmark row with a sign-in link, then the `dark-hero` treatment carrying the headline, the one-line sub and two buttons (primary to Explore, secondary to Become a host), then a strip of live offering photos on the same dark panel at 4:3 with the title and town under each, captioned "On Hosted right now". Below on the canvas: the category tiles, then two `{rounded.xl}` panels side by side from the desktop breakpoint, one per side of the marketplace, the host one on `{colors.primary-tint}` so the two read as a pair rather than a hierarchy. Each panel is a title, one sentence, three icon rows and one button. The photos are whatever is live in the database, de-duplicated by image, so the page is never a mock-up of the product. This is the third dark surface, with the traveller hero and the earnings card.

**`green-hero`**: the landing page and the traveller home both open on a `{colors.primary-deep}` panel that runs to the screen edges and ends in a `{rounded.lg}` curve at the bottom, one step outside the `{rounded.md}` of the controls it holds. It carries the brand pattern as a `pattern-field`, the logo reversed out (white line, orange dot), a `{typography.display-xl}` white headline, a one-line sub at 70 percent, and either the search block or the two entry buttons. White type on it measures 6.8:1.

**`pattern-field`**: the brand pattern behind one coloured surface, never a strip and never beside text. It is a 556px hand-drawn tile carried as an alpha mask, tiled at 420px, so its colour comes from a token: white at 3 percent on the green, `{colors.accent}` at 10 percent on the canvas with a downward gradient that fades it out before the text below. It is the only pattern allowed behind type, which is why it is drawn in one tone of its own ground and nothing else.

**`deck`**: the pitch at `/presentation`, public so it opens from any machine in the room. A fixed 960 by 540 stage scaled to the window, one slide mounted at a time so every entrance replays, and four grounds only: the `green-hero` with its `pattern-field` for the title, `{colors.surface-dark}` for the chapters between, `{colors.canvas}` for data, and `{colors.primary}` for the one-liner. It draws the same components and tokens as the product, and its phone frames are live iframes of the real app, so a change to the design language reaches the deck without anyone editing a slide. On the deep green, the bright green measures 2.96:1 and the orange 2.78:1, so a highlighted line there is sand and the logo reverses to white.

**`place-tile`**: browse by place is a poster, not a thumbnail. A 4:3 photo sits directly on a `{colors.primary-deep}` panel carrying the `pattern-field`, with the place name in `{typography.title-sm}` white and its region and host count under it at 70 percent. The two halves share one `{rounded.lg}` clip, so the photo squares off where the green begins. It is the same tile the traveller home, the landing page's showcase and the place page all use, which is why a place never reads as another listing card.

**`splash`**: the first thing the app shows while a screen is on its way, and a `loading.tsx` in the root, traveller and host trees so a slow connection gets the brand rather than a blank page. The `green-hero` ground and its `pattern-field`, with the mark drawing itself on in one 1400ms stroke, the dot landing at 1300ms, the wordmark fading up at 1500ms and the line under it at 1800ms. It respects `prefers-reduced-motion`, where everything simply appears. The same drawing the pitch deck opens on.

**Shape, and what stays round.** Everything a finger presses is a block: `{rounded.md}` for buttons, inputs, the search block and the month step; `{rounded.sm}` for chips, toolbar buttons, date cells and the controls that float over a photo; `{rounded.xs}` for badges, status pills and the photo counter. Round is reserved for what is actually round: a portrait, a switch track, the record ring, a progress bar's cap, a dot. A white surface is the warm paper with a hairline, never a floating shadow; a shadow means the thing is over content, which is why it survives on a sheet, a toast and the sticky book bar.

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
- Fonts: Onest (one weight) plus three Montserrat weights, latin subset, swap. Target under 120 KB of font total.
- Images lazy-load, are served at display size, and are never autoplaying video.
- Host-side first load target under 500 KB. No map tiles on the host side; a text town name and a "share location" action instead.
- The host app renders correctly with fonts blocked, images blocked and JavaScript delayed.

## Responsive Behaviour

| Name | Width | Key changes |
|---|---|---|
| Phone | < 744px | The design target. Host app full-width single column with pinned `{component.bottom-nav}` and pinned bottom button, `top-bar` on inner screens. Traveller listing grid 1-up, booking card becomes the sticky bar. |
| Tablet | 744 to 1128px | Host `{component.bottom-nav}` is replaced by `{component.web-header}`. Every host screen fills the same `{containers.page}` container on `{colors.canvas}`, left-aligned, no card: list screens (Offerings, Bookings, Earnings) add `tablet:grid-cols-2` on their cards; other screens, including Profile, sit below an inline back link and heading in place of `top-bar`, with form control groups capped at `{containers.form}`. The pinned primary button becomes an inline one. Traveller grid 2-up, `{component.bottom-nav}` still pinned. |
| Desktop | > 1128px | Host list screens go `desktop:grid-cols-3`, capped at `{containers.page}` like the traveller grid; every other host screen stays the same `{containers.page}` container beneath `{component.web-header}`, form control groups still capped at `{containers.form}`. Traveller grid 3-up, listing detail two-column with sticky booking card right, content capped at `{containers.page}`. |

## Using This in the Repo

The stack is Next.js 15 with Tailwind (see `docs/TECH_STACK.md`). Tokens are defined once, in the front matter of this file, and mirrored once, in the Tailwind theme. Nothing else hard-codes a hex value, a font name or a radius.

### Token mapping
Tailwind v4 reads its theme from CSS variables in an `@theme` block in `src/app/globals.css`. Each token maps by name:

| Front matter | Theme variable | Utility |
|---|---|---|
| `colors.<name>` | `--color-<name>` | `bg-primary`, `text-primary-text`, `border-hairline` |
| `rounded.<name>` | `--radius-<name>` | `rounded-md` is 12px, `rounded-lg` is 16px. These replace Tailwind's default radius values |
| `typography.<name>` | `--text-<name>` with its `--line-height`, `--letter-spacing` and `--font-weight` | `text-body-host`, `text-display-lg` |
| Font stacks | `--font-display` (Onest), `--font-sans` (Montserrat) | `font-display`, `font-sans` |
| Lift shadow | `--shadow-lift` | `shadow-lift` |
| Breakpoints | `--breakpoint-tablet` 744px, `--breakpoint-desktop` 1128px | `tablet:grid-cols-2`, `desktop:grid-cols-3` |
| `containers.<name>` | `--container-<name>` | `max-w-host` (480px), `max-w-form` (560px), `max-w-page` (1200px) |

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
| `HostShell` | `web-header` (744px up, replacing `bottom-nav`), phone-only host `bottom-nav` (< 744px), `top-bar` on phone with its inline-back-link-and-heading variant from 744px up, `step-indicator`, `offline-banner`, the primary button pinned to the bottom on phone and inline from 744px up, the centred `{containers.host}` (480px) column on phone widening to the fluid `{containers.page}` (1200px)-capped column from 744px up for every screen, with form control groups inside it capped at `{containers.form}` (560px) (see Host app on tablet and desktop) |
| `TravellerShell` | `top-bar` or `search-bar-pill`, traveller `bottom-nav`, content capped at 1200px |
| `ChatBubble` | Not specified here. See Known Gaps |

Density belongs to the shell, not to each component. Inside `HostShell` a `Button` defaults to 56px and body text to 18px. Inside `TravellerShell` they default to 48px and 16px. See Two Densities.

### Fonts
Load both families with `next/font` so they are self-hosted and the app makes no runtime request to a font CDN: Montserrat at 400, 500 and 600 and Onest at 600, latin subset. `font-synthesis: none` stays on the display utility so no weight is ever faked. Under 120 KB of font total. Onest is under test in place of Cal Sans, whose single face was registered at 400 and needed a 600 declared to match the tokens; if it goes back, restore the word-spacing note with it. The rest of this paragraph described that styles, so the browser never fakes a bold on top of it. Both families are OFL licensed, so if build-time downloads are unreliable, commit the files and use `next/font/local`.

### Budgets and the manifest
- Host routes stay under 500 KB first load, with fonts under 120 KB of that. No map, chart or drag-and-drop library under `app/(host)`. `CLAUDE.md` carries the same rule.
- PWA manifest: `background_color` is `{colors.canvas}` and `theme_color` is `{colors.primary}`. This replaces the Specno Blue theme.

## Known Gaps

- Dark mode: the host app is light-only by decision. A traveller dark theme is possible on the same tokens but not specified here.
- Map styling on the traveller side (marker colour, tile tint) is not specified; the intent is green markers on a desaturated tile.
- Illustration style for empty states: set by the first four (offerings, bookings, earnings, missing record); see `empty-state`. They are plain objects, not yet the chevron-derived motif described under Imagery, which still waits on the logomark.
- Category icons for the chip strip are not chosen; keep them from the same 24px outline set.
- ~~The logomark and wordmark are not yet designed.~~ Done: `HostedMark` is a home drawn in one continuous `{colors.primary}` line, reversed to white on a coloured panel,, 5px round-capped in a 64px box, curling inside to a single `{colors.accent}` dot, the person at the heart of it. `HostedLogo` pairs it with the wordmark in the display face at `{typography.display-md}` (`sm` drops both to `{typography.title-lg}` for a 64px bar) with a 10px gap, the same SemiBold as the headings it leads. It leads the landing page, the traveller `dark-hero` and the host welcome screen, and it is the tab icon at `src/app/icon.svg`. The PWA icons in `public/icons` are still the placeholder pin and need regenerating from the mark.
- Right-to-left and non-latin scripts are out of scope for now; the four launch languages are all latin-script.

Gaps against the PRD and the tech stack:

- Group itinerary: the PRD's must-demo list includes a shared day timeline with blocks, a simple vote and a lock (PRD p.13). None of those components are specified here yet: day timeline, trip block, vote control, locked state.
- Chat-style host screens: decided against. A chat onboarding was built and tried on 18 September; it only suited half of the onboarding, so host screens stay one question per screen with a step indicator. `docs/TECH_STACK.md` still names a `ChatBubble` component and a chat-style host shell; both should come off its lists.
- Earnings preview before publishing: the PRD demo shows "You will receive R510" on the publish step. No component covers it yet. The `payout-confirmation` treatment (orange tint, ink text) is the obvious candidate.
- Booking status pills: offerings have five status pills, bookings have none. Requested, confirmed, declined, completed and cancelled need the same glyph-plus-tint treatment.
- Gated categories: Transport and Security appear in the chip strip but are credential-gated in the hackathon build. Their gated look is not specified.
- Listing facts the schema does not hold yet: the PRD asks every listing for "what to bring" and "what to expect", and experiences for "physical difficulty" and "age suitability". The host app now captures all four (steps, what to bring, how active it is, who can come) and `listing-detail` shows them, but the `Offering` model in `docs/TECH_STACK.md` has no columns for them, nor for the price unit.
- Cancelling: `listing-detail` shows a cancellation line because the PRD requires cancellation terms on every listing, but the PRD sets no window. The 24 hours shown is a placeholder for the product owner to replace. Accessibility notes ("can a wheelchair user join"), which Airbnb lists under Things to know, are not captured at all.
- Badge wording by tier: the schema has three tiers (registered, identity, community). Which tiers show "Verified" and which show "Community verified" needs confirming with the product owner.

Open accessibility decisions:

- ~~White labels on the green fill.~~ Closed by the new green: the fill is `{colors.primary}` #7FBB53 and its label is `{colors.on-primary}`, now ink, at 8.87:1. What the lighter green costs instead is the edge of a filled control against the page: green on sand measures 2.12:1, below the 3:1 WCAG 1.4.11 asks of a control boundary. A filled button is identified by its fill and its label rather than by an outline, so this is accepted deliberately; an input or an option tile, which has no fill of its own, keeps a hairline and its own border. The old note read: white on the old green measured 3.66:1. That clears the 3:1 bar for icons and control fills, so the record button's microphone glyph is fine. Button labels at 18px and 16px SemiBold and the selected date numeral are text below 24px, so WCAG AA asks for 4.5:1. Two ways to close it without changing the brand green: use `{colors.ink}` labels on the green fill (5.56:1), or fill text-bearing buttons with a darker green of the same hue (#008945 reaches 4.5:1 with white) and keep #009A4E for icons, borders and indicators. Not decided.
- Control borders in sunlight: `{colors.hairline}` on white is 1.32:1 and `{colors.border-strong}` is 1.88:1. Inputs and option tiles are white on a white canvas, so that 1px line is the only thing marking their edge, and WCAG 1.4.11 asks for 3:1 there. On a cheap panel outdoors the edge may disappear. `{colors.muted-soft}` (#8A8A8A, 3.45:1) at 1.5px on host-side controls would close it. Not decided.
