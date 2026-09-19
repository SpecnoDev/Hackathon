import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { BPS_DENOMINATOR, PLATFORM_FEE_BPS } from '../src/core/constants/money.constant';

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! });
const prisma = new PrismaClient({ adapter });

const DAY_MS = 24 * 60 * 60 * 1000;
const now = Date.now();

/** Same split TECH_STACK.md assigns to the checkout flow — PLATFORM_FEE_BPS off the total, host keeps the rest. */
const splitFee = (totalCents: number): { feeCents: number; hostReceivesCents: number } => {
  const feeCents = Math.round((totalCents * PLATFORM_FEE_BPS) / BPS_DENOMINATOR);
  return { feeCents, hostReceivesCents: totalCents - feeCents };
};

const HOSTS = [
  {
    id: 'host-nomsa',
    phone: '+27821110001',
    fullName: 'Nomsa Dlamini',
    language: 'XH' as const,
    serviceArea: 'Langa, Cape Town',
    story: 'Nomsa has cooked for her Langa neighbours for twenty years. Her kitchen table now seats travellers too.',
    tier: 'COMMUNITY' as const,
  },
  {
    id: 'host-thabo',
    phone: '+27821110002',
    fullName: 'Thabo Nkosi',
    language: 'ZU' as const,
    serviceArea: 'Bo-Kaap, Cape Town',
    story: 'Thabo grew up in the Bo-Kaap and has guided walking tours through it for six years.',
    tier: 'IDENTITY' as const,
  },
  {
    id: 'host-annelie',
    phone: '+27821110003',
    fullName: 'Annelie Botha',
    language: 'AF' as const,
    serviceArea: 'Stellenbosch',
    story: 'Annelie runs her family farm in Stellenbosch and hosts small-group wine and food experiences.',
    tier: 'IDENTITY' as const,
  },
  {
    id: 'host-siya',
    phone: '+27821110004',
    fullName: 'Siyabonga Mthembu',
    language: 'ZU' as const,
    serviceArea: 'Soweto, Johannesburg',
    story: 'Siya has driven minibus taxis in Soweto for over a decade and now offers airport transfers and township tours.',
    tier: 'COMMUNITY' as const,
  },
  {
    id: 'host-elana',
    phone: '+27821110005',
    fullName: 'Elana van Wyk',
    language: 'AF' as const,
    serviceArea: 'Hermanus',
    story: 'Elana leads coastal hikes and whale-watching walks along the Hermanus cliff path.',
    tier: 'REGISTERED' as const,
  },
];

const TRAVELLERS = [
  { id: 'trav-jess', authUserId: 'auth-jess', email: 'jess@example.com', name: 'Jess Cronin' },
  { id: 'trav-mike', authUserId: 'auth-mike', email: 'mike@example.com', name: 'Mike Adams' },
  { id: 'trav-lindi', authUserId: 'auth-lindi', email: 'lindi@example.com', name: 'Lindiwe Sithole' },
];

// These records pre-date the canonical seed below. Keep their media URLs in the
// database, but repair the old /seed/... values that referenced files which were
// never committed to public/.
const LEGACY_OFFERING_MEDIA = [
  {
    id: '22222222-0000-4000-8000-000000000001',
    photoUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80',
  },
  {
    id: '22222222-0000-4000-8000-000000000002',
    photoUrl: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=1200&q=80',
  },
  {
    id: '22222222-0000-4000-8000-000000000003',
    photoUrl: 'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=1200&q=80',
  },
  {
    id: '22222222-0000-4000-8000-000000000004',
    photoUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80',
  },
  {
    id: '22222222-0000-4000-8000-000000000005',
    photoUrl: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1200&q=80',
  },
  {
    id: '22222222-0000-4000-8000-000000000006',
    photoUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80',
  },
  {
    id: '22222222-0000-4000-8000-000000000007',
    photoUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80',
  },
  {
    id: '22222222-0000-4000-8000-000000000008',
    photoUrl: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1200&q=80',
  },
  {
    id: '22222222-0000-4000-8000-000000000009',
    photoUrl: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=1200&q=80',
  },
  {
    id: '22222222-0000-4000-8000-000000000010',
    photoUrl: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=1200&q=80',
  },
  {
    id: '22222222-0000-4000-8000-000000000011',
    photoUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80',
  },
  {
    id: '22222222-0000-4000-8000-000000000012',
    photoUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80',
  },
  {
    id: '22222222-0000-4000-8000-000000000013',
    photoUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&q=80',
  },
  {
    id: '22222222-0000-4000-8000-000000000014',
    photoUrl: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200&q=80',
  },
  {
    id: '22222222-0000-4000-8000-000000000015',
    photoUrl: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1200&q=80',
  },
  {
    id: '22222222-0000-4000-8000-000000000016',
    photoUrl: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=1200&q=80',
  },
] as const;

