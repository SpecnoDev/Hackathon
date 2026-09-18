import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! });
const prisma = new PrismaClient({ adapter });

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
    photos: ['https://images.unsplash.com/photo-1509233725247-49e657c54213?w=1200&q=80'],
    sustainabilityTag: 'LOW_IMPACT_TRAVEL',
    vouchCount: 1,
    reviews: [],
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

  console.log(`Seeded ${HOSTS.length} hosts, ${TRAVELLERS.length} travellers, ${OFFERINGS.length} offerings.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
