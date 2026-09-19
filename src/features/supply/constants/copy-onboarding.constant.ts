import type { CommunityProofType, ContactChannel, DocumentType, VerificationTier } from '../interfaces';

export const COPY_COMMON = {
  back: 'Go back',
  continue: 'Continue',
  save: 'Save',
  close: 'Close',
  tryAgain: 'Try again',
  getHelp: 'Get help on WhatsApp',
  helpMessage: 'Hi, I need help with my host account.',
  loading: 'Loading',
  offline: 'You are offline. We will upload when you are connected.',
  backOnline: 'You are back online. Everything is uploaded.',
  waitingToUpload: 'Waiting to upload',
  stepOf: (current: number, total: number): string => `Step ${current} of ${total}`,
  perPerson: 'per person',
  perTrip: 'for the group',
  people: (count: number): string => (count === 1 ? '1 person' : `${count} people`),
  nav: { label: 'Main menu', offerings: 'Offerings', bookings: 'Bookings', earnings: 'Earnings', profile: 'Profile' },
  voice: {
    hold: 'Hold to speak',
    recording: 'Recording. Let go when you are done.',
    blocked: 'We could not use your microphone. Allow the microphone, or type it instead.',
    tooShort: 'That was too short. Hold the button and speak for a few seconds.',
    play: 'Play voice note',
    pause: 'Pause voice note',
  },
  notFoundTitle: 'We could not find that',
} as const;

/** The public landing page: what Hosted is, written for someone deciding whether to become a host. */
export const COPY_WELCOME = {
  join: 'Join as a host',
  joinShort: 'Join',
  signIn: 'Sign in',
  hero: {
    title: 'Get paid for what you know about your place.',
    body: 'Hosted puts local guides, drivers and home cooks in front of travellers. You get booked, and you get paid to your phone.',
  },
  how: {
    title: 'How it works',
    steps: [
      { icon: 'mic', title: 'Tell us what you do', body: 'Say it in your own language. We write your listing for you.' },
      { icon: 'calendar-check', title: 'Travellers book you', body: 'We send you a message. You say yes or no.' },
      { icon: 'banknote', title: 'You get paid', body: 'After the day, we send your money to your phone.' },
    ],
  },
  who: {
    title: 'Who it is for',
    body: 'Anyone with something real to offer a visitor.',
    people: ['Local guides', 'Taxi and bakkie drivers', 'Home cooks', 'Crafters and makers', 'People who know who to call'],
  },
  need: {
    title: 'What you need',
    items: ['A phone', 'Your ID, passport or permit', 'Something to offer'],
    notTitle: 'What you do not need',
    notItems: ['A bank account', 'A website', 'Fast internet'],
  },
  cost: {
    title: 'What it costs',
    body: (percent: number): string => `We keep ${percent}% when a traveller books you. You always see what you will receive first.`,
  },
} as const;

export const COPY_REGISTER = {
  flowTitle: 'Join',
  signInFlowTitle: 'Sign in',
  useDifferentNumber: 'Use a different number',
  alreadyRegistered: {
    title: 'This number already has a Hosted account',
    helper: (phone: string): string => `${phone} is already signed up. Sign in to carry on.`,
    signIn: 'Sign in to my account',
  },
  noAccount: {
    title: 'No account for this number yet',
    helper: (phone: string): string => `We could not find a Hosted account for ${phone}.`,
    join: 'Join with this number',
  },
  language: {
    title: 'Which language do you want to use?',
    helper: 'You can change this later.',
  },
  phone: {
    title: 'What is your phone number?',
    helper: 'We will send you a code.',
    label: 'Cellphone number',
    placeholder: '082 123 4567',
    invalid: 'That number does not look right. Type your 10 digit cellphone number.',
    offline: 'You need signal to get your code. Try again when you are connected.',
    cta: 'Send my code',
  },
  code: {
    title: 'Enter your code',
    helper: (phone: string): string => `We sent 4 numbers to ${phone}.`,
    digit: (position: number, total: number): string => `Number ${position} of ${total}`,
    wrong: 'That code is not right. Check the message and try again.',
    resendIn: (seconds: number): string => `You can ask for a new code in ${seconds} seconds.`,
    resend: 'Send again',
    resent: 'We sent you a new code.',
    verifying: 'Checking your code…',
    whatsapp: 'Get the code on WhatsApp instead',
    whatsappSent: 'We sent the code to your WhatsApp.',
  },
  name: {
    title: 'What is your first name?',
    helper: 'This is what travellers will see.',
    label: 'First name',
    empty: 'We need your first name. Type it to carry on.',
  },
  contact: {
    title: 'How should we contact you?',
    helper: 'This is where we tell you when someone books.',
    options: {
      WHATSAPP: { title: 'WhatsApp', description: 'A message on WhatsApp' },
      SMS: { title: 'SMS', description: 'A normal SMS. It uses no data.' },
      IN_APP: { title: 'In this app', description: 'You will need to open the app to see it' },
    } satisfies Record<ContactChannel, { title: string; description: string }>,
  },
  done: {
    title: (firstName: string): string => `You are in, ${firstName}.`,
    body: 'There are two things to do next. Do them in any order.',
    verifyTitle: 'Verify yourself',
    verifyBody: 'Show us your ID so travellers can trust you. You need this to go live.',
    offerTitle: 'Create your first offering',
    offerBody: 'Tell us what you do. You can just speak.',
    skip: 'Skip to home',
  },
} as const;

