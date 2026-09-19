import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, type Language, type OfferingCategory, type VerificationTier } from '@prisma/client';
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

/*
 * The traveller catalogue below is Brandon's demand-designs prototype data, kept verbatim so both sides of the demo tell one
 * story, then mapped onto the schema in `main`. Types mirror the prototype's interfaces; `ratings` is read for nothing,
 * since ratings aggregate from real reviews.
 */
type LanguageCode = Language;
type Weekday = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
type ListingCategory = 'EXPERIENCE' | 'FOOD' | 'GUIDE' | 'TRANSPORT';
type PriceUnit = 'PER_PERSON' | 'PER_TRIP';
type BookingMode = 'INSTANT' | 'ON_REQUEST';

interface TravellerHost {
  id: string;
  firstName: string;
  town: string;
  tier: VerificationTier;
  portrait: string;
  memberSince: string;
  languages: LanguageCode[];
  story: string;
  voiceNoteSeconds: number;
}

interface Listing {
  id: string;
  hostId: string;
  placeSlug: string;
  category: ListingCategory;
  title: string;
  description: string;
  photos: string[];
  town: string;
  priceCents: number;
  priceUnit: PriceUnit;
  durationMin: number;
  groupMin: number;
  groupMax: number;
  languages: LanguageCode[];
  inclusions: string[];
  steps: string[];
  whatToBring: string[];
  safetyNotes: string[];
  meetingPoint: string;
  bookingMode: BookingMode;
  availability: { weekdays: Weekday[]; times: string[] };
  ratings: [number, number, number, number, number];
  addedAt: string;
}

interface Review {
  id: string;
  listingId: string;
  travellerName: string;
  travellerFrom: string;
  rating: number;
  createdAt: string;
  text: string;
}

const UNSPLASH = 'https://images.unsplash.com/photo-';
const SCENE_QUERY = '?w=1200&q=70';
const PORTRAIT_QUERY = '?w=400&q=70';

/**
 * TODO: stand-ins. DESIGN.md wants the host's own photos and no stock imagery; until hosts have uploaded any,
 * these keep the traveller screens honest about how much photography they need. Every id was checked to load.
 */
const scene = (id: string): string => `${UNSPLASH}${id}${SCENE_QUERY}`;
const portrait = (id: string): string => `${UNSPLASH}${id}${PORTRAIT_QUERY}`;

const PHOTO = {
  sharedTable: scene('1466978913421-dad2ebd01d17'),
  foodBowls: scene('1490645935967-10de6ba17061'),
  braai: scene('1555939594-58d7cb561ad1'),
  ribs: scene('1544025162-d76694265947'),
  plates: scene('1504674900247-0877df9cc836'),
  platedDish: scene('1414235077428-338989a2e8c0'),
  foodTable: scene('1476224203421-9ac39bcb3327'),
  breakfast: scene('1504754524776-8f4f37790ca0'),
  restaurant: scene('1517248135467-4c7edcad34c4'),
  market: scene('1498837167922-ddd27525d352'),
  capeTownAerial: scene('1580060839134-75a5edca2e99'),
  capeCoast: scene('1576485290814-1c72aa4bbb8e'),
  cyclists: scene('1517649763962-0c623066013b'),
  driving: scene('1449965408869-eaa3f722e40d'),
  airport: scene('1530521954074-e64f6810b32d'),
  traveller: scene('1473625247510-8ceb1760943f'),
  friendsSunrise: scene('1511632765486-a01980e01a18'),
  forestPath: scene('1441974231531-c6227db76b6e'),
  forestBridge: scene('1447752875215-b2761acb3c5d'),
  forestCabin: scene('1449158743715-0a90ebb6d2d8'),
  beachSunrise: scene('1507525428034-b723cf961d3e'),
  beachPalms: scene('1509233725247-49e657c54213'),
  redRoad: scene('1500530855697-b586d89ba3ee'),
  openRoad: scene('1494783367193-149034c05e8f'),
  treeSunset: scene('1516026672322-bc52d61a55d5'),
  hiker: scene('1551632811-561732d1e306'),
  farmRows: scene('1560493676-04071c5f467b'),
  loneTree: scene('1502082553048-f009c37129b9'),
  mistyHills: scene('1469474968028-56623f02e42e'),
  nightSky: scene('1444703686981-a3abbc4d4fe3'),
} as const;


