import type { ApproxCurrency, NotificationSettings } from '../interfaces';
import { COPY_COMMON } from './copy-common.constant';
import { COPY_EXPLORE } from './copy-explore.constant';

/** Flow 6 (saved), Flow 7 (trip plans) and Flow 8 (profile, sign in). The words for starting a plan are shared with the sheet on a listing, in COPY_EXPLORE.plan. */
export const COPY_ACCOUNT = {
  saved: {
    title: 'Saved',
    emptyTitle: 'Places you save show here',
    empty: 'Tap the heart on anything you like, and it will wait here for you.',
    explore: 'Start exploring',
  },
  plans: {
    list: {
      barTitle: 'Trips',
      title: 'Your trip plans',
      emptyTitle: 'Your trip plans show here',
      empty: `A plan is a list of things to do that you can share and book from later. To start one, tap “${COPY_EXPLORE.listing.addToPlan}” on any listing.`,
      explore: 'Find something to add',
      create: 'Start this plan',
    },
    detail: {
      barTitle: 'Trip plans',
      helper: 'Put your stops in the order you like. Book each one when you are ready.',
      day: (day: number): string => `Day ${day}`,
      moveEarlier: (title: string): string => `Move ${title} earlier`,
      moveLater: (title: string): string => `Move ${title} later`,
      dayEarlier: (title: string): string => `Move ${title} to the day before`,
      dayLater: (title: string): string => `Move ${title} to the next day`,
      remove: (title: string): string => `Remove ${title} from this plan`,
      removed: 'Removed from your plan.',
      share: 'Share plan',
      shareMessage: (plan: string): string => `Have a look at my trip plan, ${plan}:`,
      emptyTitle: 'Your stops show here',
      empty: `Find something you want to do, then tap “${COPY_EXPLORE.listing.addToPlan}” to put it in this plan.`,
      explore: 'Find something to add',
      notFound: 'This plan is not on this phone. Have a look at your other plans, or start a new one.',
      backToPlans: 'See your trip plans',
    },
  },
  profile: {
    title: 'Profile',
    nameLabel: 'First name',
    nameHelper: 'This is the name your host sees.',
    nameEmpty: 'We need your first name. Type it, then save.',
    saved: 'Saved.',
    language: {
      title: 'Language',
      note: 'We are still translating the app. For now, this tells your host which language you like to speak.',
    },
    currency: {
      title: 'Currency',
      note: 'These are rough amounts to help you compare. You always pay in rand.',
      toggle: 'Show prices in my currency too',
      choose: 'Your currency',
      names: { USD: 'US dollars', EUR: 'Euros', GBP: 'British pounds' } satisfies Record<ApproxCurrency, string>,
      sample: (rand: string, approx: string): string => `${rand} is ${COPY_COMMON.approx(approx)}`,
    },
    notifications: {
      title: 'Notifications',
      note: 'Choose what we message you about.',
      labels: { bookings: 'Booking updates', reminders: 'Reminders before a trip', reviews: 'Asking for a review' } satisfies Record<keyof NotificationSettings, string>,
    },
    plansBody: 'Lists of things to do that you can share and book from.',
    becomeHost: { title: 'Become a host', body: 'Share what you know about your place, and get paid to your phone.' },
    help: 'Get help on WhatsApp',
    helpMessage: 'Hi, I am a traveller and I need some help.',
    signOut: 'Sign out',
    signedOut: 'You are signed out.',
    guest: {
      title: 'You do not need an account to look around',
      body: 'Browse, save and plan as much as you like. You only sign in when you pay, so your host knows who is coming.',
      cta: 'Sign in',
    },
  },
  signIn: {
    flowTitle: 'Sign in',
    phone: {
      title: 'What is your phone number?',
      helper: 'We will send you a code. If your number is from another country, start with + and your country code.',
      label: 'Cellphone number',
      placeholder: '082 123 4567',
      invalid: 'That number does not look right. Check it, and start with + and your country code if it is from another country.',
      offline: 'You need signal to get your code. Try again when you are connected.',
      cta: 'Send my code',
    },
    code: {
      title: 'Enter your code',
      helper: (digits: number, phone: string): string => `We sent ${digits} numbers to ${phone}.`,
      digit: (position: number, total: number): string => `Number ${position} of ${total}`,
      wrong: 'That code is not right. Check the message and try again.',
      resendIn: (seconds: number): string => `You can ask for a new code in ${seconds === 1 ? '1 second' : `${seconds} seconds`}.`,
      resend: 'Send the code again',
      resent: 'We sent you a new code.',
      change: 'Change the number',
      signedIn: 'You are signed in.',
    },
  },
} as const;
