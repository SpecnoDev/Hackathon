import { hostReceivesCents, maskPhone, platformFeeCents } from '@/shared/utils';
import type { Availability, Booking, BookingStatus, Host, HostAppState, Offering, OfferingFields, Payout, PriceUnit } from '../interfaces';
import { HOST_APP_SCHEMA_VERSION, MS_PER_DAY, MS_PER_HOUR, RESPONSE_DEADLINE_HOURS } from './host-limits.constant';
import { kindOption } from './host-options.constant';
import { LISTING_SAMPLES } from './listing-samples.constant';

/** Seeded phone numbers use a 000 block so they cannot belong to a real person. */
export const SEED_HOST_IDS = { nomsa: 'host-nomsa', thabo: 'host-thabo', koos: 'host-koos' } as const;

const ON_REQUEST: Availability = { type: 'ON_REQUEST', dates: [], weekdays: [] };
const WEEKENDS: Availability = { type: 'RECURRING', dates: [], weekdays: ['SAT', 'SUN'] };
const ALL_CHANNELS_ON = { WHATSAPP: true, SMS: true, IN_APP: true };
const LUNCH_HOUR = 13;
const WALK_HOUR = 10;
const FARM_HOUR = 6;

const HOSTS: Host[] = [
  {
    id: SEED_HOST_IDS.nomsa,
    phone: '+27820004471',
    firstName: 'Nomsa',
    language: 'XH',
    contactChannel: 'WHATSAPP',
    notifications: ALL_CHANNELS_ON,
    town: 'Langa, Cape Town',
    region: 'Western Cape',
    story: 'I was born in Langa and I have cooked for my family here for thirty years. Come and eat with us. I will tell you how this place was built and who lives here now.',
    tier: 'IDENTITY',
    payoutChannel: 'CASH_SEND',
    payoutDetails: { phone: '+27820004471' },
  },
  {
    id: SEED_HOST_IDS.thabo,
    phone: '+27730008820',
    firstName: 'Thabo',
    language: 'ZU',
    contactChannel: 'SMS',
    notifications: { WHATSAPP: false, SMS: true, IN_APP: true },
    town: 'Orlando West, Soweto',
    region: 'Gauteng',
    story: 'I grew up two streets from Vilakazi Street. I know the stories the tour buses do not stop for.',
    tier: 'REGISTERED',
    payoutChannel: 'CASH_SEND',
    payoutDetails: { phone: '+27730008820' },
  },
  {
    id: SEED_HOST_IDS.koos,
    phone: '+27820006621',
    firstName: 'Koos',
    language: 'AF',
    contactChannel: 'WHATSAPP',
    notifications: ALL_CHANNELS_ON,
    town: 'Nieu-Bethesda',
    region: 'Eastern Cape',
    story: 'My family has farmed sheep outside Nieu-Bethesda for four generations. I like to show people how quiet the Karoo is.',
    tier: 'COMMUNITY',
    payoutChannel: 'BANK',
    payoutDetails: { bankName: 'Capitec', accountNumber: '1580006621' },
    communityProof: { type: 'ORGANISATION', value: 'Camdeboo Tourism Office', submittedAt: '2026-08-02T09:00:00.000Z' },
  },
];

/** `region` is filled by the `offering()` builder below (it takes its own region argument, always applied after these fields); empty here is never seen. */
const fieldsFor = (kind: OfferingFields['kind'], overrides: Partial<OfferingFields> = {}): OfferingFields => ({
  kind,
  region: '',
  ...LISTING_SAMPLES[kind].fields,
  photos: [],
  availability: ON_REQUEST,
  transcript: LISTING_SAMPLES[kind].transcript.EN,
  ...overrides,
});

const bookingTotalCents = (priceCents: number, unit: PriceUnit, groupSize: number): number =>
  unit === 'PER_PERSON' ? priceCents * groupSize : priceCents;

