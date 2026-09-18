import { HOST_RESPONSE_HOURS } from '@/core/constants';
import { DEMO_REJECTED_OTP, MS_PER_HOUR, RECENT_SEARCHES_KEPT, TRAVELLER_APP_SCHEMA_VERSION, createTravellerSeed } from '../../constants';
import type {
  BookingDraft,
  CancelReason,
  Filters,
  NewReview,
  NotificationSettings,
  Plan,
  SearchState,
  TravellerAppState,
  TravellerProfile,
  Trip,
} from '../../interfaces';
import { createId } from '../../utils';
import { priceBooking, refundFor } from './booking-pricing.service';
import { findListing, findPlace } from './catalogue.service';
import { travellerAppStorage } from './traveller-app-storage.service';

type Listener = () => void;

const SAVE_DEBOUNCE_MS = 150;
const NO_FILTERS: Filters = { verifiedOnly: false, instantOnly: false };

const now = (): string => new Date().toISOString();

/**
 * Client-side stand-in for the traveller API while /api/v1 is being built: seeded, saved on the device, and the
 * single place the traveller screens read and write. Swapping it for real services should not touch a screen.
 */
class TravellerAppStore {
  private state: TravellerAppState = createTravellerSeed(new Date());
  private readonly serverState: TravellerAppState = this.state;
  private ready = false;
  private hydration: Promise<void> | undefined;
  private saveTimer: ReturnType<typeof setTimeout> | undefined;
  private readonly listeners = new Set<Listener>();

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getState = (): TravellerAppState => this.state;
  getServerState = (): TravellerAppState => this.serverState;
  isReady = (): boolean => this.ready;

  hydrate(): Promise<void> {
    this.hydration ??= travellerAppStorage.loadSnapshot().then((saved) => {
      if (saved?.schemaVersion === TRAVELLER_APP_SCHEMA_VERSION) this.state = saved;
      this.ready = true;
      this.emit();
    });
    return this.hydration;
  }

  private emit(): void {
    this.listeners.forEach((listener) => listener());
  }