const HOSTS: readonly TravellerHost[] = [
  {
    id: 'host-nomsa',
    firstName: 'Nomsa',
    town: 'Langa, Cape Town',
    tier: 'IDENTITY',
    portrait: portrait('1507152832244-10d45c7eda57'),
    memberSince: '2026-03-01',
    languages: ['XH', 'EN'],
    story: 'I have lived in Langa all my life. I cook the food my mother taught me, and my table is always too small. Come hungry and I will tell you about this place while we eat.',
    voiceNoteSeconds: 38,
  },
  {
    id: 'host-koos',
    firstName: 'Koos',
    town: 'Nieu-Bethesda',
    tier: 'COMMUNITY',
    portrait: portrait('1472099645785-5658abf4ff4e'),
    memberSince: '2026-04-01',
    languages: ['AF', 'EN'],
    story: 'My family has farmed sheep outside Nieu-Bethesda for four generations. I like to show people how quiet the Karoo is.',
    voiceNoteSeconds: 44,
  },
  {
    id: 'host-siya',
    firstName: 'Siya',
    town: 'Orlando West, Soweto',
    tier: 'COMMUNITY',
    portrait: portrait('1531384441138-2736e62e0919'),
    memberSince: '2026-02-01',
    languages: ['ZU', 'EN'],
    story: 'I drove a taxi in Soweto for eleven years, so I know every street and half the people on them. Now I walk visitors through the place that raised me.',
    voiceNoteSeconds: 41,
  },
  {
    id: 'host-fatima',
    firstName: 'Fatima',
    town: 'Bo-Kaap, Cape Town',
    tier: 'IDENTITY',
    portrait: portrait('1544005313-94ddf0286df2'),
    memberSince: '2026-05-01',
    languages: ['AF', 'EN'],
    story: 'My grandmother sold koesisters from this stoep on Sunday mornings. I still use her recipe, and I will show you which spice shop she trusted.',
    voiceNoteSeconds: 29,
  },
  {
    id: 'host-jason',
    firstName: 'Jason',
    town: 'Woodstock, Cape Town',
    tier: 'REGISTERED',
    portrait: portrait('1500648767791-00dcc994a43e'),
    memberSince: '2026-09-01',
    languages: ['EN', 'AF'],
    story: 'I paint walls in Woodstock and fix bikes when the paint runs out. The best way to see the murals is slowly, on two wheels.',
    voiceNoteSeconds: 24,
  },
  {
    id: 'host-mandla',
    firstName: 'Mandla',
    town: 'Gugulethu, Cape Town',
    tier: 'COMMUNITY',
    portrait: portrait('1506794778202-cad84cf45f1d'),
    memberSince: '2026-03-01',
    languages: ['XH', 'EN'],
    story: 'Twenty years behind the wheel and not one missed flight. I wait inside arrivals with your name on a board, however late the plane is.',
    voiceNoteSeconds: 21,
  },
  {
    id: 'host-lwazi',
    firstName: 'Lwazi',
    town: 'Knysna',
    tier: 'COMMUNITY',
    portrait: portrait('1507003211169-0a1dd7228f2d'),
    memberSince: '2026-04-01',
    languages: ['XH', 'EN', 'AF'],
    story: 'My grandfather cut yellowwood in this forest. I walk it most mornings and I still get lost on purpose. I will show you the big trees the brochures leave out.',
    voiceNoteSeconds: 36,
  },
  {
    id: 'host-pieter',
    firstName: 'Pieter',
    town: 'Montagu',
    tier: 'IDENTITY',
    portrait: portrait('1547425260-76bcadfb4f2c'),
    memberSince: '2026-05-01',
    languages: ['AF', 'EN'],
    story: 'We grow apricots and we eat long lunches. Both take patience. You are welcome to join either one.',
    voiceNoteSeconds: 27,
  },
  {
    id: 'host-annelie',
    firstName: 'Annelie',
    town: 'Graaff-Reinet',
    tier: 'IDENTITY',
    portrait: portrait('1573496359142-b8d87734a5a2'),
    memberSince: '2026-06-01',
    languages: ['AF', 'EN'],
    story: 'I taught history in Graaff-Reinet for thirty years. The Valley of Desolation at sunset is still the best classroom I know.',
    voiceNoteSeconds: 33,
  },
  {
    id: 'host-zanele',
    firstName: 'Zanele',
    town: 'Durban',
    tier: 'IDENTITY',
    portrait: portrait('1531123897727-8f129e1688ce'),
    memberSince: '2026-02-01',
    languages: ['ZU', 'EN'],
    story: 'Durban is a city you taste before you understand it. I grew up between the market and the beach, and I will take you to both.',
    voiceNoteSeconds: 31,
  },
];


