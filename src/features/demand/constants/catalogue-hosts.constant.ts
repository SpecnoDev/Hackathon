import type { Place, TravellerHost } from '../interfaces';

const UNSPLASH = 'https://images.unsplash.com/photo-';
const SCENE_QUERY = '?w=1200&q=70';
const PORTRAIT_QUERY = '?w=400&q=70';

/**
 * TODO: stand-ins. DESIGN.md wants the host's own photos and no stock imagery; until hosts have uploaded any,
 * these keep the traveller screens honest about how much photography they need. Every id was checked to load.
 */
const scene = (id: string): string => `${UNSPLASH}${id}${SCENE_QUERY}`;
const portrait = (id: string): string => `${UNSPLASH}${id}${PORTRAIT_QUERY}`;

export const PHOTO = {
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

export const HOSTS: readonly TravellerHost[] = [
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

/** The places on the search sheet, in the order the brief lists them. */
export const PLACES: readonly Place[] = [
  {
    slug: 'cape-town',
    name: 'Cape Town',
    region: 'Western Cape',
    photo: PHOTO.capeTownAerial,
    blurb: 'Beyond the mountain and the waterfront there are kitchens in Langa, spice shops in the Bo-Kaap and painted walls in Woodstock. The people who live here will show you.',
  },
  {
    slug: 'soweto',
    name: 'Soweto',
    region: 'Gauteng',
    photo: PHOTO.friendsSunrise,
    blurb: 'A city of more than a million people with its own food, music and history. Walk it with someone who grew up on these streets, not past it in a bus.',
  },
  {
    slug: 'knysna',
    name: 'Knysna',
    region: 'Garden Route',
    photo: PHOTO.forestPath,
    blurb: 'Old forest, a wide lagoon and hillside neighbourhoods with the best views in town. Slow down here. Your hosts already have.',
  },
  {
    slug: 'montagu',
    name: 'Montagu',
    region: 'Route 62',
    photo: PHOTO.redRoad,
    blurb: 'A fruit town between red mountains. Long lunches, farm roads and hot springs, an easy two hours from Cape Town.',
  },
  {
    slug: 'graaff-reinet',
    name: 'Graaff-Reinet',
    region: 'Great Karoo',
    photo: PHOTO.treeSunset,
    blurb: 'The heart of the Karoo: sheep farms, huge skies and the Valley of Desolation. Nieu-Bethesda is forty minutes up a gravel road.',
  },
  {
    slug: 'durban',
    name: 'Durban',
    region: 'KwaZulu-Natal',
    photo: PHOTO.beachPalms,
    blurb: 'Warm sea, curry in a loaf of bread and the busiest market in the country. Durban is best explained by someone from here.',
  },
];

/** TODO: the device's location, mocked. "Near you" reads from this until geolocation is wired in. */
export const NEAR_YOU_PLACE_SLUG = 'cape-town';
/** The town whose hosts get an editorial row on the home screen. */
export const FEATURED_PLACE_SLUG = 'soweto';