export const COPY_VERIFY = {
  flowTitle: 'Verify',
  why: {
    title: 'Why verify?',
    helper: 'Travellers book people they can trust. Each step unlocks more.',
    current: 'You are here',
    cta: 'Verify with my ID',
    ctaDone: 'Get community verified',
    later: 'Do this later',
    tiers: {
      REGISTERED: { name: 'Registered', unlocks: 'You can write your offerings. Travellers cannot see them yet.' },
      IDENTITY: { name: 'ID verified', unlocks: 'Your offerings go live and you can take bookings.' },
      COMMUNITY: { name: 'Community verified', unlocks: 'No limit on bookings. You get paid the same day.' },
    } satisfies Record<VerificationTier, { name: string; unlocks: string }>,
    cap: (amount: string): string => `Bookings up to ${amount} each.`,
  },
  badge: {
    REGISTERED: 'Not verified yet',
    IDENTITY: 'Verified',
    COMMUNITY: 'Community verified',
  } satisfies Record<VerificationTier, string>,
  document: {
    title: 'Which document do you have?',
    helper: 'Only we see it. Travellers never do.',
    options: {
      SA_ID: { title: 'South African ID', description: 'Green ID book or smart ID card' },
      PASSPORT: { title: 'Passport', description: 'From any country' },
      PERMIT: { title: 'Asylum or refugee permit', description: 'Your Home Affairs permit' },
    } satisfies Record<DocumentType, { title: string; description: string }>,
  },
  capture: {
    document: {
      title: 'Take a photo of your document',
      tip: 'Good light, no shadow, whole card in the frame.',
      frame: 'Your document goes inside this frame',
      alt: 'The photo of your document',
    },
    selfie: {
      title: 'Now take a selfie',
      tip: 'Face the light. Take off your hat and glasses.',
      frame: 'Your face goes inside this outline',
      alt: 'Your selfie',
    },
    take: 'Take photo',
    retake: 'Take it again',
    use: 'Use this photo',
    failed: 'We could not open that photo. Take it again.',
  },
  checking: {
    title: 'We are checking your ID',
    body: 'This can take a few minutes. You can carry on. We will tell you when it is done.',
    offline: 'You are offline. We will send your photos when you are connected.',
    cta: 'Carry on',
  },
  result: {
    verifiedTitle: 'You are verified',
    verifiedBody: 'Your offerings can go live now. Travellers see this badge next to your name.',
    verifiedCta: 'Go to my offerings',
    failedTitle: 'We could not verify you',
    failedReason: 'The photo of your ID was too dark to read. Try again in better light.',
    verifiedNotice: 'You are verified. Tap to see your badge.',
    failedNotice: 'We could not verify you. Tap to see why.',
  },
  community: {
    title: 'Get community verified',
    helper: 'Choose one thing you have. We check it and tell you.',
    options: {
      GUIDE_NUMBER: { title: 'Registered guide number', description: 'From your provincial tourism office', label: 'Your guide number' },
      OPERATING_LICENCE: { title: 'Operating licence', description: 'For taxis, shuttles and transfers', label: 'Your licence number' },
      PSIRA_NUMBER: { title: 'PSIRA number', description: 'For security work', label: 'Your PSIRA number' },
      HOST_REFERENCE: { title: 'A verified host knows me', description: 'They confirm you on their phone', label: 'Their cellphone number' },
      ORGANISATION: { title: 'A tourism office or community group', description: 'They confirm you for us', label: 'The name of the office or group' },
    } satisfies Record<CommunityProofType, { title: string; description: string; label: string }>,
    empty: 'We need this to check you. Type it to carry on.',
    submit: 'Send for checking',
    submitted: 'We got it. We will check and tell you.',
    pending: 'We are checking what you sent. We will tell you when it is done.',
    done: 'You are community verified. There is nothing more to do.',
  },
} as const;
