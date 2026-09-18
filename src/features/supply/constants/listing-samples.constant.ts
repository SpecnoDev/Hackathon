import type { LanguageCode, OfferingFields, OfferingKind } from '../interfaces';

type DraftedFields = Pick<
  OfferingFields,
  | 'title'
  | 'description'
  | 'steps'
  | 'durationMin'
  | 'groupMin'
  | 'groupMax'
  | 'priceCents'
  | 'priceUnit'
  | 'inclusions'
  | 'whatToBring'
  | 'meetingPoint'
  | 'town'
  | 'languages'
  | 'details'
>;

interface ListingSample {
  /** English is always present; the host's own language is used when there is one. */
  transcript: { EN: string } & Partial<Record<LanguageCode, string>>;
  fields: DraftedFields;
}

/**
 * Stand-ins for /api/v1/ai/transcribe and /api/v1/ai/draft-listing until those exist. This is the PRD's own
 * fallback: "a pre-recorded voice note with cached transcription".
 *
 * TODO: the AF, XH and ZU transcripts are unchecked drafts. DESIGN.md requires a first-language speaker
 * to check them before they are shown to anyone. Replace them with the real transcript of the demo voice note.
 */
export const LISTING_SAMPLES: Record<OfferingKind, ListingSample> = {
  food: {
    transcript: {
      EN: 'Hello, I am Nomsa. I live in Langa. I cook a Xhosa lunch at my home: samp and beans, chicken, and steamed bread. It takes two hours. I can take six people. The whole group pays six hundred rand.',
      XH: 'Molweni, ndinguNomsa. Ndihlala eLanga. Ndipheka isidlo sasemini sesiXhosa ekhaya lam: umngqusho, inkukhu, nesonka samanzi. Kuthatha iiyure ezimbini. Ndingamkela abantu abathandathu. Iqela lonke lihlawula amakhulu amathandathu eerandi.',
      ZU: 'Sanibonani, nginguNomsa. Ngihlala eLanga. Ngipheka ukudla kwasemini kwesiXhosa ekhaya lami: umngqusho, inkukhu, nesinkwa samanzi. Kuthatha amahora amabili. Ngingamukela abantu abayisithupha. Iqembu lonke likhokha amakhulu ayisithupha amarandi.',
      AF: "Hallo, ek is Nomsa. Ek woon in Langa. Ek kook 'n Xhosa-middagete by my huis: stampmielies en bone, hoender en stoombrood. Dit vat twee ure. Ek kan ses mense vat. Die hele groep betaal seshonderd rand.",
    },
    fields: {
      title: 'Home-cooked Xhosa lunch in Langa',
      description:
        'Eat lunch at my home in Langa. I cook umngqusho (samp and beans), chicken and steamed bread. We eat together and I tell you about the neighbourhood.',
      steps: ['We meet at the Langa taxi rank and walk to my home.', 'I show you how I cook umngqusho and steamed bread.', 'We eat lunch together and I tell you about Langa.'],
      durationMin: 120,
      groupMin: 1,
      groupMax: 6,
      priceCents: 60_000,
      priceUnit: 'PER_TRIP',
      inclusions: ['A full meal', 'Ginger beer', 'Stories about Langa'],
      whatToBring: ['An empty stomach'],
      meetingPoint: 'Langa taxi rank, Washington Street',
      town: 'Langa, Cape Town',
      languages: ['XH', 'EN'],
      details: { dietaryNotes: 'No pork. I can cook vegetarian if you ask.', minAge: 0 },
    },
  },
  experience: {
    transcript: {
      EN: 'I take people on a walk through Langa. We visit the old hostels, a spaza shop and an artist I know. It takes two hours. I can take eight people. Each person pays two hundred rand.',
    },
    fields: {
      title: 'Walk Langa with someone who lives here',
      description: 'A slow walk through Langa with a neighbour, not a tour bus. We visit the old hostels, a spaza shop and the studio of an artist I know.',
      steps: [
        'We meet at Guga S’thebe Arts Centre.',
        'We walk to the old hostels and I tell you their story.',
        'We stop at a spaza shop for a cold drink.',
        'We visit the studio of an artist I know.',
      ],
      durationMin: 120,
      groupMin: 1,
      groupMax: 8,
      priceCents: 20_000,
      priceUnit: 'PER_PERSON',
      inclusions: ['A local guide', 'A cold drink', 'A visit to an artist'],
      whatToBring: ['Comfortable shoes', 'A hat', 'Water'],
      meetingPoint: 'Guga S’thebe Arts Centre, Washington Street',
      town: 'Langa, Cape Town',
      languages: ['XH', 'EN'],
      details: { difficulty: 'MODERATE', minAge: 8 },
    },
  },
  transport: {
    transcript: {
      EN: 'I drive people from the airport to town in my Avanza. It has six seats and space for bags. It takes about an hour. The whole group pays four hundred rand.',
    },
    fields: {
      title: 'Airport lift in a 7-seater',
      description: 'I fetch you at arrivals and drive you to your door anywhere in Cape Town. There is space for six people and their bags.',
      steps: ['I wait for you at arrivals with your name on a board.', 'I help you with your bags.', 'I drive you to your door.'],
      durationMin: 60,
      groupMin: 1,
      groupMax: 6,
      priceCents: 40_000,
      priceUnit: 'PER_TRIP',
      inclusions: ['Help with bags', 'Bottled water'],
      whatToBring: [],
      meetingPoint: 'Cape Town International Airport, arrivals hall',
      town: 'Cape Town',
      languages: ['EN', 'XH'],
      details: { vehicle: 'Toyota Avanza', seats: 6 },
    },
  },
  guide: {
    transcript: {
      EN: 'I guide people on Vilakazi Street in Soweto. I grew up here and I know the stories. It takes three hours. I can take eight people. Each person pays three hundred rand.',
    },
    fields: {
      title: 'Vilakazi Street with a local guide',
      description: 'I grew up two streets from Vilakazi Street. I show you the houses, the memorial and the places the tour buses do not stop at.',
      steps: [
        'We meet at the Hector Pieterson Memorial.',
        'We walk up Vilakazi Street, past the Mandela and Tutu houses.',
        'We stop at the places the tour buses do not stop at.',
        'We walk back to the memorial together.',
      ],
      durationMin: 180,
      groupMin: 1,
      groupMax: 8,
      priceCents: 30_000,
      priceUnit: 'PER_PERSON',
      inclusions: ['A local guide', 'Stops for photos', 'Help with the language'],
      whatToBring: ['Comfortable shoes', 'A hat', 'Water'],
      meetingPoint: 'Hector Pieterson Memorial, Khumalo Road',
      town: 'Orlando West, Soweto',
      languages: ['ZU', 'EN'],
      details: { areasCovered: 'Orlando West, Vilakazi Street, Hector Pieterson Memorial', difficulty: 'MODERATE' },
    },
  },
  concierge: {
    transcript: {
      EN: 'I arrange an evening in the Karoo for visitors. A braai on a farm, a guide for the stars, and a lift home. I book it all. The whole group pays one thousand rand.',
    },
    fields: {
      title: 'Your Karoo evening, arranged',
      description: 'Tell me how many you are. I book the farm braai, the stargazing guide and the lift back to town. You just arrive.',
      steps: ['You tell me how many people are coming.', 'I book the farm braai, the star guide and your lift.', 'I meet you at the Owl House and take you there.', 'Your lift brings you back to town.'],
      durationMin: 240,
      groupMin: 2,
      groupMax: 10,
      priceCents: 100_000,
      priceUnit: 'PER_TRIP',
      inclusions: ['Everything booked for you', 'I meet you there', 'Help on WhatsApp all day'],
      whatToBring: ['A warm jacket'],
      meetingPoint: 'The Owl House, Martin Street',
      town: 'Nieu-Bethesda',
      languages: ['AF', 'EN'],
      details: {},
    },
  },
  security: {
    transcript: { EN: '' },
    fields: {
      title: '',
      description: '',
      steps: [],
      durationMin: 60,
      groupMin: 1,
      groupMax: 1,
      priceCents: 0,
      priceUnit: 'PER_TRIP',
      inclusions: [],
      whatToBring: [],
      meetingPoint: '',
      town: '',
      languages: ['EN'],
      details: {},
    },
  },
};