  private update(recipe: (state: TravellerAppState) => TravellerAppState): void {
    this.state = recipe(this.state);
    this.emit();
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => void travellerAppStorage.saveSnapshot(this.state), SAVE_DEBOUNCE_MS);
  }

  private patchTrip(tripId: string, patch: Partial<Trip>): void {
    this.update((state) => ({ ...state, trips: state.trips.map((trip) => (trip.id === tripId ? { ...trip, ...patch } : trip)) }));
  }

  private patchPlan(planId: string, recipe: (plan: Plan) => Plan): void {
    this.update((state) => ({ ...state, plans: state.plans.map((plan) => (plan.id === planId ? recipe(plan) : plan)) }));
  }

  /** Returns whether the listing is saved after the tap, so the screen can say which way it went. */
  toggleSaved(listingId: string): boolean {
    const saved = !this.state.savedIds.includes(listingId);
    this.update((state) => ({ ...state, savedIds: saved ? [listingId, ...state.savedIds] : state.savedIds.filter((id) => id !== listingId) }));
    return saved;
  }

  setSearch(patch: Partial<SearchState>): void {
    this.update((state) => ({ ...state, search: { ...state.search, ...patch } }));
  }

  /** Remembers what was searched for, by the words the traveller would recognise: their own line, or the place name. */
  submitSearch(): void {
    const { query, placeSlug, recent } = this.state.search;
    const label = query.trim() || findPlace(placeSlug)?.name;
    if (label) this.setSearch({ recent: [label, ...recent.filter((item) => item !== label)].slice(0, RECENT_SEARCHES_KEPT) });
  }

  clearSearch(): void {
    this.setSearch({ placeSlug: undefined, date: undefined, query: '' });
  }

  setFilters(patch: Partial<Filters>): void {
    this.update((state) => ({ ...state, filters: { ...state.filters, ...patch } }));
  }

  clearFilters(): void {
    this.update((state) => ({ ...state, filters: NO_FILTERS }));
  }

  /** Keeps what the traveller already chose if they come back to the same listing. */
  startBooking(listingId: string): void {
    const listing = findListing(listingId);
    if (!listing || this.state.booking?.listingId === listingId) return;
    const guests = Math.min(Math.max(this.state.search.guests, listing.groupMin), listing.groupMax);
    this.update((state) => ({ ...state, booking: { listingId, guests, date: state.search.date } }));
  }

  patchBooking(patch: Partial<BookingDraft>): void {
    this.update((state) => (state.booking ? { ...state, booking: { ...state.booking, ...patch } } : state));
  }

  /**
   * TODO: stand-in for POST /api/v1/bookings. Instant listings confirm at once; the rest become a request the host has
   * HOST_RESPONSE_HOURS to answer, and nothing is charged until they accept.
   */
  confirmBooking(): Trip | undefined {
    const draft = this.state.booking;
    const listing = draft ? findListing(draft.listingId) : undefined;
    if (!draft || !listing || !draft.date || draft.time === undefined || !draft.guest || !draft.paymentMethod) return undefined;
    const instant = listing.bookingMode === 'INSTANT';
    const trip: Trip = {
      id: createId(),
      listingId: listing.id,
      status: instant ? 'CONFIRMED' : 'REQUESTED',
      date: draft.date,
      time: draft.time,
      guests: draft.guests,
      ...priceBooking(listing, draft.guests),
      paymentMethod: draft.paymentMethod,
      guest: draft.guest,
      createdAt: now(),
      respondBy: instant ? undefined : new Date(Date.now() + HOST_RESPONSE_HOURS * MS_PER_HOUR).toISOString(),
      reviewed: false,
    };
    this.update((state) => ({ ...state, booking: undefined, trips: [trip, ...state.trips] }));
    return trip;
  }

  cancelTrip(tripId: string, reason: CancelReason): void {
    const trip = this.state.trips.find((item) => item.id === tripId);
    if (!trip) return;
    this.patchTrip(tripId, { status: 'CANCELLED', cancelledAt: now(), cancelReason: reason, refundCents: refundFor(trip, new Date()).cents });
  }

  requestReschedule(tripId: string): void {
    this.patchTrip(tripId, { rescheduleRequested: true });
  }

  /** Demo control: the host's answer to a request, which in the product arrives as a notification. */
  resolveRequest(tripId: string, accepted: boolean): void {
    this.patchTrip(tripId, accepted ? { status: 'CONFIRMED', respondBy: undefined } : { status: 'CANCELLED', cancelledAt: now(), refundCents: 0, respondBy: undefined });
  }

  /** TODO: stand-in for POST /api/v1/reviews. The private note goes to the host only, so it is not kept with the public review. */
  submitReview(tripId: string, review: NewReview): void {
    const trip = this.state.trips.find((item) => item.id === tripId);
    if (!trip) return;
    this.update((state) => ({
      ...state,
      trips: state.trips.map((item) => (item.id === tripId ? { ...item, reviewed: true } : item)),
      reviews: [
        { id: createId(), listingId: trip.listingId, travellerName: state.profile.firstName, travellerFrom: '', rating: review.rating, text: review.text.trim(), createdAt: now().slice(0, 10) },
        ...state.reviews,
      ],
    }));
  }

  createPlan(name: string): string {
    const id = createId();
    this.update((state) => ({ ...state, plans: [...state.plans, { id, name: name.trim(), items: [] }] }));
    return id;
  }

  addToPlan(planId: string, listingId: string, tripId?: string): void {
    this.patchPlan(planId, (plan) => {
      const lastDay = plan.items.reduce((latest, item) => Math.max(latest, item.day), 1);
      return { ...plan, items: [...plan.items, { id: createId(), listingId, day: lastDay, tripId }] };
    });
  }

  removePlanItem(planId: string, itemId: string): void {
    this.patchPlan(planId, (plan) => ({ ...plan, items: plan.items.filter((item) => item.id !== itemId) }));
  }

  /** Moves a stop one place earlier (-1) or later (1). It takes the day of the stop it lands next to, so days stay in order. */
  movePlanItem(planId: string, itemId: string, direction: -1 | 1): void {
    this.patchPlan(planId, (plan) => {
      const from = plan.items.findIndex((item) => item.id === itemId);
      const to = from + direction;
      if (from < 0 || to < 0 || to >= plan.items.length) return plan;
      const items = [...plan.items];
      const [moved] = items.splice(from, 1);
      items.splice(to, 0, { ...moved, day: plan.items[to].day });
      return { ...plan, items };
    });
  }

  setPlanItemDay(planId: string, itemId: string, day: number): void {
    this.patchPlan(planId, (plan) => ({
      ...plan,
      items: plan.items.map((item) => (item.id === itemId ? { ...item, day } : item)).sort((a, b) => a.day - b.day),
    }));
  }

  patchProfile(patch: Partial<TravellerProfile>): void {
    this.update((state) => ({ ...state, profile: { ...state.profile, ...patch } }));
  }

  setNotifications(patch: Partial<NotificationSettings>): void {
    this.update((state) => ({ ...state, profile: { ...state.profile, notifications: { ...state.profile.notifications, ...patch } } }));
  }

  startSignIn(returnTo?: string): void {
    this.update((state) => ({ ...state, signIn: { returnTo } }));
  }

  /** TODO: stand-in for POST /api/v1/auth/otp. No SMS is sent; any code works except DEMO_REJECTED_OTP. */
  sendCode(phone: string): void {
    this.update((state) => ({ ...state, signIn: { ...state.signIn, phone, codeSentAt: now() } }));
  }

  /** Returns where to go next when the code is right, or undefined when it is wrong. */
  confirmCode(code: string, fallbackHref: string): string | undefined {
    const { phone, returnTo } = this.state.signIn;
    if (!phone || code === DEMO_REJECTED_OTP) return undefined;
    this.update((state) => ({ ...state, signIn: {}, profile: { ...state.profile, signedIn: true, phone } }));
    return returnTo ?? fallbackHref;
  }

  signOut(): void {
    this.update((state) => ({ ...state, profile: { ...state.profile, signedIn: false } }));
  }

  async resetDemo(): Promise<void> {
    await travellerAppStorage.clear();
    this.update(() => createTravellerSeed(new Date()));
  }
}

export const travellerAppStore = new TravellerAppStore();
