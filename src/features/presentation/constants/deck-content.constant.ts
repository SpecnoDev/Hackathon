import { APP_NAME } from '@/core/constants';

/** The stage is laid out once at this size and scaled to the screen, so DESIGN.md's type sizes read as deck sizes. */
export const STAGE_WIDTH = 960;
export const STAGE_HEIGHT = 540;

/** A phone the size the app is designed for, shown inside a slide. */
export const PHONE_WIDTH = 390;
export const PHONE_HEIGHT = 844;

export const COUNT_UP_MS = 1400;
export const STAGGER_MS = 110;

/**
 * Every figure on a slide, with where it came from. Carried over from the team's trends deck, which says of each:
 * check it before you quote it. `derived` figures are worked out here from the others and are marked as such on the slide.
 */
export const DECK_FIGURES = {
  arrivals: { value: 6.57, unit: 'm', growthPercent: 12.4, period: 'Jan to Jul 2026' },
  /** Derived: 6.57m is 12.4% up, so the same months a year before were about 6.57 / 1.124. */
  arrivalsPriorYear: { value: 5.85, unit: 'm', period: 'Jan to Jul 2025' },
  jobs: { value: 1.8, unit: 'm', gdpPercent: 9 },
  cashBusinesses: { value: 2.4, unit: 'm' },
  staysPer100: { stays: 5, of: 100 },
  leakage: { fromPercent: 40, toPercent: 50 },
  market: { fromYear: 2025, fromTrillion: 3.2, toYear: 2034, toTrillion: 6.1, growthPercent: 7.4 },
  adventureSharePercent: 29.9,
  /** The PRD's worked example: a R600 booking at a 15% platform fee. */
  booking: { totalCents: 60_000, hostReceivesCents: 51_000, feeCents: 9_000 },
  pot: { totalCents: 240_000, shareCents: 60_000, friends: ['Lerato', 'James', 'Aisha', 'Thandi'], paidAtStart: 3 },
  /** Measured by `next build` on this branch. The PRD's budget for the host side is 500 KB on first load. */
  firstLoad: { budgetKb: 500, hostKb: 170, travellerKb: 187 },
  minutesToFirstListing: 15,
} as const;

export const DECK_SOURCES = {
  sa: 'International arrivals, jobs and share of GDP: StatsSA and WTTC via SAnews, 2026. Cash micro-businesses: FinScope. The 2025 bar is derived from the 12.4% rise. Check each before you quote it.',
  money: 'UNCTAD puts import leakage at 40 to 50% of gross tourism earnings for small developing economies. The $5 figure is widely cited from UNEP. Check each before you quote it.',
  market: 'Projected market size: Polaris Market Research and Market Intelo. Verify the exact figure before stage.',
  luxury: 'Synthesis of 2026 luxury travel trend coverage: Haute Retreats, AMT Travel, The Luxe Voyager and others.',
  build: 'First-load sizes measured with next build on this branch. Budget from the PRD.',
} as const;

/** The live app screens shown inside phones. Swap any of them for a screenshot by giving the slide an image instead. */
export const DECK_SCREENS = {
  hostCreate: '/host/offerings/new',
  hostBookings: '/host/bookings',
  hostEarnings: '/host/earnings',
  travellerHome: '/explore',
  travellerListing: '/listings/off-langa-lunch',
} as const;