export const createSeedState = (now: Date): HostAppState => {
  const at = (days: number, hour?: number): string => {
    const date = new Date(now.getTime() + days * MS_PER_DAY);
    if (hour !== undefined) date.setHours(hour, 0, 0, 0);
    return date.toISOString();
  };
  const inHours = (hours: number): string => new Date(now.getTime() + hours * MS_PER_HOUR).toISOString();

  const offering = (
    id: string,
    hostId: string,
    region: string,
    status: Offering['status'],
    fields: OfferingFields,
    views: number,
    statusReason?: string,
  ): Offering => ({
    ...fields,
    id,
    hostId,
    category: kindOption(fields.kind).category,
    region,
    sourceLanguage: HOSTS.find((host) => host.id === hostId)?.language ?? 'EN',
    status,
    statusReason,
    views,
    pendingSync: false,
    createdAt: at(-40),
    updatedAt: at(-3),
  });

  const offerings: Offering[] = [
    offering('off-langa-lunch', SEED_HOST_IDS.nomsa, 'Western Cape', 'LIVE', fieldsFor('food', { availability: WEEKENDS }), 148),
    offering('off-langa-walk', SEED_HOST_IDS.nomsa, 'Western Cape', 'PAUSED', fieldsFor('experience'), 96),
    offering(
      'off-airport-lift',
      SEED_HOST_IDS.nomsa,
      'Western Cape',
      'IN_REVIEW',
      fieldsFor('transport'),
      0,
      'Transport listings need your operating licence before they go live.',
    ),
    offering(
      'off-vilakazi-walk',
      SEED_HOST_IDS.thabo,
      'Gauteng',
      'DRAFT',
      fieldsFor('guide'),
      0,
      'Verify your ID and this goes live.',
    ),
    offering(
      'off-karoo-farm',
      SEED_HOST_IDS.koos,
      'Eastern Cape',
      'LIVE',
      fieldsFor('experience', {
        title: 'A morning on a Karoo sheep farm',
        description: 'Ride out with me at sunrise, help move the sheep, and eat breakfast on the stoep. It is quiet out here and you can see for a hundred kilometres.',
        steps: ['We meet at the farm gate at sunrise.', 'We ride out on the bakkie and move the sheep.', 'We eat breakfast on the stoep.'],
        durationMin: 240,
        groupMax: 6,
        priceCents: 50_000,
        inclusions: ['Farm breakfast', 'A ride on the bakkie', 'Coffee on the stoep'],
        whatToBring: ['A warm jacket', 'Closed shoes', 'A hat'],
        details: { difficulty: 'MODERATE', minAge: 8 },
        meetingPoint: 'Farm gate, 12 km out on the Murraysburg road',
        town: 'Nieu-Bethesda',
        languages: ['AF', 'EN'],
        transcript: undefined,
      }),
      212,
    ),
    offering(
      'off-karoo-evening',
      SEED_HOST_IDS.koos,
      'Eastern Cape',
      'REJECTED',
      fieldsFor('concierge'),
      0,
      'Your photos were too dark to see. Add brighter photos and send it again.',
    ),
  ];

  const booking = (
    id: string,
    offeringId: string,
    travellerName: string,
    travellerPhone: string,
    status: BookingStatus,
    date: string,
    groupSize: number,
    extra: Partial<Booking> = {},
  ): Booking => {
    const listed = offerings.find((item) => item.id === offeringId);
    const totalCents = bookingTotalCents(listed?.priceCents ?? 0, listed?.priceUnit ?? 'PER_TRIP', groupSize);
    return {
      id,
      offeringId,
      hostId: listed?.hostId ?? SEED_HOST_IDS.nomsa,
      travellerName,
      travellerPhone,
      status,
      date,
      groupSize,
      totalCents,
      feeCents: platformFeeCents(totalCents),
      hostReceivesCents: hostReceivesCents(totalCents),
      respondBy: inHours(RESPONSE_DEADLINE_HOURS),
      groupPayment: { paid: groupSize, of: groupSize },
      pendingSync: false,
      createdAt: at(-1),
      ...extra,
    };
  };

  const bookings: Booking[] = [
    booking('bk-lerato', 'off-langa-lunch', 'Lerato', '+27710001234', 'REQUESTED', at(1, LUNCH_HOUR), 4),
    booking('bk-james', 'off-langa-lunch', 'James', '+27720005678', 'REQUESTED', at(2, LUNCH_HOUR), 2, { groupPayment: { paid: 1, of: 2 } }),
    booking('bk-thandi', 'off-langa-lunch', 'Thandi', '+27760002468', 'CONFIRMED', inHours(-2), 4),
    booking('bk-anna', 'off-langa-lunch', 'Anna', '+27790001357', 'CONFIRMED', at(3, LUNCH_HOUR), 3),
    booking('bk-sizwe', 'off-langa-lunch', 'Sizwe', '+27830009753', 'COMPLETED', at(-6, LUNCH_HOUR), 5),
    booking('bk-priya', 'off-langa-walk', 'Priya', '+27840008642', 'COMPLETED', at(-12, WALK_HOUR), 2),
    booking('bk-hannah', 'off-langa-walk', 'Hannah', '+27610007531', 'COMPLETED', at(-1, WALK_HOUR), 4),
    booking('bk-tom', 'off-langa-lunch', 'Tom', '+27620004826', 'DECLINED', at(-9, LUNCH_HOUR), 8, { responseReason: 'TOO_MANY_PEOPLE' }),
    booking('bk-zanele', 'off-langa-walk', 'Zanele', '+27630001593', 'CANCELLED', at(-15, WALK_HOUR), 3, { responseReason: 'SOMETHING_CAME_UP' }),
    booking('bk-marie', 'off-karoo-farm', 'Marie', '+27640003197', 'CONFIRMED', at(5, FARM_HOUR), 2),
    booking('bk-david', 'off-karoo-farm', 'David', '+27650008264', 'COMPLETED', at(-20, FARM_HOUR), 2),
  ];

  const payout = (id: string, bookingId: string, status: Payout['status'], completedDaysAgo: number): Payout => {
    const paid = bookings.find((item) => item.id === bookingId);
    const host = HOSTS.find((item) => item.id === paid?.hostId) ?? HOSTS[0];
    return {
      id,
      bookingId,
      hostId: host.id,
      amountCents: paid?.hostReceivesCents ?? 0,
      channel: host.payoutChannel,
      destination:
        host.payoutChannel === 'BANK'
          ? `${host.payoutDetails.bankName} ***${host.payoutDetails.accountNumber?.slice(-4)}`
          : maskPhone(host.payoutDetails.phone ?? host.phone),
      status,
      expectedBy: at(-completedDaysAgo + 1),
      sentAt: status === 'SENT' ? at(-completedDaysAgo + 1) : undefined,
    };
  };

  return {
    schemaVersion: HOST_APP_SCHEMA_VERSION,
    // No one is signed in on a fresh device. The seed hosts still ship in state so /flows can
    // switchPersona() into Nomsa/Thabo/Koos for demoing earnings and bookings.
    activeHostId: undefined,
    hosts: HOSTS,
    offerings,
    bookings,
    payouts: [
      payout('po-sizwe', 'bk-sizwe', 'SENT', 6),
      payout('po-priya', 'bk-priya', 'SENT', 12),
      payout('po-hannah', 'bk-hannah', 'PENDING', 1),
      payout('po-david', 'bk-david', 'SENT', 20),
    ],
    registration: {},
    verification: { state: 'IDLE' },
    drafts: {},
    outbox: [],
    demo: { verificationOutcome: 'VERIFIED' },
  };
};