const LEGACY_HOST_MEDIA = [
  ['11111111-0000-4000-8000-000000000001', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80'],
  ['11111111-0000-4000-8000-000000000002', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80'],
  ['11111111-0000-4000-8000-000000000003', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'],
  ['11111111-0000-4000-8000-000000000004', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'],
  ['11111111-0000-4000-8000-000000000005', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80'],
  ['11111111-0000-4000-8000-000000000006', 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80'],
  ['11111111-0000-4000-8000-000000000007', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80'],
  ['11111111-0000-4000-8000-000000000008', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'],
  ['11111111-0000-4000-8000-000000000009', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'],
  ['11111111-0000-4000-8000-000000000010', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80'],
  ['11111111-0000-4000-8000-000000000011', 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80'],
  ['11111111-0000-4000-8000-000000000012', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80'],
] as const;

type OfferingSeed = {
  id: string;
  hostId: string;
  category:
    | 'TOUR'
    | 'FOOD'
    | 'TRANSPORT'
    | 'ACCOMMODATION'
    | 'CONCIERGE'
    | 'SECURITY';
  title: string;
  description: string;
  priceCents: number;
  durationMin: number | null;
  groupMax: number | null;
  town: string;
  region: string;
  lat: number;
  lng: number;
  photos: string[];
  sustainabilityTag: 'LOW_IMPACT_TRAVEL' | 'SUPPORTS_LOCAL_LIVELIHOODS' | null;
  vouchCount: number;
  reviews: { travellerId: string; rating: number; comment: string }[];
};

const OFFERINGS: OfferingSeed[] = [
  {
    id: 'off-langa-meal',
    hostId: 'host-nomsa',
    category: 'FOOD',
    title: "Auntie Nomsa's Home-Cooked Kitchen Table",
    description: 'A home-cooked Xhosa meal at Nomsa\'s kitchen table in Langa, with stories from the neighbourhood.',
    priceCents: 18000,
    durationMin: 120,
    groupMax: 4,
    town: 'Langa',
    region: 'Cape Town',
    lat: -33.9469,
    lng: 18.5225,
    photos: ['https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80'],
    sustainabilityTag: 'SUPPORTS_LOCAL_LIVELIHOODS',
    vouchCount: 37,
    reviews: [
      { travellerId: 'trav-jess', rating: 5, comment: 'Best meal of our whole trip. Nomsa is a wonderful host.' },
      { travellerId: 'trav-mike', rating: 5, comment: 'Felt like family. Highly recommend.' },
    ],
  },
  {
    id: 'off-bokaap-walk',
    hostId: 'host-thabo',
    category: 'TOUR',
    title: 'Bo-Kaap Walking Tour with a Local Storyteller',
    description: 'A 2.5 hour walk through the Bo-Kaap with Thabo, covering its history, architecture and food.',
    priceCents: 25000,
    durationMin: 150,
    groupMax: 8,
    town: 'Bo-Kaap',
    region: 'Cape Town',
    lat: -33.9214,
    lng: 18.4133,
    photos: ['https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=1200&q=80'],
    sustainabilityTag: 'SUPPORTS_LOCAL_LIVELIHOODS',
    vouchCount: 21,
    reviews: [
      { travellerId: 'trav-lindi', rating: 5, comment: 'Thabo knows every corner of the Bo-Kaap. Loved it.' },
    ],
  },
  {
    id: 'off-township-cycle',
    hostId: 'host-thabo',
    category: 'TOUR',
    title: 'Township Art & Mural Cycle Tour',
    description: 'A guided cycle through Cape Town\'s townships, stopping at murals and community art projects.',
    priceCents: 32000,
    durationMin: 180,
    groupMax: 10,
    town: 'Khayelitsha',
    region: 'Cape Town',
    lat: -34.0403,
    lng: 18.6733,
    photos: ['https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80'],
    sustainabilityTag: 'SUPPORTS_LOCAL_LIVELIHOODS',
    vouchCount: 9,
    reviews: [
      { travellerId: 'trav-jess', rating: 4, comment: 'Great route, learned a lot about the local art scene.' },
    ],
  },
  {
    id: 'off-winelands-farm',
    hostId: 'host-annelie',
    category: 'FOOD',
    title: 'Farm Table Lunch in the Stellenbosch Winelands',
    description: 'A long lunch on Annelie\'s family farm, paired with wines from the estate.',
    priceCents: 45000,
    durationMin: 150,
    groupMax: 12,
    town: 'Stellenbosch',
    region: 'Winelands',
    lat: -33.9366,
    lng: 18.8608,
    photos: ['https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1200&q=80'],
    sustainabilityTag: 'LOW_IMPACT_TRAVEL',
    vouchCount: 14,
    reviews: [
      { travellerId: 'trav-mike', rating: 5, comment: 'Beautiful setting and the food was excellent.' },
      { travellerId: 'trav-lindi', rating: 4, comment: 'Lovely afternoon, a bit pricey but worth it.' },
    ],
  },
  {
    id: 'off-stellenbosch-tram',
    hostId: 'host-annelie',
    category: 'TOUR',
    title: 'Stellenbosch Vineyard Tram Tour',
    description: 'A relaxed tram ride through three Stellenbosch vineyards with tastings at each stop.',
    priceCents: 38000,
    durationMin: 210,
    groupMax: 16,
    town: 'Stellenbosch',
    region: 'Winelands',
    lat: -33.9321,
    lng: 18.8602,
    photos: ['https://images.unsplash.com/photo-1528825871115-3581a5387919?w=1200&q=80'],
    sustainabilityTag: 'LOW_IMPACT_TRAVEL',
    vouchCount: 6,
    reviews: [],
  },
  {
    id: 'off-soweto-walk',
    hostId: 'host-siya',
    category: 'TOUR',
    title: 'Soweto Walk with a Local Driver',
    description: 'A walking tour through Soweto with Siya, including Vilakazi Street and the Hector Pieterson Memorial.',
    priceCents: 28000,
    durationMin: 180,
    groupMax: 10,
    town: 'Soweto',
    region: 'Johannesburg',
    lat: -26.2485,
    lng: 27.9042,
    photos: ['https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=1200&q=80'],
    sustainabilityTag: 'SUPPORTS_LOCAL_LIVELIHOODS',
    vouchCount: 18,
    reviews: [
      { travellerId: 'trav-jess', rating: 5, comment: 'Siya\'s own stories made this tour unforgettable.' },
    ],
  },
  {
    id: 'off-jhb-airport-transfer',
    hostId: 'host-siya',
    category: 'TRANSPORT',
    title: 'Airport Transfer — Reliable Local Driver',
    description: 'Door-to-door airport transfers in and around Johannesburg with Siya.',
    priceCents: 15000,
    durationMin: null,
    groupMax: 4,
    town: 'Johannesburg',
    region: 'Johannesburg',
    lat: -26.1367,
    lng: 28.2411,
    photos: ['https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80'],
    sustainabilityTag: null,
    vouchCount: 4,
    reviews: [
      { travellerId: 'trav-mike', rating: 5, comment: 'On time and easy to book. Would use again.' },
    ],
  },
  {
    id: 'off-hermanus-hike',
    hostId: 'host-elana',
    category: 'TOUR',
    title: 'Hermanus Cliff Path Whale Walk',
    description: 'A guided walk along the Hermanus cliff path, one of the best land-based whale watching spots in the world.',
    priceCents: 22000,
    durationMin: 120,
    groupMax: 8,
    town: 'Hermanus',
    region: 'Overberg',
    lat: -34.4187,
    lng: 19.2345,
    photos: ['https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&q=80'],
    sustainabilityTag: 'LOW_IMPACT_TRAVEL',
    vouchCount: 3,
    reviews: [],
  },
  {
    id: 'off-hermanus-sunset',
    hostId: 'host-elana',
    category: 'TOUR',
    title: 'Hermanus Sunset Coastal Walk',
    description: 'An evening walk along the Hermanus coastline, timed for sunset over the bay.',
    priceCents: 18000,
    durationMin: 90,
    groupMax: 6,
    town: 'Hermanus',
    region: 'Overberg',
    lat: -34.4205,
    lng: 19.2401,
    photos: ['https://images.unsplash.com/photo-1509233725247-49e657c54213?w=1200&q=80'],
    sustainabilityTag: 'LOW_IMPACT_TRAVEL',
    vouchCount: 1,
    reviews: [],
  },
];

type BookingSeed = {
  id: string;
  offeringId: string;
  hostId: string;
  travellerId: string;
  status: 'REQUESTED' | 'CONFIRMED' | 'COMPLETED';
  date: Date;
  respondBy: Date;
  groupSize: number;
  totalCents: number;
  paymentRef?: string;
  payout?: {
    id: string;
    channel: 'BANK' | 'CASH_SEND' | 'WALLET' | 'CASH_PICKUP';
    destination: string;
    status: 'PENDING' | 'SENT';
    sentAt: Date | null;
  };
};

/**
 * Demo bookings for the host booking-response screen: for host-nomsa, one REQUESTED (still
 * awaiting a response, respondBy in the future), one CONFIRMED, one COMPLETED with a SENT
 * payout, and one CONFIRMED with a PENDING payout; for host-elana, one REQUESTED and one
 * CONFIRMED with a PENDING payout. Reuses the travellers seeded above.
 */
const BOOKING_SEEDS: BookingSeed[] = [
  {
    id: 'booking-nomsa-requested-1',
    offeringId: 'off-langa-meal',
    hostId: 'host-nomsa',
    travellerId: 'trav-jess',
    status: 'REQUESTED',
    date: new Date(now + 5 * DAY_MS),
    respondBy: new Date(now + 2 * DAY_MS),
    groupSize: 2,
    totalCents: 18000 * 2,
  },
  {
    id: 'booking-nomsa-confirmed-1',
    offeringId: 'off-langa-meal',
    hostId: 'host-nomsa',
    travellerId: 'trav-mike',
    status: 'CONFIRMED',
    date: new Date(now + 3 * DAY_MS),
    respondBy: new Date(now - DAY_MS),
    groupSize: 4,
    totalCents: 18000 * 4,
    paymentRef: 'MOCK-PAY-NOMSA-CONFIRMED-1',
  },
  {
    id: 'booking-nomsa-completed-1',
    offeringId: 'off-langa-meal',
    hostId: 'host-nomsa',
    travellerId: 'trav-lindi',
    status: 'COMPLETED',
    date: new Date(now - 10 * DAY_MS),
    respondBy: new Date(now - 11 * DAY_MS),
    groupSize: 2,
    totalCents: 18000 * 2,
    paymentRef: 'MOCK-PAY-NOMSA-COMPLETED-1',
    payout: {
      id: 'payout-nomsa-completed-1',
      channel: 'CASH_SEND',
      destination: '082 *** 0001',
      status: 'SENT',
      sentAt: new Date(now - 9 * DAY_MS),
    },
  },
  {
    id: 'booking-nomsa-confirmed-2',
    offeringId: 'off-langa-meal',
    hostId: 'host-nomsa',
    travellerId: 'trav-jess',
    status: 'CONFIRMED',
    date: new Date(now + DAY_MS),
    respondBy: new Date(now - 2 * DAY_MS),
    groupSize: 3,
    totalCents: 18000 * 3,
    paymentRef: 'MOCK-PAY-NOMSA-CONFIRMED-2',
    payout: {
      id: 'payout-nomsa-pending-1',
      channel: 'CASH_SEND',
      destination: '082 *** 0001',
      status: 'PENDING',
      sentAt: null,
    },
  },
  {
    id: 'booking-elana-requested-1',
    offeringId: 'off-hermanus-hike',
    hostId: 'host-elana',
    travellerId: 'trav-mike',
    status: 'REQUESTED',
    date: new Date(now + 6 * DAY_MS),
    respondBy: new Date(now + 2 * DAY_MS),
    groupSize: 2,
    totalCents: 22000 * 2,
  },
  {
    id: 'booking-elana-confirmed-1',
    offeringId: 'off-hermanus-sunset',
    hostId: 'host-elana',
    travellerId: 'trav-lindi',
    status: 'CONFIRMED',
    date: new Date(now + 4 * DAY_MS),
    respondBy: new Date(now - DAY_MS),
    groupSize: 2,
    totalCents: 18000 * 2,
    paymentRef: 'MOCK-PAY-ELANA-CONFIRMED-1',
    payout: {
      id: 'payout-elana-pending-1',
      channel: 'BANK',
      destination: '082 *** 0005',
      status: 'PENDING',
      sentAt: null,
    },
  },
];

async function main() {
  for (const host of HOSTS) {
    await prisma.host.upsert({
      where: { id: host.id },
      update: host,
      create: host,
    });
  }

  for (const traveller of TRAVELLERS) {
    await prisma.traveller.upsert({
      where: { id: traveller.id },
      update: traveller,
      create: traveller,
    });
  }

  for (const seed of OFFERINGS) {
    const { reviews, vouchCount, ...offeringFields } = seed;

    await prisma.offering.upsert({
      where: { id: seed.id },
      update: {
        ...offeringFields,
        status: 'LIVE',
        sourceLanguage: 'EN',
        meetingPoint: `${seed.town} — details on booking`,
        availability: { type: 'on_request' },
        inclusions: [],
        vouchCount,
      },
      create: {
        ...offeringFields,
        status: 'LIVE',
        sourceLanguage: 'EN',
        meetingPoint: `${seed.town} — details on booking`,
        availability: { type: 'on_request' },
        inclusions: [],
        vouchCount,
      },
    });

    await prisma.vouch.deleteMany({ where: { offeringId: seed.id } });
    if (vouchCount > 0) {
      await prisma.vouch.create({
        data: {
          offeringId: seed.id,
          voucherArea: seed.town,
          source: 'SURVEY',
        },
      });
    }

    for (const review of reviews) {
      const bookingId = `booking-${seed.id}-${review.travellerId}`;
      await prisma.booking.upsert({
        where: { id: bookingId },
        update: {},
        create: {
          id: bookingId,
          offeringId: seed.id,
          hostId: seed.hostId,
          travellerId: review.travellerId,
          status: 'COMPLETED',
          date: new Date(),
          groupSize: 2,
          totalCents: seed.priceCents * 2,
          feeCents: Math.round(seed.priceCents * 2 * 0.15),
          hostReceivesCents: Math.round(seed.priceCents * 2 * 0.85),
          respondBy: new Date(),
        },
      });

      await prisma.review.upsert({
        where: { bookingId },
        update: { rating: review.rating, comment: review.comment },
        create: {
          bookingId,
          offeringId: seed.id,
          travellerId: review.travellerId,
          rating: review.rating,
          comment: review.comment,
        },
      });
    }

    const agg = await prisma.review.aggregate({
      where: { offeringId: seed.id },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.offering.update({
      where: { id: seed.id },
      data: {
        avgRating: agg._avg.rating ?? null,
        reviewCount: agg._count.rating,
      },
    });
  }

  for (const seed of BOOKING_SEEDS) {
    const { feeCents, hostReceivesCents } = splitFee(seed.totalCents);
    const bookingFields = {
      offeringId: seed.offeringId,
      hostId: seed.hostId,
      travellerId: seed.travellerId,
      status: seed.status,
      date: seed.date,
      respondBy: seed.respondBy,
      groupSize: seed.groupSize,
      totalCents: seed.totalCents,
      feeCents,
      hostReceivesCents,
      paymentRef: seed.paymentRef ?? null,
    };

    await prisma.booking.upsert({
      where: { id: seed.id },
      update: bookingFields,
      create: { id: seed.id, ...bookingFields },
    });

    if (!seed.payout) continue;

    const payoutFields = {
      amountCents: hostReceivesCents,
      channel: seed.payout.channel,
      destination: seed.payout.destination,
      status: seed.payout.status,
      sentAt: seed.payout.sentAt,
    };

    await prisma.payout.upsert({
      where: { id: seed.payout.id },
      update: payoutFields,
      create: { id: seed.payout.id, bookingId: seed.id, hostId: seed.hostId, ...payoutFields },
    });
  }

  const mediaRepairs = await Promise.all([
    ...LEGACY_OFFERING_MEDIA.map(({ id, photoUrl }) =>
      prisma.offering.updateMany({
        where: { id },
        data: { photos: [photoUrl] },
      }),
    ),
    ...LEGACY_HOST_MEDIA.map(([id, photoUrl]) =>
      prisma.host.updateMany({
        where: { id },
        data: { photoUrl },
      }),
    ),
  ]);

  const repairedMediaRecords = mediaRepairs.reduce((total, result) => total + result.count, 0);

  const payoutCount = BOOKING_SEEDS.filter((seed) => seed.payout).length;

  console.log(
    `Seeded ${HOSTS.length} hosts, ${TRAVELLERS.length} travellers, ${OFFERINGS.length} offerings, ${BOOKING_SEEDS.length} bookings (${payoutCount} with a payout); repaired ${repairedMediaRecords} legacy media records.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