export const DECK_COPY = {
  appName: APP_NAME,
  event: 'Builders Table 2026 · Team Specno',
  repo: 'github.com/SpecnoDev/Hackathon',
  chrome: {
    previous: 'Previous slide',
    next: 'Next slide',
    fullScreen: 'Full screen',
    exitFullScreen: 'Leave full screen',
    counter: (current: number, total: number): string => `${current} / ${total}`,
    hint: 'Use the arrow keys, or tap the sides',
    livePhone: 'This is the real app. You can tap it.',
    phoneLabel: (what: string): string => `The ${what} screen of the app`,
  },
  title: {
    lines: ['The most valuable', 'thing in travel stopped', 'being a room.'],
    turn: 'It became a person.',
    sub: 'The problem, the numbers behind it, and the marketplace we built in 24 hours to close the gap.',
    mark: ['A home, drawn in one line.', 'A person at the heart of it.'],
  },
  problem: {
    eyebrow: 'The problem',
    headline: 'Money flows past the people who make a place worth visiting.',
    body: 'Tourism is one of South Africa’s biggest job creators. Its benefits pool in hotels, franchises and established operators. The guide, the taxi driver, the home cook and the person who knows who to call are shut out of the platforms where travellers spend.',
    people: ['The local guide', 'The taxi driver', 'The home cook', 'The crafter', 'The fixer who knows who to call'],
  },
  numbers: {
    eyebrow: 'South Africa, right now',
    headline: 'The country is winning.',
    turn: 'The person is not.',
    arrivals: 'international arrivals',
    arrivalsGrowth: (percent: number): string => `up ${percent}% year on year`,
    jobs: 'jobs supported by tourism',
    jobsNote: (percent: number): string => `and close to ${percent}% of GDP`,
    cash: 'micro-businesses trading in cash',
    cashNote: 'and not on any platform',
    derived: 'derived',
  },
  money: {
    eyebrow: 'Where the money lands',
    headline: 'The experience is local. The money is not.',
    stays: (stays: number, of: number): string => `$${stays} of every $${of}`,
    staysBody: 'a traveller from a wealthy country spends on a package holiday stays in the destination economy.',
    leaks: (from: number, to: number): string => `${from} to ${to}%`,
    leaksBody: 'of gross tourism earnings leak straight back out of small developing economies.',
    stayLabel: 'Stays',
    leaveLabel: 'Leaves',
  },
  doors: {
    eyebrow: 'The gap',
    headline: 'The person who is the experience cannot get on the platform.',
    sub: 'Two locked doors, one on each side of the same transaction.',
    supply: {
      title: 'Supply cannot list',
      items: [
        { icon: 'smartphone', title: 'Technology', body: 'An entry-level Android, rationed prepaid data, patchy signal and a long English web form.' },
        { icon: 'wallet', title: 'Finance', body: 'Platforms verify with a card and pay into a bank account. Micro-businesses run on cash.' },
        { icon: 'shield-check', title: 'Trust', body: 'No reviews, no verification, no brand. A stranger has no reason to book.' },
      ],
    },
    demand: {
      title: 'Demand cannot pay',
      amountCents: 240_000,
      body: 'sits on one person’s card while they chase four friends for their share. Most groups downgrade the plan or never book it at all.',
    },
    close: 'Hosted opens both doors.',
  },
  oneLiner: {
    eyebrow: 'Our answer',
    statement: [
      'A marketplace that removes the technological and financial barriers keeping local South Africans out of the tourism economy,',
      'so anyone with something authentic to offer can list it, get booked and get paid,',
      'even without a bank account or reliable data.',
    ],
    tagline: 'Hosted by locals. Hosted all the way.',
  },
  trendOne: {
    eyebrow: 'Why now · 01 · The global market',
    headline: 'Experience became the product.',
    body: (percent: number): string => `Commodity travel is flat. The experiential segment is compounding at roughly ${percent}% a year and is on track to nearly double inside a decade.`,
    caption: 'Global experiential travel market, drawn to one scale',
    trillion: (value: number): string => `$${value}tn`,
    share: 'of that market was adventure and activity travel in 2025, the fastest-moving slice of it.',
    shareNote: 'Premium and mid-tier alike, not only the top end.',
  },
  trendTwo: {
    eyebrow: 'Why now · 02 · What people actually buy',
    headline: 'Luxury did not die. It changed address.',
    body: 'Every 2026 luxury report describes the same move: away from opulence, toward access. The thing being sold is no longer a room. It is a person’s time, place and knowledge.',
    was: { label: 'Was', items: ['The suite', 'The brand on the bathrobe', 'A view of the place'] },
    is: { label: 'Is', items: ['The person who knows the place', 'A meal cooked in their home', 'A day inside local life'] },
  },
  host: {
    eyebrow: 'How it works · the host',
    headline: 'The host lists by speaking.',
    steps: [
      { title: 'Speak.', body: 'A voice note in isiXhosa, isiZulu, Afrikaans or English.' },
      { title: 'Review.', body: 'AI drafts the listing. The host fixes a word and adds photos.' },
      { title: 'Publish.', body: '“You will receive R510” is shown before it goes live.' },
    ],
    close: 'From “I have something to offer” to “I have been paid”, without help.',
    phone: 'create an offering',
  },
  payout: {
    eyebrow: 'How it works · getting paid',
    headline: 'Paid to a phone number. No bank account.',
    flow: [
      { icon: 'credit-card', label: 'Traveller pays' },
      { icon: 'lock', label: 'Hosted holds it' },
      { icon: 'check', label: 'Experience done' },
      { icon: 'smartphone', label: 'Cash send to a phone' },
      { icon: 'banknote', label: 'Cash at any ATM, with a PIN' },
    ],
    split: { booking: 'The traveller pays', host: 'The host receives', fee: 'Our fee' },
    tryIt: 'Drag the price. The host always sees what they will receive before they publish.',
    priceLabel: 'Price of the booking in rand',
    channels: ['Bank account', 'Cash send to a phone', 'Mobile wallet', 'Cash pickup at a shop'],
    channelsNote: 'Four ways to be paid. Only one needs a bank.',
    phone: 'earnings',
  },
  group: {
    eyebrow: 'How it works · the group',
    headline: 'And the group pays together.',
    steps: [
      { title: 'Co-create.', body: 'Friends add experiences to a shared timeline and vote.' },
      { title: 'Pool.', body: 'A pot opens for R2 400, split R600 each, from four phones.' },
      { title: 'Confirm.', body: 'Pot full, trip confirmed, every host accepts in one tap.' },
    ],
    potTitle: 'The pot',
    potOf: (paid: string, total: string): string => `${paid} of ${total}`,
    paidCount: (paid: number, of: number): string => `${paid} of ${of} paid`,
    pay: (name: string): string => `${name} pays`,
    paid: 'Paid',
    waiting: 'Waiting',
    confirmed: 'Pot full. The trip confirms itself.',
    reset: 'Start again',
    close: 'Nobody fronts the bill. Nobody chases.',
    phone: 'traveller home',
  },
  principles: {
    eyebrow: 'Built for the host first',
    headline: 'When host simplicity and traveller convenience pull apart, the host wins.',
    items: [
      { icon: 'mic', title: 'Voice first, low literacy', body: 'One question a screen, in their own language.' },
      { icon: 'cloud-off', title: 'Offline first', body: 'Work is never lost because signal dropped.' },
      { icon: 'wallet', title: 'Bank account optional', body: 'Cash send, wallets and shop pickup.' },
      { icon: 'shield-check', title: 'Trust that does not re-exclude', body: 'Start with a phone and an ID. Earn more through your community.' },
    ],
    budgetTitle: 'Low data, measured',
    budget: 'The PRD’s budget, first load',
    host: 'Host app, as built',
    traveller: 'Traveller app, as built',
    kb: (value: number): string => `${value} KB`,
    tiers: ['Registered', 'ID verified', 'Community verified'],
    tiersTitle: 'Three steps of trust',
    tiersNote: 'A phone number first. Then an ID and a selfie to go live. Then a credential, or an endorsement from the community.',
  },
  built: {
    eyebrow: 'Built in 24 hours. Measured from day one.',
    headline: 'What is real today.',
    items: [
      'Next.js 15 PWA with two shells: a one-question-a-screen host app and a photo-first traveller app',
      'WhatsApp onboarding bot on the Meta Cloud API, with SA ID validation',
      'Claude turns the host’s own words into a structured, translated listing',
      'Group itinerary with voting, and a stokvel-style pot that confirms on fill',
      'Supabase and Prisma behind one API, seeded across real South African places',
    ],
    measureTitle: 'What we promise to measure',
    measures: [
      { value: '15 min', label: 'from sign-up to a first live listing, by voice' },
      { value: 'R paid out', label: 'to hosts, and the share paid without a bank' },
      { value: 'First-timers', label: 'hosts who are unbanked, or have never sold on a platform' },
    ],
  },
  next: {
    eyebrow: 'Next',
    items: ['Tiered KYC with a payments partner', 'Real cash-send payouts', 'Escrow for pooled funds', 'Community Champions in every area', 'A recurring travel stokvel'],
    close: 'Travel that pays the people who make it worth the trip.',
  },
} as const;
