import type { OfferingCategory } from '@prisma/client';
import { HOURS_PER_DAY, MINUTES_PER_HOUR, MS_PER_SECOND, OFFERING_LIST_MAX_TAKE, SECONDS_PER_MINUTE } from '@/core/constants';

export const TRIP_DURATION_MIN_NIGHTS = 1;
export const TRIP_DURATION_MAX_NIGHTS = 14;
export const DEFAULT_TRIP_NIGHTS = 3;
export const TRIP_TRAVELLERS_MIN = 1;
export const TRIP_TRAVELLERS_MAX = 12;
export const DEFAULT_TRAVELLER_COUNT = 4;
export const SHARE_CODE_LENGTH = 8;
export const MS_PER_DAY = MS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY;

/** Morning, afternoon, evening: the slot a block lands in when it is dragged onto a day. */
export const DEFAULT_START_TIMES = ['09:00', '13:00', '17:00'] as const;
export const AI_MAX_BLOCKS_PER_DAY = 3;
export const AI_CANDIDATE_LIMIT = 40;
export const CANDIDATE_LIST_LIMIT = OFFERING_LIST_MAX_TAKE;
/** Plain text so Safari and Firefox both carry the id across the drag. */
export const DND_MIME = 'text/plain';

/** Mirrors the theme's `desktop` breakpoint; the sheet's scroll hint is the one behaviour that differs by layout. */
export const DESKTOP_MEDIA_QUERY = '(min-width: 70.5rem)';
export const REDUCED_MOTION_MEDIA_QUERY = '(prefers-reduced-motion: reduce)';
export const SCROLL_HINT_PX = 56;
export const SCROLL_HINT_DELAY_MS = 300;
export const SCROLL_HINT_BACK_MS = 750;

export const TRAVEL_THEMES = [
  'Food & culture',
  'Nature & hiking',
  'Township & history',
  'Coast & wine',
  'Adventure',
  'Family',
] as const;
export type TravelTheme = (typeof TRAVEL_THEMES)[number];

/** Which kinds of experience a theme leans toward; used to brief the AI planner. */
export const THEME_CATEGORIES: Record<TravelTheme, readonly OfferingCategory[]> = {
  'Food & culture': ['FOOD', 'TOUR', 'GUIDE'],
  'Nature & hiking': ['TOUR', 'GUIDE', 'TRANSPORT'],
  'Township & history': ['TOUR', 'GUIDE', 'FOOD'],
  'Coast & wine': ['TOUR', 'FOOD', 'TRANSPORT'],
  Adventure: ['TOUR', 'TRANSPORT', 'GUIDE'],
  Family: ['FOOD', 'TOUR', 'ACCOMMODATION'],
};

export const EXPERIENCE_TYPE_LABEL: Record<OfferingCategory, string> = {
  TOUR: 'Tour',
  FOOD: 'Cooking & food',
  TRANSPORT: 'Transport',
  ACCOMMODATION: 'Stay',
  CONCIERGE: 'Concierge',
  GUIDE: 'Local guide',
  SECURITY: 'Security',
};

export const tripName = (destination: string, theme: TravelTheme): string => `${theme} in ${destination}`;

const plural = (count: number, noun: string): string => `${count} ${noun}${count === 1 ? '' : 's'}`;

export const PLANNER_COPY = {
  bar: { plan: 'Plan a trip', board: 'Trip plan', back: 'Back' },
  create: {
    title: 'Plan a trip together',
    sub: 'Set the shape of the journey. Your crew drags in the experiences and votes on what makes the cut.',
    destination: 'Where are you going?',
    destinationPlaceholder: 'Cape Town',
    departureFrom: 'Where are you leaving from?',
    departurePlaceholder: 'Johannesburg',
    duration: 'How many nights?',
    travellers: 'How many travellers?',
    departureDate: 'When do you leave?',
    theme: 'What kind of trip is it?',
    submit: 'Create the trip',
    submitting: 'Creating…',
    yourTrips: 'Your trips',
    noTrips: 'No trips yet. The first one starts above.',
    experiences: (count: number) => plural(count, 'experience'),
  },
  board: {
    invite: 'Invite friends',
    invited: 'Link copied. Send it to your crew.',
    planForMe: 'Plan it for me',
    planning: 'Planning…',
    experiences: 'Experiences',
    experiencesHint: 'Drag one onto a day, or pick a day below it.',
    experiencesHintMobile: 'Swipe through, then pick a day.',
    addExperiences: 'Add experiences',
    closePanel: 'Close experiences',
    search: 'Search by name or town',
    noMatches: 'No experiences match. Try another word.',
    scrollForMore: 'Scroll for more',
    allTypes: 'All',
    inPlan: 'In plan',
    add: 'Add',
    addToDay: 'Add to day…',
    addToThisDay: 'Add to this day',
    addingTo: (day: number) => `Adding to Day ${day}`,
    cancel: 'Cancel',
    day: (day: number) => `Day ${day}`,
    emptyDay: 'Nothing here yet. Drop an experience in.',
    timeUnset: 'Time to be set',
    favourite: 'Group favourite',
    skip: 'Group says skip',
    voteUp: 'Vote up',
    voteDown: 'Vote down',
    votes: (up: number, down: number) => `${up} up, ${down} down`,
    travellers: (joined: number, planned: number | null) =>
      planned ? `${joined} of ${planned} travellers here` : `${joined} traveller${joined === 1 ? '' : 's'}`,
    to: 'to',
    locked: 'This trip is locked. Voting and changes are closed.',
    aiUnavailable: 'The planner needs a moment. Try again, or drag experiences in yourself.',
    aiNothing: 'Nothing new fits this trip. Drag experiences in yourself.',
    savePlan: 'Save plan',
    saving: 'Saving…',
    allSaved: 'All changes saved',
    notSaved: 'Something did not save. Try again.',
    summary: (count: number, days: number) => `${plural(count, 'experience')} over ${plural(days, 'day')}`,
    planSaved: (count: number, days: number) => `Plan saved: ${plural(count, 'experience')} over ${plural(days, 'day')}.`,
  },
  modal: {
    day: (day: number) => `Day ${day}`,
    time: 'Start time',
    where: 'Where you meet',
    type: 'Type',
    duration: 'How long',
    group: 'Group size',
    price: 'Price',
    hostedBy: (name: string) => `Hosted by ${name}`,
    perPerson: 'per person',
    forGroup: 'for the group',
    askHost: 'Ask the host',
    anySize: 'Any size',
    upTo: (count: number) => `Up to ${count} people`,
    remove: 'Remove from plan',
    removeConfirm: (title: string) => `Remove ${title} from the plan?`,
    removeYes: 'Yes, remove it',
    keep: 'Keep it',
    close: 'Close',
  },
} as const;

export const PLANNER_FORM_ERRORS = {
  destination: 'Tell us where you are going.',
  departureFrom: 'Tell us where you leave from.',
  departureDate: 'Pick a departure date.',
  theme: 'Pick the kind of trip.',
  startTime: 'Use a time like 09:30.',
} as const;

export const PLANNER_ERRORS = {
  generic: 'Something went wrong. Try again.',
  notFound: 'We could not find that trip.',
  locked: 'This trip is locked, so it cannot change.',
  badDay: 'That day is not part of the trip.',
  offeringGone: 'That experience is no longer available.',
  booked: 'This experience is already booked, so it stays in the plan.',
  aiUnavailable: PLANNER_COPY.board.aiUnavailable,
  aiNothing: PLANNER_COPY.board.aiNothing,
} as const;
