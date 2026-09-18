const UNSPLASH = 'https://images.unsplash.com/photo-';
const SCENE_QUERY = '?w=1200&q=70';
const scene = (id: string): string => `${UNSPLASH}${id}${SCENE_QUERY}`;

export interface Place {
  slug: string;
  /** Matches `Offering.region` exactly: there is no Place model, so the region string is the join. */
  name: string;
  region: string;
  photo: string;
  blurb: string;
}

/** The places on the search sheet, in the order the brief lists them. Editorial copy and art live here, listings live in the database. */
export const PLACES: readonly Place[] = [
  {
    slug: 'cape-town',
    name: 'Cape Town',
    region: 'Western Cape',
    photo: scene('1580060839134-75a5edca2e99'),
    blurb: 'Beyond the mountain and the waterfront there are kitchens in Langa, spice shops in the Bo-Kaap and painted walls in Woodstock. The people who live here will show you.',
  },
  {
    slug: 'soweto',
    name: 'Soweto',
    region: 'Gauteng',
    photo: scene('1511632765486-a01980e01a18'),
    blurb: 'A city of more than a million people with its own food, music and history. Walk it with someone who grew up on these streets, not past it in a bus.',
  },
  {
    slug: 'knysna',
    name: 'Knysna',
    region: 'Garden Route',
    photo: scene('1441974231531-c6227db76b6e'),
    blurb: 'Old forest, a wide lagoon and hillside neighbourhoods with the best views in town. Slow down here. Your hosts already have.',
  },
  {
    slug: 'montagu',
    name: 'Montagu',
    region: 'Route 62',
    photo: scene('1500530855697-b586d89ba3ee'),
    blurb: 'A fruit town between red mountains. Long lunches, farm roads and hot springs, an easy two hours from Cape Town.',
  },
  {
    slug: 'graaff-reinet',
    name: 'Graaff-Reinet',
    region: 'Great Karoo',
    photo: scene('1516026672322-bc52d61a55d5'),
    blurb: 'The heart of the Karoo: sheep farms, huge skies and the Valley of Desolation. Nieu-Bethesda is forty minutes up a gravel road.',
  },
  {
    slug: 'durban',
    name: 'Durban',
    region: 'KwaZulu-Natal',
    photo: scene('1509233725247-49e657c54213'),
    blurb: 'Warm sea, curry in a loaf of bread and the busiest market in the country. Durban is best explained by someone from here.',
  },
];

export const findPlace = (slug: string | undefined): Place | undefined => PLACES.find((place) => place.slug === slug);
export const placeForRegion = (region: string | undefined): Place | undefined => PLACES.find((place) => place.name === region);

/** TODO: the device's location, mocked. "Near you" reads from this until geolocation is wired in. */
export const NEAR_YOU_PLACE_SLUG = 'cape-town';
/** The town whose hosts get an editorial row on the home screen. */
export const FEATURED_PLACE_SLUG = 'soweto';
