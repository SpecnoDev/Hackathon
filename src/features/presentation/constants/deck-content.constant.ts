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
  /** StatsSA QLFS official rate. TODO: confirm the latest quarter before this is presented. */
  unemployment: { percent: 32.9, expandedPercent: 43.1, quarter: 'Q1 2025' },
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
  sa: 'Unemployment: StatsSA Quarterly Labour Force Survey. International arrivals, jobs and share of GDP: StatsSA and WTTC via SAnews, 2026. Cash micro-businesses: FinScope. The 2025 bar is derived from the 12.4% rise. Check each before you quote it.',
  money: 'UNCTAD puts import leakage at 40 to 50% of gross tourism earnings for small developing economies. The $5 figure is widely cited from UNEP. Check each before you quote it.',
  market: 'Projected market size: Polaris Market Research and Market Intelo. Verify the exact figure before stage.',
  luxury: 'Synthesis of 2026 luxury travel trend coverage: Haute Retreats, AMT Travel, The Luxe Voyager and others.',
  build: 'First-load sizes measured with next build on this branch. Budget from the PRD.',
} as const;

/** The live app screens shown inside phones. Swap any of them for a screenshot by giving the slide an image instead. */
/** A screenshot of something the deck cannot run live, saved in /public. */
const portrait = (id: string): string => `https://images.unsplash.com/photo-${id}?w=240&h=240&fit=crop&crop=faces&q=80`;

export const DECK_IMAGES = {
  whatsAppOnboarding: '/presentation/whatsapp-onboarding.webp',
  /** The drawn pattern that bleeds off the right edge of a slide carrying a mockup. */
  slideEdge: '/presentation/slide-edge.webp',
} as const;

export const DECK_SCREENS = {
  landing: '/',
  hostWelcome: '/host/welcome',
  hostCreate: '/host/offerings/new',
  hostBookings: '/host/bookings',
  hostEarnings: '/host/earnings',
  travellerHome: '/traveller/explore',
  travellerPlace: '/traveller/explore/places/cape-town',
  travellerResults: '/traveller/explore/results',
  travellerPlan: '/traveller/plan',
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
    peopleLabel: 'The people this is about',
    headline: 'Money flows past the people who make a place worth visiting.',
    body: 'Tourism is one of South Africa’s biggest job creators. Its benefits pool in hotels, franchises and established operators. The guide, the taxi driver, the home cook and the person who knows who to call are shut out of the platforms where travellers spend.',
    people: [
      { role: 'The local guide', portrait: portrait('1531384441138-2736e62e0919') },
      { role: 'The taxi driver', portrait: portrait('1506794778202-cad84cf45f1d') },
      { role: 'The home cook', portrait: portrait('1507152832244-10d45c7eda57') },
      { role: 'The crafter', portrait: portrait('1544005313-94ddf0286df2') },
      { role: 'The fixer', portrait: portrait('1472099645785-5658abf4ff4e') },
    ],
  },
  numbers: {
    eyebrow: 'South Africa, right now',
    headline: 'The country is winning,',
    turn: 'the people are not.',
    unemployment: 'unemployed',
    unemploymentNote: (expanded: number, quarter: string): string => `${expanded}% on the expanded definition, ${quarter}`,
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
    sub: 'Three locks on the same door, and the person with the most to offer is on the wrong side of it.',
    supply: {
      title: 'Supply cannot list',
      items: [
        { icon: 'smartphone', title: 'Technology', body: 'An entry-level Android, rationed prepaid data, patchy signal and a long English web form.' },
        { icon: 'wallet', title: 'Finance', body: 'Platforms verify with a card and pay into a bank account. Micro-businesses run on cash.' },
        { icon: 'shield-check', title: 'Trust', body: 'No reviews, no verification, no brand. A stranger has no reason to book.' },
      ],
    },
    close: 'Hosted unlocks all three.',
  },
  oneLiner: {
    eyebrow: 'Our answer',
    lead: 'A marketplace that removes the technological and financial barriers keeping local South Africans out of the tourism economy,',
    statement: [
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
  features: {
    eyebrow: 'Feature by feature',
    tap: 'This is the real app. Tap it.',
    shot: 'From the WhatsApp bot, running on the Meta Cloud API.',
    items: [
      {
        title: 'A listing made by talking',
        body: 'A host says what they offer in their own language. Claude writes the listing, translates it, and fills in what a traveller needs to know.',
        points: ['One question a screen', 'Works on an entry-level Android', 'Nothing to type'],
        route: DECK_SCREENS.hostCreate,
      },
      {
        title: 'Onboarding that happens in WhatsApp',
        body: 'A host does not download anything. They message the number they already use, answer in their own language, and the bot builds the account and the first listing with them.',
        points: ['Meta Cloud API, no app install', 'Answers in isiZulu, isiXhosa, Afrikaans or English', 'SA ID validated in the conversation'],
        image: DECK_IMAGES.whatsAppOnboarding,
      },
      {
        title: 'Getting paid without a bank',
        body: 'Earnings land on the phone. A host sees what is coming, what has cleared, and what it cost them, before they ever open a bank account.',
        points: ['Cash-send and wallet payouts', 'The fee shown before the booking', 'No card, no bank, no branch'],
        route: DECK_SCREENS.hostEarnings,
      },
      {
        title: 'Browsing people, not products',
        body: 'Every listing is one person, with their story, their place and their reviews. The traveller chooses a host, not a room.',
        points: ['Photo-first, place by place', 'Verified and community-vouched hosts', 'Book and pay in rand'],
        route: DECK_SCREENS.travellerPlace,
      },
      {
        title: 'One itinerary, one group',
        body: 'Friends build the trip together, drag experiences onto a day, and vote. The plan stops being one person chasing four others for money.',
        points: ['A shared timeline', 'A vote per block', 'A pot that confirms when it fills'],
        route: DECK_SCREENS.travellerPlan,
      },
    ],
  },
  next: {
    eyebrow: 'Next',
    openApp: 'Open the app',
    items: ['Tiered KYC with a payments partner', 'Real cash-send payouts', 'Escrow for pooled funds', 'Community Champions in every area', 'A recurring travel stokvel'],
    close: 'Travel that pays the people who make it worth the trip.',
  },
} as const;