const WEEKEND: Weekday[] = ['SAT', 'SUN'];
const WEEKDAYS: Weekday[] = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
const MOST_DAYS: Weekday[] = ['TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const SAFETY_WALK = ['Your host meets you at a public place and stays with you the whole time.', 'Wear closed shoes and carry water.', 'Keep your phone in a zipped pocket in busy streets.'];
const SAFETY_HOME = ['You are a guest in a family home. Your host meets you at a public place and walks you there.', 'Tell your host about any allergies when you book.'];
const SAFETY_DRIVE = ['Your driver holds an operating licence and the vehicle is insured for passengers.', 'Seat belts for every seat. Ask for a child seat when you book.'];
const SAFETY_OUTDOORS = ['Weather changes fast. Your host will move or cancel if it is not safe, and you get your money back.', 'Bring sun protection and more water than you think you need.'];

const LISTINGS: readonly Listing[] = [
  {
    id: 'off-langa-lunch',
    hostId: 'host-nomsa',
    placeSlug: 'cape-town',
    category: 'FOOD',
    title: 'Home-cooked Xhosa lunch in Langa',
    description: 'Eat lunch at my home in Langa. I cook umngqusho (samp and beans), chicken and steamed bread. We eat together and I tell you about the neighbourhood.',
    photos: [PHOTO.sharedTable, PHOTO.foodBowls, PHOTO.braai, PHOTO.capeTownAerial],
    town: 'Langa, Cape Town',
    priceCents: 60_000,
    priceUnit: 'PER_TRIP',
    durationMin: 120,
    groupMin: 1,
    groupMax: 6,
    languages: ['XH', 'EN'],
    inclusions: ['A full meal', 'Ginger beer', 'Stories about Langa'],
    steps: ['We meet at the Langa taxi rank and walk to my home.', 'I show you how I cook umngqusho and steamed bread.', 'We eat lunch together and I tell you about Langa.'],
    whatToBring: ['An empty stomach'],
    safetyNotes: SAFETY_HOME,
    meetingPoint: 'Langa taxi rank, Washington Street',
    bookingMode: 'ON_REQUEST',
    availability: { weekdays: WEEKEND, times: ['13:00'] },
    ratings: [21, 2, 0, 0, 0],
    addedAt: '2026-03-14',
  },
  {
    id: 'lst-bokaap-spice',
    hostId: 'host-fatima',
    placeSlug: 'cape-town',
    category: 'EXPERIENCE',
    title: 'Bo-Kaap spice walk and koesister tasting',
    description: 'We walk the steep streets of the Bo-Kaap, stop at the spice shop my family has used for sixty years, and end on my stoep with warm koesisters and tea.',
    photos: [PHOTO.market, PHOTO.capeCoast, PHOTO.foodTable],
    town: 'Bo-Kaap, Cape Town',
    priceCents: 28_000,
    priceUnit: 'PER_PERSON',
    durationMin: 150,
    groupMin: 1,
    groupMax: 8,
    languages: ['AF', 'EN'],
    inclusions: ['Koesisters and tea', 'A bag of masala to take home', 'A local guide'],
    steps: ['We meet outside the Bo-Kaap Museum.', 'We walk up Wale Street and I tell you who lived where.', 'We choose spices at Atlas Trading.', 'We eat koesisters on my stoep.'],
    whatToBring: ['Comfortable shoes', 'A hat'],
    safetyNotes: SAFETY_WALK,
    meetingPoint: 'Bo-Kaap Museum, 71 Wale Street',
    bookingMode: 'INSTANT',
    availability: { weekdays: MOST_DAYS, times: ['09:30', '14:00'] },
    ratings: [34, 5, 1, 0, 0],
    addedAt: '2026-05-20',
  },
  {
    id: 'lst-woodstock-bike',
    hostId: 'host-jason',
    placeSlug: 'cape-town',
    category: 'GUIDE',
    title: 'Woodstock street art by bicycle',
    description: 'Two slow hours on quiet back streets looking at the walls I and my friends painted. I bring the bikes and the stories behind each piece.',
    photos: [PHOTO.cyclists, PHOTO.capeTownAerial],
    town: 'Woodstock, Cape Town',
    priceCents: 32_000,
    priceUnit: 'PER_PERSON',
    durationMin: 120,
    groupMin: 2,
    groupMax: 6,
    languages: ['EN', 'AF'],
    inclusions: ['A bicycle and helmet', 'A cold drink', 'A local guide'],
    steps: ['We meet at the Old Biscuit Mill and fit your bike.', 'We ride the mural route through Woodstock and Salt River.', 'We stop for a cold drink at a corner cafe.'],
    whatToBring: ['Closed shoes', 'Sunscreen'],
    safetyNotes: ['We ride on quiet streets in a group and I ride at the back.', 'Helmets are included and you must wear one.'],
    meetingPoint: 'The Old Biscuit Mill, 375 Albert Road',
    bookingMode: 'ON_REQUEST',
    availability: { weekdays: WEEKEND, times: ['09:00'] },
    ratings: [0, 0, 0, 0, 0],
    addedAt: '2026-09-10',
  },
  {
    id: 'lst-cpt-airport',
    hostId: 'host-mandla',
    placeSlug: 'cape-town',
    category: 'TRANSPORT',
    title: 'Airport lift to your door in a 7-seater',
    description: 'I fetch you inside arrivals and drive you to your door anywhere in Cape Town. There is space for six people and their bags.',
    photos: [PHOTO.driving, PHOTO.airport, PHOTO.capeCoast],
    town: 'Cape Town',
    priceCents: 45_000,
    priceUnit: 'PER_TRIP',
    durationMin: 60,
    groupMin: 1,
    groupMax: 6,
    languages: ['XH', 'EN'],
    inclusions: ['Help with bags', 'Bottled water', 'Waiting time if your flight is late'],
    steps: ['I wait for you at arrivals with your name on a board.', 'I help you with your bags.', 'I drive you to your door.'],
    whatToBring: [],
    safetyNotes: SAFETY_DRIVE,
    meetingPoint: 'Cape Town International Airport, arrivals hall',
    bookingMode: 'INSTANT',
    availability: { weekdays: [], times: [] },
    ratings: [52, 6, 1, 0, 0],
    addedAt: '2026-03-02',
  },
  {
    id: 'lst-soweto-on-foot',
    hostId: 'host-siya',
    placeSlug: 'soweto',
    category: 'GUIDE',
    title: 'Soweto on foot with someone who grew up here',
    description: 'We walk Vilakazi Street and then keep going, past where the buses turn around. You will meet people I have known for thirty years.',
    photos: [PHOTO.friendsSunrise, PHOTO.restaurant, PHOTO.market],
    town: 'Orlando West, Soweto',
    priceCents: 30_000,
    priceUnit: 'PER_PERSON',
    durationMin: 180,
    groupMin: 1,
    groupMax: 8,
    languages: ['ZU', 'EN'],
    inclusions: ['A local guide', 'A cold drink', 'Stops for photos'],
    steps: ['We meet at the Hector Pieterson Memorial.', 'We walk up Vilakazi Street, past the Mandela and Tutu houses.', 'We visit a backyard studio and a spaza shop.', 'We walk back to the memorial together.'],
    whatToBring: ['Comfortable shoes', 'A hat', 'Water'],
    safetyNotes: SAFETY_WALK,
    meetingPoint: 'Hector Pieterson Memorial, Khumalo Road',
    bookingMode: 'INSTANT',
    availability: { weekdays: MOST_DAYS, times: ['09:00', '13:30'] },
    ratings: [37, 4, 0, 0, 0],
    addedAt: '2026-02-18',
  },
  {
    id: 'lst-diepkloof-kota',
    hostId: 'host-siya',
    placeSlug: 'soweto',
    category: 'FOOD',
    title: 'Kota lunch and shebeen stories in Diepkloof',
    description: 'A kota is a quarter loaf filled with everything. We order from the window I have used since school, then sit in a shebeen while the owner tells you how it stayed open in the eighties.',
    photos: [PHOTO.ribs, PHOTO.restaurant],
    town: 'Diepkloof, Soweto',
    priceCents: 22_000,
    priceUnit: 'PER_PERSON',
    durationMin: 120,
    groupMin: 2,
    groupMax: 6,
    languages: ['ZU', 'EN'],
    inclusions: ['A kota and a cold drink', 'A local guide'],
    steps: ['We meet at the Diepkloof Square taxi rank.', 'We order kotas at the window and watch them being built.', 'We eat in the shebeen and hear its story.'],
    whatToBring: ['An empty stomach'],
    safetyNotes: SAFETY_WALK,
    meetingPoint: 'Diepkloof Square, Immink Drive',
    bookingMode: 'ON_REQUEST',
    availability: { weekdays: ['FRI', 'SAT', 'SUN'], times: ['12:30'] },
    ratings: [11, 3, 0, 0, 0],
    addedAt: '2026-06-03',
  },
  {
    id: 'lst-jnb-airport',
    hostId: 'host-siya',
    placeSlug: 'soweto',
    category: 'TRANSPORT',
    title: 'O.R. Tambo airport lift with a Soweto driver',
    description: 'A clean minibus, a careful driver and no surprises on the price. I track your flight and I am inside arrivals before you are.',
    photos: [PHOTO.airport, PHOTO.driving],
    town: 'Johannesburg',
    priceCents: 55_000,
    priceUnit: 'PER_TRIP',
    durationMin: 60,
    groupMin: 1,
    groupMax: 10,
    languages: ['ZU', 'EN'],
    inclusions: ['Help with bags', 'Bottled water', 'Waiting time if your flight is late'],
    steps: ['I wait for you at arrivals with your name on a board.', 'I help you with your bags.', 'I drive you to your door in Soweto or Johannesburg.'],
    whatToBring: [],
    safetyNotes: SAFETY_DRIVE,
    meetingPoint: 'O.R. Tambo International Airport, arrivals hall',
    bookingMode: 'INSTANT',
    availability: { weekdays: [], times: [] },
    ratings: [44, 3, 1, 0, 0],
    addedAt: '2026-02-20',
  },
  {
    id: 'lst-knysna-forest',
    hostId: 'host-lwazi',
    placeSlug: 'knysna',
    category: 'GUIDE',
    title: 'Knysna forest walk with a woodcutter’s grandson',
    description: 'Three unhurried hours under yellowwoods that were old when the first ships came. I know where the loerie nests and which path the elephants used.',
    photos: [PHOTO.forestPath, PHOTO.forestBridge, PHOTO.forestCabin],
    town: 'Knysna',
    priceCents: 26_000,
    priceUnit: 'PER_PERSON',
    durationMin: 180,
    groupMin: 1,
    groupMax: 8,
    languages: ['XH', 'EN', 'AF'],
    inclusions: ['A local guide', 'Rooibos tea from a flask', 'The forest permit'],
    steps: ['We meet at the Diepwalle forest station.', 'We walk the old woodcutters’ path to the big tree.', 'We stop for tea by the stream.', 'We loop back through the fern gully.'],
    whatToBring: ['Walking shoes', 'A rain jacket', 'Water'],
    safetyNotes: SAFETY_OUTDOORS,
    meetingPoint: 'Diepwalle Forest Station, R339',
    bookingMode: 'INSTANT',
    availability: { weekdays: MOST_DAYS, times: ['08:00'] },
    ratings: [19, 2, 0, 0, 0],
    addedAt: '2026-04-22',
  },
  {
    id: 'lst-knysna-supper',
    hostId: 'host-lwazi',
    placeSlug: 'knysna',
    category: 'FOOD',
    title: 'Supper in Khayalethu above the lagoon',
    description: 'My aunt cooks, I pour, and the whole lagoon turns orange below the house. It is the best view in Knysna and nobody sells tickets to it.',
    photos: [PHOTO.plates, PHOTO.beachSunrise, PHOTO.sharedTable],
    town: 'Khayalethu, Knysna',
    priceCents: 32_000,
    priceUnit: 'PER_PERSON',
    durationMin: 150,
    groupMin: 2,
    groupMax: 8,
    languages: ['XH', 'EN'],
    inclusions: ['A three-course supper', 'A drink on arrival', 'A lift back to town'],
    steps: ['I fetch you in town at five.', 'We watch the sun go down from the stoep.', 'We eat supper with the family.', 'I drive you back to your door.'],
    whatToBring: ['A warm jacket'],
    safetyNotes: SAFETY_HOME,
    meetingPoint: 'Knysna Waterfront, main entrance',
    bookingMode: 'ON_REQUEST',
    availability: { weekdays: ['THU', 'FRI', 'SAT'], times: ['17:00'] },
    ratings: [8, 1, 0, 0, 0],
    addedAt: '2026-07-11',
  },
  {
    id: 'lst-knysna-paddle',
    hostId: 'host-lwazi',
    placeSlug: 'knysna',
    category: 'EXPERIENCE',
    title: 'Sunrise paddle on the Knysna lagoon',
    description: 'Flat water, no engines and the Heads turning gold. I bring the boats and the coffee. You bring someone who does not mind an early start.',
    photos: [PHOTO.beachSunrise, PHOTO.mistyHills],
    town: 'Knysna',
    priceCents: 35_000,
    priceUnit: 'PER_PERSON',
    durationMin: 120,
    groupMin: 2,
    groupMax: 6,
    languages: ['EN', 'AF'],
    inclusions: ['A kayak and life jacket', 'Coffee and rusks', 'A local guide'],
    steps: ['We meet at the Thesen Island slipway before sunrise.', 'We paddle towards the Heads as it gets light.', 'We drift back with coffee.'],
    whatToBring: ['Clothes that can get wet', 'A dry top for after'],
    safetyNotes: ['Life jackets are included and you must wear one.', ...SAFETY_OUTDOORS],
    meetingPoint: 'Thesen Island slipway',
    bookingMode: 'ON_REQUEST',
    availability: { weekdays: WEEKEND, times: ['05:45'] },
    ratings: [0, 0, 0, 0, 0],
    addedAt: '2026-09-05',
  },
  {
    id: 'lst-montagu-lunch',
    hostId: 'host-pieter',
    placeSlug: 'montagu',
    category: 'FOOD',
    title: 'Long farm lunch under the pepper tree',
    description: 'Lamb from next door, bread from our oven and apricots in every course. Lunch starts at one and nobody looks at a watch.',
    photos: [PHOTO.platedDish, PHOTO.breakfast, PHOTO.foodTable, PHOTO.redRoad],
    town: 'Montagu',
    priceCents: 38_000,
    priceUnit: 'PER_PERSON',
    durationMin: 180,
    groupMin: 2,
    groupMax: 10,
    languages: ['AF', 'EN'],
    inclusions: ['A four-course lunch', 'Farm wine and grape juice', 'A walk through the orchard'],
    steps: ['We meet at the farm gate and walk through the orchard.', 'We sit down under the pepper tree.', 'Lunch arrives slowly. So does coffee.'],
    whatToBring: ['A hat'],
    safetyNotes: ['Tell your host about any allergies when you book.', 'If you are driving, we serve grape juice as happily as wine.'],
    meetingPoint: 'Farm gate, 6 km out on the Koo road',
    bookingMode: 'INSTANT',
    availability: { weekdays: ['FRI', 'SAT', 'SUN'], times: ['13:00'] },
    ratings: [27, 3, 0, 0, 0],
    addedAt: '2026-05-09',
  },
  {
    id: 'lst-route62-bakkie',
    hostId: 'host-pieter',
    placeSlug: 'montagu',
    category: 'TRANSPORT',
    title: 'Route 62 back roads in a farm bakkie',
    description: 'A half day on the gravel roads the tour buses cannot use: a pass, a padstal and a farm dam you can swim in. I drive, you look.',
    photos: [PHOTO.redRoad, PHOTO.openRoad, PHOTO.loneTree],
    town: 'Montagu',
    priceCents: 120_000,
    priceUnit: 'PER_TRIP',
    durationMin: 240,
    groupMin: 1,
    groupMax: 4,
    languages: ['AF', 'EN'],
    inclusions: ['A driver who farms here', 'Padstal coffee and a roosterkoek', 'A swim if it is hot'],
    steps: ['I fetch you in Montagu.', 'We drive the Ouberg pass on gravel.', 'We stop at a padstal and a farm dam.', 'I drop you back in town.'],
    whatToBring: ['Swimming things', 'Sunscreen'],
    safetyNotes: SAFETY_DRIVE,
    meetingPoint: 'Montagu Tourism office, Bath Street',
    bookingMode: 'ON_REQUEST',
    availability: { weekdays: WEEKDAYS, times: ['08:30'] },
    ratings: [6, 1, 0, 0, 0],
    addedAt: '2026-08-01',
  },
  {
    id: 'lst-montagu-apricots',
    hostId: 'host-pieter',
    placeSlug: 'montagu',
    category: 'EXPERIENCE',
    title: 'Apricot farm morning: pick, dry and taste',
    description: 'Montagu dries most of the country’s apricots. Spend a morning in the orchard and on the drying racks, and leave with a bag you picked yourself.',
    photos: [PHOTO.farmRows, PHOTO.breakfast],
    town: 'Montagu',
    priceCents: 18_000,
    priceUnit: 'PER_PERSON',
    durationMin: 150,
    groupMin: 1,
    groupMax: 12,
    languages: ['AF', 'EN'],
    inclusions: ['A bag of fruit to take home', 'Coffee and rusks', 'A walk through the drying yard'],
    steps: ['We meet at the packing shed.', 'We pick in the orchard for an hour.', 'We lay fruit on the racks and taste last season’s.'],
    whatToBring: ['A hat', 'Closed shoes'],
    safetyNotes: SAFETY_OUTDOORS,
    meetingPoint: 'Packing shed, 6 km out on the Koo road',
    bookingMode: 'INSTANT',
    availability: { weekdays: WEEKDAYS, times: ['08:00'] },
    ratings: [0, 0, 0, 0, 0],
    addedAt: '2026-09-12',
  },
  {
    id: 'off-karoo-farm',
    hostId: 'host-koos',
    placeSlug: 'graaff-reinet',
    category: 'EXPERIENCE',
    title: 'A morning on a Karoo sheep farm',
    description: 'Ride out with me at sunrise, help move the sheep, and eat breakfast on the stoep. It is quiet out here and you can see for a hundred kilometres.',
    photos: [PHOTO.loneTree, PHOTO.farmRows, PHOTO.breakfast, PHOTO.openRoad],
    town: 'Nieu-Bethesda',
    priceCents: 50_000,
    priceUnit: 'PER_PERSON',
    durationMin: 240,
    groupMin: 1,
    groupMax: 6,
    languages: ['AF', 'EN'],
    inclusions: ['Farm breakfast', 'A ride on the bakkie', 'Coffee on the stoep'],
    steps: ['We meet at the farm gate at sunrise.', 'We ride out on the bakkie and move the sheep.', 'We eat breakfast on the stoep.'],
    whatToBring: ['A warm jacket', 'Closed shoes', 'A hat'],
    safetyNotes: SAFETY_OUTDOORS,
    meetingPoint: 'Farm gate, 12 km out on the Murraysburg road',
    bookingMode: 'ON_REQUEST',
    availability: { weekdays: [], times: ['06:00'] },
    ratings: [14, 1, 0, 0, 0],
    addedAt: '2026-04-16',
  },
  {
    id: 'lst-desolation-sunset',
    hostId: 'host-annelie',
    placeSlug: 'graaff-reinet',
    category: 'GUIDE',
    title: 'Valley of Desolation at sunset with a historian',
    description: 'Dolerite columns a hundred metres tall and the whole Camdeboo plain below them. I tell you how it was made and who crossed it, then we watch the light go.',
    photos: [PHOTO.treeSunset, PHOTO.hiker, PHOTO.openRoad],
    town: 'Graaff-Reinet',
    priceCents: 35_000,
    priceUnit: 'PER_PERSON',
    durationMin: 150,
    groupMin: 1,
    groupMax: 8,
    languages: ['AF', 'EN'],
    inclusions: ['Park entry', 'A local guide', 'Something cold at the top'],
    steps: ['I fetch you in town at four.', 'We drive up through the Camdeboo park.', 'We walk the short crag trail.', 'We watch the sunset and drive down in the dusk.'],
    whatToBring: ['A warm jacket', 'Walking shoes', 'A camera'],
    safetyNotes: SAFETY_OUTDOORS,
    meetingPoint: 'Graaff-Reinet Museum, Church Street',
    bookingMode: 'INSTANT',
    availability: { weekdays: MOST_DAYS, times: ['16:00'] },
    ratings: [22, 2, 1, 0, 0],
    addedAt: '2026-06-08',
  },
  {
    id: 'lst-karoo-stars',
    hostId: 'host-koos',
    placeSlug: 'graaff-reinet',
    category: 'EXPERIENCE',
    title: 'Karoo night sky from the farm stoep',
    description: 'No town light for sixty kilometres. A telescope, a blanket, hot chocolate and someone who can name what you are looking at.',
    photos: [PHOTO.nightSky, PHOTO.treeSunset],
    town: 'Nieu-Bethesda',
    priceCents: 22_000,
    priceUnit: 'PER_PERSON',
    durationMin: 90,
    groupMin: 2,
    groupMax: 8,
    languages: ['AF', 'EN'],
    inclusions: ['Hot chocolate', 'A blanket and a chair', 'Time at the telescope'],
    steps: ['We meet at the farm gate after dark.', 'Your eyes get used to the dark on the stoep.', 'I show you the Southern Cross, the clouds of Magellan and whatever planet is up.'],
    whatToBring: ['Your warmest jacket'],
    safetyNotes: ['The farm road is gravel. Drive slowly and watch for kudu at night.', 'If it is cloudy we move your booking or give your money back.'],
    meetingPoint: 'Farm gate, 12 km out on the Murraysburg road',
    bookingMode: 'INSTANT',
    availability: { weekdays: [], times: ['20:00'] },
    ratings: [9, 0, 0, 0, 0],
    addedAt: '2026-08-19',
  },
  {
    id: 'lst-durban-bunny',
    hostId: 'host-zanele',
    placeSlug: 'durban',
    category: 'FOOD',
    title: 'Bunny chow crawl through Grey Street',
    description: 'Three bunnies, three arguments about which is best. We walk between them through the old Indian quarter so you have room for the next one.',
    photos: [PHOTO.foodBowls, PHOTO.restaurant, PHOTO.market],
    town: 'Durban',
    priceCents: 25_000,
    priceUnit: 'PER_PERSON',
    durationMin: 150,
    groupMin: 2,
    groupMax: 8,
    languages: ['ZU', 'EN'],
    inclusions: ['Three tastings', 'A cold drink', 'A local guide'],
    steps: ['We meet at the Juma Masjid on Dr Yusuf Dadoo Street.', 'We eat a quarter mutton bunny at the first stop.', 'We walk through the Madressa Arcade.', 'We finish with a bean bunny and a vote.'],
    whatToBring: ['An empty stomach', 'Comfortable shoes'],
    safetyNotes: SAFETY_WALK,
    meetingPoint: 'Juma Masjid, Dr Yusuf Dadoo Street',
    bookingMode: 'INSTANT',
    availability: { weekdays: MOST_DAYS, times: ['11:30'] },
    ratings: [29, 6, 1, 0, 0],
    addedAt: '2026-02-25',
  },
  {
    id: 'lst-warwick-market',
    hostId: 'host-zanele',
    placeSlug: 'durban',
    category: 'GUIDE',
    title: 'Warwick Junction market walk',
    description: 'Nine markets, half a million people a day and the best muthi, beadwork and mealies in the city. My mother traded here. I will introduce you properly.',
    photos: [PHOTO.market, PHOTO.friendsSunrise],
    town: 'Durban',
    priceCents: 20_000,
    priceUnit: 'PER_PERSON',
    durationMin: 120,
    groupMin: 1,
    groupMax: 6,
    languages: ['ZU', 'EN'],
    inclusions: ['A local guide', 'A roasted mealie', 'Introductions to the traders'],
    steps: ['We meet at the Berea Station entrance.', 'We walk the herb market and the bead market.', 'We eat a mealie at the Bovine Head market.'],
    whatToBring: ['Comfortable shoes', 'Small cash if you want to buy'],
    safetyNotes: SAFETY_WALK,
    meetingPoint: 'Berea Station, Johannes Nkosi Street entrance',
    bookingMode: 'INSTANT',
    availability: { weekdays: WEEKDAYS, times: ['09:00'] },
    ratings: [17, 2, 0, 0, 0],
    addedAt: '2026-03-30',
  },
  {
    id: 'lst-durban-dawn',
    hostId: 'host-zanele',
    placeSlug: 'durban',
    category: 'EXPERIENCE',
    title: 'Dawn on the Golden Mile: swim, stretch, coffee',
    description: 'Durban belongs to its early risers. We swim between the flags at North Beach, stretch on the grass with the regulars and drink coffee while the city wakes up.',
    photos: [PHOTO.beachPalms, PHOTO.beachSunrise],
    town: 'Durban',
    priceCents: 18_000,
    priceUnit: 'PER_PERSON',
    durationMin: 90,
    groupMin: 1,
    groupMax: 8,
    languages: ['ZU', 'EN'],
    inclusions: ['Coffee', 'A towel', 'A local guide'],
    steps: ['We meet at the North Beach lifeguard tower.', 'We swim between the flags.', 'We stretch on the grass and drink coffee.'],
    whatToBring: ['Swimming things', 'Sunscreen'],
    safetyNotes: ['We only swim between the flags while lifeguards are on duty.', 'If the sea is rough we walk the promenade instead.'],
    meetingPoint: 'North Beach lifeguard tower',
    bookingMode: 'ON_REQUEST',
    availability: { weekdays: [], times: ['05:30'] },
    ratings: [0, 0, 0, 0, 0],
    addedAt: '2026-09-15',
  },
];

const review = (id: string, listingId: string, travellerName: string, travellerFrom: string, rating: number, createdAt: string, text: string): Review => ({
  id,
  listingId,
  travellerName,
  travellerFrom,
  rating,
  createdAt,
  text,
});

const REVIEWS: readonly Review[] = [
  review('rev-01', 'off-langa-lunch', 'Hannah', 'Berlin, Germany', 5, '2026-09-06', 'The best meal of our trip and the warmest welcome. Nomsa sent us home with the bread recipe.'),
  review('rev-02', 'off-langa-lunch', 'Sipho', 'Pretoria', 5, '2026-08-23', 'I am South African and I still learned things about Langa. Go hungry.'),
  review('rev-03', 'off-langa-lunch', 'Claire', 'Lyon, France', 4, '2026-08-02', 'Lovely afternoon. The walk from the taxi rank was a nice start.'),
  review('rev-04', 'lst-bokaap-spice', 'James', 'Leeds, United Kingdom', 5, '2026-09-10', 'Fatima knows everyone on the street. The koesisters were still warm.'),
  review('rev-05', 'lst-bokaap-spice', 'Thandeka', 'Johannesburg', 5, '2026-08-29', 'Finally a Bo-Kaap walk by someone who lives there. Bought far too much masala.'),
  review('rev-06', 'lst-bokaap-spice', 'Mei', 'Singapore', 4, '2026-08-11', 'Great stories. The streets are steep, so wear proper shoes.'),
  review('rev-07', 'lst-cpt-airport', 'Oliver', 'Sydney, Australia', 5, '2026-09-12', 'Flight was two hours late and Mandla was still there with a sign and a smile.'),
  review('rev-08', 'lst-cpt-airport', 'Naledi', 'Durban', 5, '2026-09-01', 'Clean car, fair price, helped my mother with her bags.'),
  review('rev-09', 'lst-soweto-on-foot', 'Lerato', 'Cape Town', 5, '2026-09-04', 'Siya stopped every few metres to greet someone. It felt like walking with the mayor.'),
  review('rev-10', 'lst-soweto-on-foot', 'Anders', 'Oslo, Norway', 5, '2026-08-20', 'We went far past where the buses stop. The backyard studio was the highlight.'),
  review('rev-11', 'lst-soweto-on-foot', 'Priya', 'Mumbai, India', 4, '2026-08-05', 'Three hours went fast. Bring water, it gets hot.'),
  review('rev-12', 'lst-diepkloof-kota', 'Tom', 'Toronto, Canada', 5, '2026-08-30', 'I could not finish the kota and I regret nothing.'),
  review('rev-13', 'lst-jnb-airport', 'Grace', 'Nairobi, Kenya', 5, '2026-09-09', 'Tracked our flight and texted us before we landed. Very easy.'),
  review('rev-14', 'lst-knysna-forest', 'Emma', 'Amsterdam, Netherlands', 5, '2026-09-03', 'Lwazi found a loerie within ten minutes. Quiet, slow and exactly what we wanted.'),
  review('rev-15', 'lst-knysna-forest', 'Bongani', 'Gqeberha', 5, '2026-08-17', 'His grandfather’s stories made the trees feel different.'),
  review('rev-16', 'lst-knysna-supper', 'Sarah', 'Dublin, Ireland', 5, '2026-08-25', 'That view. That malva pudding. We stayed an hour longer than planned.'),
  review('rev-17', 'lst-montagu-lunch', 'Katrin', 'Munich, Germany', 5, '2026-09-07', 'Four hours at a table under a tree. Nobody wanted to leave.'),
  review('rev-18', 'lst-montagu-lunch', 'Riaan', 'Stellenbosch', 4, '2026-08-16', 'Proper farm food. Book the Sunday, it is quieter.'),
  review('rev-19', 'lst-route62-bakkie', 'Lucas', 'São Paulo, Brazil', 5, '2026-08-27', 'The farm dam swim was the best hour of our holiday.'),
  review('rev-20', 'off-karoo-farm', 'Isabel', 'Madrid, Spain', 5, '2026-09-02', 'We moved two hundred sheep before breakfast. Koos is a gentleman.'),
  review('rev-21', 'off-karoo-farm', 'Pieter', 'Bloemfontein', 5, '2026-08-13', 'My kids still talk about the bakkie ride.'),
  review('rev-22', 'lst-desolation-sunset', 'Yuki', 'Osaka, Japan', 5, '2026-09-08', 'Annelie makes geology sound like gossip. The sunset did the rest.'),
  review('rev-23', 'lst-desolation-sunset', 'Dumisani', 'East London', 4, '2026-08-21', 'Beautiful. It gets cold fast at the top, take the jacket.'),
  review('rev-24', 'lst-karoo-stars', 'Chloe', 'Cape Town', 5, '2026-09-11', 'I have never seen that many stars. The hot chocolate helped.'),
  review('rev-25', 'lst-durban-bunny', 'Aisha', 'Johannesburg', 5, '2026-09-05', 'Three bunnies is a lot of bunny. Zanele is hilarious.'),
  review('rev-26', 'lst-durban-bunny', 'Mark', 'Chicago, United States', 4, '2026-08-19', 'Spicy, messy, brilliant. Wear a dark shirt.'),
  review('rev-27', 'lst-warwick-market', 'Nomvula', 'Pietermaritzburg', 5, '2026-08-28', 'I have driven past Warwick my whole life. I needed a guide to actually see it.'),
];


/** `Offering.region` is the place's display name, which is what the traveller app's PLACES constant joins on. */
const PLACE_NAME: Record<string, string> = {
  'cape-town': 'Cape Town',
  soweto: 'Soweto',
  knysna: 'Knysna',
  montagu: 'Montagu',
  'graaff-reinet': 'Graaff-Reinet',
  durban: 'Durban',
};

/** The prototype's EXPERIENCE is the schema's TOUR (see docs/user-flows/demand-designs-consolidation-schema-requirements.md). */
const CATEGORY: Record<ListingCategory, OfferingCategory> = { EXPERIENCE: 'TOUR', FOOD: 'FOOD', GUIDE: 'GUIDE', TRANSPORT: 'TRANSPORT' };

/** Where each meeting point sits, so the traveller's map has a pin. Landmark-level accuracy; farm gates are placed on the named road. */
const MEETING_POINT: Record<string, { lat: number; lng: number }> = {
  'off-langa-lunch': { lat: -33.9447, lng: 18.5308 },
  'lst-bokaap-spice': { lat: -33.921, lng: 18.4155 },
  'lst-woodstock-bike': { lat: -33.9275, lng: 18.4575 },
  'lst-cpt-airport': { lat: -33.9715, lng: 18.6021 },
  'lst-soweto-on-foot': { lat: -26.2355, lng: 27.908 },
  'lst-diepkloof-kota': { lat: -26.247, lng: 27.953 },
  'lst-jnb-airport': { lat: -26.1337, lng: 28.242 },
  'lst-knysna-forest': { lat: -33.9525, lng: 23.156 },
  'lst-knysna-supper': { lat: -34.045, lng: 23.047 },
  'lst-knysna-paddle': { lat: -34.047, lng: 23.053 },
  'lst-montagu-lunch': { lat: -33.745, lng: 20.15 },
  'lst-route62-bakkie': { lat: -33.7867, lng: 20.1219 },
  'lst-montagu-apricots': { lat: -33.744, lng: 20.152 },
  'off-karoo-farm': { lat: -31.799, lng: 24.482 },
  'lst-desolation-sunset': { lat: -32.2515, lng: 24.5395 },
  'lst-karoo-stars': { lat: -31.799, lng: 24.482 },
  'lst-durban-bunny': { lat: -29.858, lng: 31.023 },
  'lst-warwick-market': { lat: -29.856, lng: 31.013 },
  'lst-durban-dawn': { lat: -29.846, lng: 31.035 },
};

const HOST_PHONE: Record<string, string> = {
  'host-nomsa': '+27821110001',
  'host-annelie': '+27821110003',
  'host-siya': '+27821110004',
  'host-koos': '+27821110006',
  'host-fatima': '+27821110007',
  'host-jason': '+27821110008',
  'host-mandla': '+27821110009',
  'host-lwazi': '+27821110010',
  'host-pieter': '+27821110011',
  'host-zanele': '+27821110012',
};

const HOST_SURNAME: Record<string, string> = {
  'host-nomsa': 'Dlamini',
  'host-annelie': 'Botha',
  'host-siya': 'Mthembu',
  'host-koos': 'van der Merwe',
  'host-fatima': 'Davids',
  'host-jason': 'Pillay',
  'host-mandla': 'Ngcobo',
  'host-lwazi': 'Ndlovu',
  'host-pieter': 'Joubert',
  'host-zanele': 'Khumalo',
};

/** The seed that came before this catalogue. Paused rather than deleted so bookings that point at it keep working. */
const RETIRED_OFFERING_IDS = [
  'off-langa-meal',
  'off-bokaap-walk',
  'off-township-cycle',
  'off-winelands-farm',
  'off-stellenbosch-tram',
  'off-soweto-walk',
  'off-jhb-airport-transfer',
  'off-hermanus-hike',
  'off-hermanus-sunset',
];

const TRAVELLERS = [
  { id: 'trav-jess', authUserId: 'auth-jess', email: 'jess@example.com', name: 'Jess Cronin' },
  { id: 'trav-mike', authUserId: 'auth-mike', email: 'mike@example.com', name: 'Mike Adams' },
  { id: 'trav-lindi', authUserId: 'auth-lindi', email: 'lindi@example.com', name: 'Lindiwe Sithole' },
];

/** Brandon's saved hearts for the demo traveller. */
const SAVED_LISTINGS = ['lst-knysna-forest', 'lst-montagu-lunch', 'lst-karoo-stars'].map((offeringId) => ({ travellerId: 'trav-jess', offeringId }));

const REVIEW_GROUP_SIZE = 2;
const PLATFORM_FEE_RATE = 0.15;
const MS_PER_DAY = 86_400_000;

const slugOf = (name: string): string => name.toLowerCase().replace(/[^a-z]+/g, '-');
/** Reviewers become travellers of their own, so a review page never shows one name over and over. */
const reviewerId = (name: string): string => `trav-${slugOf(name)}`;

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
 * Demo bookings for the host booking-response screen: for host-nomsa (+27821110001), one
 * REQUESTED (still awaiting a response, respondBy in the future), one CONFIRMED, one COMPLETED
 * with a SENT payout, and one CONFIRMED with a PENDING payout. Reuses the travellers seeded
 * above. `host-elana` doesn't exist in the catalogue above, so its two rows aren't ported.
 */
const BOOKING_SEEDS: BookingSeed[] = [
  {
    id: 'booking-nomsa-requested-1',
    offeringId: 'off-langa-lunch',
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
    offeringId: 'off-langa-lunch',
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
    offeringId: 'off-langa-lunch',
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
    offeringId: 'off-langa-lunch',
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
];

async function main() {
  for (const host of HOSTS) {
    const data = {
      phone: HOST_PHONE[host.id],
      fullName: `${host.firstName} ${HOST_SURNAME[host.id]}`,
      language: host.languages[0],
      serviceArea: host.town,
      story: host.story,
      tier: host.tier,
      photoUrl: host.portrait,
      createdAt: new Date(host.memberSince),
    };
    await prisma.host.upsert({ where: { id: host.id }, update: data, create: { id: host.id, ...data } });
  }

  const reviewers = [...new Set(REVIEWS.map((review) => review.travellerName))].map((name) => ({
    id: reviewerId(name),
    authUserId: `auth-${slugOf(name)}`,
    email: `${slugOf(name)}@example.com`,
    name,
  }));
  for (const traveller of [...TRAVELLERS, ...reviewers]) {
    await prisma.traveller.upsert({ where: { id: traveller.id }, update: traveller, create: traveller });
  }

  await prisma.offering.updateMany({ where: { id: { in: RETIRED_OFFERING_IDS }, status: 'LIVE' }, data: { status: 'PAUSED' } });

  for (const listing of LISTINGS) {
    const data = {
      hostId: listing.hostId,
      category: CATEGORY[listing.category],
      status: 'LIVE' as const,
      title: listing.title,
      description: listing.description,
      sourceLanguage: listing.languages[0],
      priceCents: listing.priceCents,
      priceUnit: listing.priceUnit,
      bookingMode: listing.bookingMode,
      durationMin: listing.durationMin,
      groupMin: listing.groupMin,
      groupMax: listing.groupMax,
      inclusions: listing.inclusions,
      steps: listing.steps,
      whatToBring: listing.whatToBring,
      safetyNotes: listing.safetyNotes,
      languages: listing.languages,
      meetingPoint: listing.meetingPoint,
      ...MEETING_POINT[listing.id],
      town: listing.town,
      region: PLACE_NAME[listing.placeSlug],
      photos: listing.photos,
      availability: listing.availability,
      createdAt: new Date(listing.addedAt),
    };
    await prisma.offering.upsert({ where: { id: listing.id }, update: data, create: { id: listing.id, ...data } });

    for (const review of REVIEWS.filter((item) => item.listingId === listing.id)) {
      const bookingId = `booking-${review.id}`;
      const totalCents = listing.priceUnit === 'PER_PERSON' ? listing.priceCents * REVIEW_GROUP_SIZE : listing.priceCents;
      const feeCents = Math.round(totalCents * PLATFORM_FEE_RATE);
      const reviewedAt = new Date(review.createdAt);
      await prisma.booking.upsert({
        where: { id: bookingId },
        update: {},
        create: {
          id: bookingId,
          offeringId: listing.id,
          hostId: listing.hostId,
          travellerId: reviewerId(review.travellerName),
          status: 'COMPLETED',
          date: new Date(reviewedAt.getTime() - MS_PER_DAY),
          groupSize: REVIEW_GROUP_SIZE,
          totalCents,
          feeCents,
          hostReceivesCents: totalCents - feeCents,
          respondBy: new Date(reviewedAt.getTime() - MS_PER_DAY),
          createdAt: new Date(reviewedAt.getTime() - MS_PER_DAY),
        },
      });
      await prisma.review.upsert({
        where: { bookingId },
        update: { rating: review.rating, comment: review.text, createdAt: reviewedAt },
        create: { id: review.id, bookingId, offeringId: listing.id, travellerId: reviewerId(review.travellerName), rating: review.rating, comment: review.text, createdAt: reviewedAt },
      });
    }

    const agg = await prisma.review.aggregate({ where: { offeringId: listing.id }, _avg: { rating: true }, _count: { rating: true } });
    await prisma.offering.update({ where: { id: listing.id }, data: { avgRating: agg._avg.rating ?? null, reviewCount: agg._count.rating } });
  }

  for (const saved of SAVED_LISTINGS) {
    await prisma.savedListing.upsert({ where: { travellerId_offeringId: saved }, update: {}, create: saved });
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
    ...LEGACY_OFFERING_MEDIA.map(({ id, photoUrl }) => prisma.offering.updateMany({ where: { id }, data: { photos: [photoUrl] } })),
    ...LEGACY_HOST_MEDIA.map(([id, photoUrl]) => prisma.host.updateMany({ where: { id }, data: { photoUrl } })),
  ]);
  const repairedMediaRecords = mediaRepairs.reduce((total, result) => total + result.count, 0);

  const payoutCount = BOOKING_SEEDS.filter((seed) => seed.payout).length;

  console.log(
    `Seeded ${HOSTS.length} hosts, ${TRAVELLERS.length + reviewers.length} travellers, ${LISTINGS.length} offerings, ${REVIEWS.length} reviews, ${BOOKING_SEEDS.length} demo bookings (${payoutCount} with a payout); paused ${RETIRED_OFFERING_IDS.length} retired offerings; repaired ${repairedMediaRecords} legacy media records.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
