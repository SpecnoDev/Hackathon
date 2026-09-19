import { connectivityService } from '@/core/services/client';
import { hostReceivesCents, maskPhone, toE164 } from '@/shared/utils';
import {
  DEFAULT_GROUP_MAX,
  DEMO_CHECKING_DELAY_MS,
  DEMO_PAYOUT_DELAY_MS,
  DEMO_VERIFICATION_DELAY_MS,
  GROUP_SIZE_MIN,
  HOST_APP_SCHEMA_VERSION,
  HOST_COPY,
  LISTING_SAMPLES,
  MS_PER_HOUR,
  NEW_DRAFT_KEY,
  OUTBOX_MAX_ATTEMPTS,
  PAYOUT_WINDOW_HOURS,
  TITLE_MIN_LENGTH,
  createSeedState,
  isDemoMode,
  kindOption,
} from '../constants';
import type {
  Booking,
  BookingStatus,
  CaptureKind,
  CommunityProofType,
  ContactChannel,
  Host,
  HostAppState,
  LanguageCode,
  Offering,
  OfferingDraft,
  OfferingFields,
  OfferingKind,
  OfferingStatus,
  OutboxEntry,
  Payout,
  PayoutChannel,
  PayoutDetails,
  PublishResult,
  RegistrationIntent,
  RegistrationProgress,
  ResponseReason,
  VerificationOutcome,
  VerificationProgress,
} from '../interfaces';
import { createId } from '../utils';
import type { HostBookingRow, HostPayoutRow } from './booking-payload.service';
import { fromBookingRow, fromPayoutRow } from './booking-payload.service';
import type { HostApiOutcome } from './host-api.service';
import { hostApiService } from './host-api.service';
import { hostAppStorage } from './host-app-storage.service';
import type { HostProfileRow, OfferingRow } from './offering-payload.service';
import { fromHostProfile, fromOfferingRow, toOfferingPayload } from './offering-payload.service';

type Listener = () => void;

const SAVE_DEBOUNCE_MS = 150;
const API = '/api/v1';
const CAPTURE_KEY: Record<CaptureKind, string> = { document: 'verify-document', selfie: 'verify-selfie' };

const now = (): string => new Date().toISOString();
const inMs = (ms: number): string => new Date(Date.now() + ms).toISOString();

const emptyFields = (kind: OfferingKind, language: LanguageCode): OfferingFields => ({
  kind,
  title: '',
  description: '',
  steps: [],
  durationMin: 0,
  groupMin: GROUP_SIZE_MIN,
  groupMax: DEFAULT_GROUP_MAX,
  priceCents: 0,
  priceUnit: 'PER_PERSON',
  inclusions: [],
  whatToBring: [],
  meetingPoint: '',
  town: '',
  region: '',
  languages: language === 'EN' ? ['EN'] : [language, 'EN'],
  photos: [],
  availability: { type: 'ON_REQUEST', dates: [], weekdays: [] },
  details: {},
});

/** The listing content of an offering, without its identity, status or counters. */
const pickFields = (offering: Offering): OfferingFields => {
  const { id, hostId, category, sourceLanguage, status, statusReason, views, pendingSync, createdAt, updatedAt, ...fields } = offering;
  return fields;
};

/** What a listing needs before a traveller could book it. Photos are encouraged, not required. */
export const missingDraftFields = (fields: OfferingFields): Array<'title' | 'description' | 'duration' | 'price' | 'meetingPoint' | 'region'> => [
  ...(fields.title.trim().length < TITLE_MIN_LENGTH ? (['title'] as const) : []),
  ...(fields.description.trim() ? [] : (['description'] as const)),
  ...(fields.durationMin > 0 ? [] : (['duration'] as const)),
  ...(fields.priceCents > 0 ? [] : (['price'] as const)),
  ...(fields.meetingPoint.trim() && fields.town.trim() ? [] : (['meetingPoint'] as const)),
  ...(fields.region.trim() ? [] : (['region'] as const)),
];

/**
 * Client-side stand-in for the host API while /api/v1 is being built: seeded, persisted to IndexedDB,
 * and the single place the screens read and write. Swapping it for real services should not touch a screen.
 */
class HostAppStore {
  private state: HostAppState = createSeedState(new Date());
  private readonly serverState: HostAppState = this.state;
  private ready = false;
  private hydration: Promise<void> | undefined;
  private saveTimer: ReturnType<typeof setTimeout> | undefined;
  private readonly listeners = new Set<Listener>();
  private syncing: Promise<void> | undefined;
  /**
   * Writes `enqueue` fired straight at the network (online path) rather than queuing in the outbox.
   * Added when the send starts, removed once it settles — `signOut` awaits whatever's left so a
   * write started a moment before "Sign out" is clicked still lands before the session is torn down.
   */
  private readonly inFlightSends = new Set<Promise<unknown>>();
  /**
   * F4: bumped on confirmCode success and on sign-out, the two moments the `host_session` cookie
   * changes whose it is. `runSync` captures this at start and re-checks it after each await, so a
   * sync started under the old identity discards its result instead of writing state (including
   * `activeHostId`) for a host that is no longer the one signed in.
   */
  private syncGeneration = 0;

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getState = (): HostAppState => this.state;
  getServerState = (): HostAppState => this.serverState;
  isReady = (): boolean => this.ready;

  hydrate(): Promise<void> {
    this.hydration ??= hostAppStorage.loadSnapshot().then((saved) => {
      if (saved?.schemaVersion === HOST_APP_SCHEMA_VERSION) this.state = this.withOutboxMigrated(saved);
      this.ready = true;
      this.emit();
      // Best-effort and never awaited: ready stays IndexedDB-driven so venue Wi-Fi never white-screens.
      if (connectivityService.isOnline()) void this.syncFromServer();
    });
    return this.hydration;
  }

  /**
   * F4 migration: an outbox entry saved before `hostId` existed on `OutboxEntry` carries no proof
   * of whose write it was. Guessing "whoever is active now" would recreate the exact bug this
   * closes if the active host has changed since, so a legacy entry is dropped rather than
   * guessed at — the write was queued once and the host can redo it once signed back in.
   */
  private withOutboxMigrated(saved: HostAppState): HostAppState {
    const legacy = saved.outbox.filter((entry) => !entry.hostId);
    if (legacy.length === 0) return saved;
    console.warn(`host-app.store: dropping ${legacy.length} outbox entr${legacy.length === 1 ? 'y' : 'ies'} saved before per-host tracking existed`);
    return { ...saved, outbox: saved.outbox.filter((entry) => entry.hostId) };
  }

  /**
   * Pulls the signed-in host's profile and offerings from the server (the `host_session` cookie
   * says who that is). Best-effort and silent: no session or no signal just leaves the store as
   * it was — offline, or a fresh device that has never registered, is the normal case, not a fault.
   */
  syncFromServer(): Promise<void> {
    this.syncing ??= this.runSync().finally(() => {
      this.syncing = undefined;
    });
    return this.syncing;
  }

  private async runSync(): Promise<void> {
    const generation = this.syncGeneration;
    const profileResponse = await hostApiService.request<HostProfileRow>('GET', `${API}/hosts/me`);
    if (generation !== this.syncGeneration || !profileResponse.ok || !profileResponse.data) return;
    const profile = profileResponse.data;
    const hostId = profile.id;
    const existingHost = this.state.hosts.find((item) => item.id === hostId);
    const host = fromHostProfile(profile, existingHost);
    this.update((state) => ({
      ...state,
      hosts: existingHost ? state.hosts.map((item) => (item.id === hostId ? host : item)) : [...state.hosts, host],
      // The host_session cookie is authoritative for who is signed in, so this always wins — even
      // right after a sign-out, where there is no local active host to defer to anyway.
      activeHostId: hostId,
    }));

    const syncStartedAt = now();
    const offeringsResponse = await hostApiService.request<OfferingRow[]>('GET', `${API}/hosts/me/offerings`);
    if (generation !== this.syncGeneration || !offeringsResponse.ok || !offeringsResponse.data) return;
    const rows = offeringsResponse.data;
    this.update((state) => {
      const localById = new Map(state.offerings.map((item) => [item.id, item]));
      const serverOfferings = rows.map((row) => fromOfferingRow(row, localById.get(row.id)));
      const serverIds = new Set(serverOfferings.map((item) => item.id));
      // Everything for this host that isn't on the server is kept only if it's still queued in the
      // outbox, or was created locally after this sync's GET started (published mid-flight, so this
      // response predates it) — anything else is stale and dropped.
      const keptLocalOnly = state.offerings.filter(
        (item) => item.hostId === hostId && !serverIds.has(item.id) && (item.pendingSync || item.createdAt > syncStartedAt),
      );
      const otherHosts = state.offerings.filter((item) => item.hostId !== hostId);
      return { ...state, offerings: [...serverOfferings, ...keptLocalOnly, ...otherHosts] };
    });

    const bookingsResponse = await hostApiService.request<HostBookingRow[]>('GET', `${API}/hosts/me/bookings`);
    if (generation !== this.syncGeneration || !bookingsResponse.ok || !bookingsResponse.data) return;
    const bookingRows = bookingsResponse.data;
    this.update((state) => {
      const localById = new Map(state.bookings.map((item) => [item.id, item]));
      const serverBookings = bookingRows.map((row) => fromBookingRow(row, hostId, localById.get(row.id)));
      const serverIds = new Set(serverBookings.map((item) => item.id));
      // Same rule as offerings above. This is also what keeps a seed persona's demo bookings
      // (host-seed.constant.ts) from leaking onto a real signed-in host that happens to share its id
      // (SEED_HOST_IDS.nomsa and the seeded DB host both use 'host-nomsa'): this always replaces the
      // whole list for this hostId with the server's, so a seed booking with no server row and an old
      // createdAt is dropped outright rather than merely hidden by a selector filter.
      const keptLocalOnly = state.bookings.filter(
        (item) => item.hostId === hostId && !serverIds.has(item.id) && (item.pendingSync || item.createdAt > syncStartedAt),
      );
      const otherHosts = state.bookings.filter((item) => item.hostId !== hostId);
      return { ...state, bookings: [...serverBookings, ...keptLocalOnly, ...otherHosts] };
    });

    const payoutsResponse = await hostApiService.request<HostPayoutRow[]>('GET', `${API}/hosts/me/payouts`);
    if (generation !== this.syncGeneration || !payoutsResponse.ok || !payoutsResponse.data) return;
    const payoutRows = payoutsResponse.data;
    this.update((state) => {
      const serverPayouts = payoutRows.map((row) => fromPayoutRow(row, hostId));
      const serverIds = new Set(serverPayouts.map((item) => item.id));
      // Payout carries no createdAt/pendingSync to test staleness with (unlike Booking/Offering above), so
      // a local-only payout is kept only if the booking it settles is still around after the merge just
      // above — that's true for one `completeBooking()` just made locally (no server endpoint yet, see its
      // TODO), and false for a seed persona's demo payouts once their matching demo bookings are dropped.
      const validBookingIds = new Set(state.bookings.filter((item) => item.hostId === hostId).map((item) => item.id));
      const keptLocalOnly = state.payouts.filter(
        (item) => item.hostId === hostId && !serverIds.has(item.id) && validBookingIds.has(item.bookingId),
      );
      const otherHosts = state.payouts.filter((item) => item.hostId !== hostId);
      return { ...state, payouts: [...serverPayouts, ...keptLocalOnly, ...otherHosts] };
    });
  }

  private emit(): void {
    this.listeners.forEach((listener) => listener());
  }

  private update(recipe: (state: HostAppState) => HostAppState): void {
    this.state = recipe(this.state);
    this.emit();
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => void hostAppStorage.saveSnapshot(this.state), SAVE_DEBOUNCE_MS);
  }

  private get host(): Host {
    return this.state.hosts.find((item) => item.id === this.state.activeHostId) ?? this.state.hosts[0];
  }

  private patchHost(patch: Partial<Host>): void {
    this.update((state) => ({ ...state, hosts: state.hosts.map((item) => (item.id === state.activeHostId ? { ...item, ...patch } : item)) }));
  }

  private patchOffering(id: string, patch: Partial<Offering>): void {
    this.update((state) => ({
      ...state,
      offerings: state.offerings.map((item) => (item.id === id ? { ...item, ...patch, updatedAt: now() } : item)),
    }));
  }

  private patchBooking(id: string, patch: Partial<Booking>): void {
    this.update((state) => ({ ...state, bookings: state.bookings.map((item) => (item.id === id ? { ...item, ...patch } : item)) }));
  }

  /**
   * Records a write in the shape docs/TECH_STACK.md gives the outbox. Offline it waits; online it fires
   * immediately and, since this stays synchronous for its 17 call sites, resolves asynchronously through
   * `update()` instead of a return value: `onSuccess` (when given) applies a server-authoritative field
   * once the response lands. A `RETRY` re-queues the entry for the next `flushOutbox`; a `DROPPED` write
   * (the server rejected it outright) just needs `pendingSync` cleared so the UI stops saying "waiting".
   * Returns true when the write is (at least optimistically) still waiting to upload.
   */
  private enqueue(method: OutboxEntry['method'], path: string, body?: unknown, onSuccess?: (data: unknown) => void): boolean {
    const entry: OutboxEntry = { id: createId(), hostId: this.host.id, method, path: `${API}${path}`, body, attempts: 0 };
    if (!connectivityService.isOnline()) {
      this.update((state) => ({ ...state, outbox: [...state.outbox, entry] }));
      return true;
    }
    const send = hostApiService.send(entry).then((result) => {
      if (result.outcome === 'SYNCED') onSuccess?.(result.data);
      else if (result.outcome === 'RETRY') this.update((state) => ({ ...state, outbox: [...state.outbox, entry] }));
      else this.clearPendingSync(entry);
    });
    this.inFlightSends.add(send);
    void send.finally(() => this.inFlightSends.delete(send));
    return false;
  }

  private applyOfferingStatus(id: string, data: unknown): void {
    const status = (data as { status?: OfferingStatus } | undefined)?.status;
    if (status) this.patchOffering(id, { status });
  }

  private applyBookingStatus(id: string, data: unknown): void {
    const status = (data as { status?: BookingStatus } | undefined)?.status;
    if (status) this.patchBooking(id, { status });
  }

  /** The offering or booking id a queued write is about, read off its path (or its POST body, for a create). */
  private entityIdFromEntry(entry: OutboxEntry): string | undefined {
    const nestedId = entry.path.match(/\/(?:offerings|bookings)\/([^/]+)/)?.[1];
    if (nestedId) return nestedId;
    return entry.path.endsWith('/offerings') ? (entry.body as { id?: string } | undefined)?.id : undefined;
  }

  /** A write that will never be retried (synced, or dropped outright) is no longer "waiting to upload". */
  private clearPendingSync(entry: OutboxEntry): void {
    const entityId = this.entityIdFromEntry(entry);
    if (!entityId) return;
    this.update((state) => ({
      ...state,
      offerings: state.offerings.map((item) => (item.id === entityId ? { ...item, pendingSync: false } : item)),
      bookings: state.bookings.map((item) => (item.id === entityId ? { ...item, pendingSync: false } : item)),
    }));
  }

  /**
   * `RETRY` stays queued (and counts an attempt, giving up once `OUTBOX_MAX_ATTEMPTS` is reached) so a
   * permanent rejection (a bad 4xx, see hostApiService.send) can never loop forever; `SYNCED` and
   * `DROPPED` both leave the outbox for good, the difference being only whether `onSuccess` fires.
   */
  private settleOutboxEntry(entry: OutboxEntry, outcome: HostApiOutcome): void {
    const attempts = entry.attempts + 1;
    const giveUp = outcome === 'RETRY' && attempts >= OUTBOX_MAX_ATTEMPTS;
    const settled = outcome !== 'RETRY' || giveUp;
    const entityId = settled ? this.entityIdFromEntry(entry) : undefined;
    this.update((state) => ({
      ...state,
      outbox: settled ? state.outbox.filter((item) => item.id !== entry.id) : state.outbox.map((item) => (item.id === entry.id ? { ...item, attempts } : item)),
      offerings: entityId ? state.offerings.map((item) => (item.id === entityId ? { ...item, pendingSync: false } : item)) : state.offerings,
      bookings: entityId ? state.bookings.map((item) => (item.id === entityId ? { ...item, pendingSync: false } : item)) : state.bookings,
      lastPublished:
        outcome === 'SYNCED' && entityId && state.lastPublished?.offeringId === entityId && state.lastPublished.outcome === 'WAITING_TO_UPLOAD'
          ? { ...state.lastPublished, outcome: 'LIVE' }
          : state.lastPublished,
    }));
  }

  /** F4: never sends a write for a host that isn't the one currently signed in, even if a caller hands it a mixed list. */
  private async replayOutbox(entries: OutboxEntry[]): Promise<void> {
    for (const entry of entries) {
      if (entry.hostId !== this.state.activeHostId) continue;
      const result = await hostApiService.send(entry);
      this.settleOutboxEntry(entry, result.outcome);
    }
  }

  /** Called when signal returns. Returns how many writes were waiting; the replay itself finishes asynchronously. */
  flushOutbox(): number {
    const entries = this.state.outbox.filter((entry) => entry.hostId === this.state.activeHostId);
    if (entries.length > 0) void this.replayOutbox(entries);
    return entries.length;
  }

  // Registration

  /** A fresh start from the landing page: JOIN for a new host, SIGN_IN for a returning one. */
  startRegistration(intent: RegistrationIntent = 'JOIN'): void {
    this.update((state) => ({ ...state, registration: { intent } }));
  }

  answerRegistration(patch: Partial<RegistrationProgress>): void {
    this.update((state) => ({ ...state, registration: { ...state.registration, ...patch } }));
  }

  /** Saves the number and "sends" the OTP. Also used for Send again. */
  sendCode(phone: string): void {
    this.answerRegistration({ phone, codeSentAt: now(), codeConfirmed: undefined });
  }

  /**
   * RETURNING means the synced profile already has a name — a host who registered before, on
   * this device or another. NEW_HOST covers both a first-ever sign-up and a sync that failed
   * (offline right after verifying): either way, registration has more questions to ask.
   */
  async confirmCode(code: string): Promise<'WRONG_CODE' | 'NEW_HOST' | 'RETURNING'> {
    const phone = this.state.registration.phone ?? '';
    const response = await hostApiService.request<{ id: string }>('POST', `${API}/auth/host/verify`, { phone, code });
    if (!response.ok) return 'WRONG_CODE';
    // F4/2: the verify route already set the host_session cookie to this host server-side before
    // this response landed, so the browser is no longer the outgoing host's from this point on —
    // bump the generation so an in-flight runSync from before this call discards its result
    // instead of writing the outgoing host's activeHostId/offerings over this one.
    this.syncGeneration++;
    const hostId = response.data?.id;
    // F4: activeHostId flips to the verified host the moment the cookie does — switchActiveHost
    // sets it in the same update as the local-state wipe, so from this line on no outbox entry
    // with a different hostId can ever match `activeHostId` and be replayed under this cookie,
    // even if the sync below never finishes (offline right after verifying). This device may still
    // be holding another host's local data (outbox, drafts, verification, registration); the wipe
    // only clears local state, so its ordering relative to the cookie doesn't matter — it just has
    // to happen before this device is treated as this host's from here on.
    if (hostId) this.switchActiveHost(hostId);
    this.answerRegistration({ codeConfirmed: true, hostId });
    // The host_session cookie was just set: any sync already in flight started before it existed
    // and is answering a different question, so don't coalesce onto it.
    this.syncing = undefined;
    // Demo pitch mode (Join only, see demo.constant.ts): the profile/offerings/bookings/payouts sync
    // below is four sequential network round trips the OTP screen has no reason to block on for a
    // canned host — fire it and return immediately; EnterCodePage's own demo check routes a Join the
    // same way regardless of what this would have resolved to. Sign-in keeps the awaited, accurate
    // read below since its RETURNING/NEW_HOST split still drives real routing.
    if (isDemoMode && this.state.registration.intent === 'JOIN') {
      void this.syncFromServer();
      return 'NEW_HOST';
    }
    await this.syncFromServer();
    const host = this.state.hosts.find((item) => item.id === hostId);
    return host?.firstName.trim() ? 'RETURNING' : 'NEW_HOST';
  }

  /**
   * F4: activeHostId flips to the verified host the moment the cookie does — this sets it in the
   * same update as the wipe below, so the two can never be observed apart. The outgoing host's
   * outbox must NOT be replayed here — by the time this runs, the `host_session` cookie is already
   * the new host's (the verify route sets it before responding, see confirmCode), so any write sent
   * now would land under the new host's session. Instead, when actually switching identity, this
   * only drops local device state that belongs to the outgoing host: drafts, verification progress,
   * the last publish, and the identity half of `registration` (name, contact channel, completed-at).
   * `intent`/`language`/`phone`/`codeSentAt` survive — they belong to whoever is signing in right
   * now, not the host being replaced. Re-verifying the same phone (hostId already active) skips the wipe
   * entirely, so a retry never blows away that host's own in-progress local state.
   * The outgoing host's outbox entries stay put, still tagged with their hostId; `flushOutbox`/
   * `replayOutbox` both filter by `activeHostId`, so they simply wait, untouched, until that host
   * is active again (signs back in on this device) and matches the filter once more.
   */
  private switchActiveHost(hostId: string): void {
    this.update((state) =>
      state.activeHostId === hostId
        ? { ...state, activeHostId: hostId }
        : {
            ...state,
            activeHostId: hostId,
            drafts: {},
            verification: { state: 'IDLE' },
            lastPublished: undefined,
            registration: {
              intent: state.registration.intent,
              language: state.registration.language,
              phone: state.registration.phone,
              codeSentAt: state.registration.codeSentAt,
            },
          },
    );
  }

  /** The last step. Creates the host and signs them in. */
  completeRegistration(contactChannel: ContactChannel): void {
    const { registration } = this.state;
    const phone = toE164(registration.phone ?? '') ?? '';
    const firstName = (registration.firstName ?? '').trim();
    const language = registration.language ?? 'EN';
    const host: Host = {
      id: registration.hostId ?? createId(),
      phone,
      firstName,
      language,
      contactChannel,
      notifications: { WHATSAPP: true, SMS: true, IN_APP: true },
      town: '',
      region: '',
      story: '',
      tier: 'REGISTERED',
      payoutChannel: 'CASH_SEND',
      payoutDetails: { phone },
    };
    this.enqueue('PATCH', '/hosts/me', { fullName: firstName, language, contactChannel });
    this.update((state) => ({
      ...state,
      // confirmCode's syncFromServer may already have pulled this host in (with an empty name):
      // upsert by id rather than always pushing, or a NEW_HOST registration would duplicate the row.
      hosts: state.hosts.some((item) => item.id === host.id) ? state.hosts.map((item) => (item.id === host.id ? host : item)) : [...state.hosts, host],
      activeHostId: host.id,
      // F5: codeConfirmed/hostId only mean "this OTP verify still stands, skip re-proving it" for the
      // registration flow that is finishing right now — carrying them past this point would let a
      // later, unrelated registration (e.g. this device signs out and a different phone starts Join)
      // skip OTP on stale say-so. The host row itself keeps its id; registration doesn't need to.
      registration: { ...state.registration, contactChannel, completedAt: now(), codeConfirmed: undefined, hostId: undefined },
      verification: { state: 'IDLE' },
      drafts: {},
      lastPublished: undefined,
    }));
  }

  // Verification

  setVerification(patch: Partial<VerificationProgress>): void {
    this.update((state) => ({ ...state, verification: { ...state.verification, ...patch } }));
  }

  /** Each capture gets a fresh key so a retake shows the new photo, not the cached one. */
  async saveCapture(kind: CaptureKind, photo: Blob): Promise<void> {
    const previous = kind === 'document' ? this.state.verification.documentPhotoKey : this.state.verification.selfieKey;
    const key = `${CAPTURE_KEY[kind]}-${createId()}`;
    await hostAppStorage.putBlob(key, photo);
    if (previous) void hostAppStorage.deleteBlob(previous);
    this.setVerification(kind === 'document' ? { documentPhotoKey: key } : { selfieKey: key });
  }

  submitVerification(): void {
    this.enqueue('POST', '/hosts/me/verification', { documentType: this.state.verification.documentType }, (data) => {
      const tier = (data as { tier?: Host['tier'] } | undefined)?.tier;
      if (tier) this.patchHost({ tier });
    });
    this.setVerification({ state: 'CHECKING', resolveAt: inMs(isDemoMode ? DEMO_CHECKING_DELAY_MS : DEMO_VERIFICATION_DELAY_MS) });
  }

  /** Demo only: stands in for the KYC provider calling back. */
  resolveVerification(): VerificationOutcome {
    const outcome = this.state.demo.verificationOutcome;
    if (outcome === 'FAILED') {
      this.setVerification({ state: 'FAILED', resolveAt: undefined });
      return outcome;
    }
    const hostId = this.state.activeHostId;
    this.update((state) => ({
      ...state,
      verification: { ...state.verification, state: 'VERIFIED', resolveAt: undefined },
      hosts: state.hosts.map((item) => (item.id === hostId && item.tier === 'REGISTERED' ? { ...item, tier: 'IDENTITY' } : item)),
      offerings: state.offerings.map((item) =>
        item.hostId === hostId && item.status === 'DRAFT' && item.statusReason === HOST_COPY.create.needsIdReason
          ? this.withGoLiveStatus({ ...item, statusReason: undefined }, 'IDENTITY')
          : item,
      ),
    }));
    return outcome;
  }

  retryVerification(): void {
    this.setVerification({ state: 'IDLE', documentPhotoKey: undefined, selfieKey: undefined, resolveAt: undefined });
  }

  submitCommunityProof(type: CommunityProofType, value: string): void {
    this.enqueue('PATCH', '/hosts/me', { communityProof: { type, value } });
    this.patchHost({ communityProof: { type, value: value.trim(), submittedAt: now() } });
  }

  // Drafts

  startDraft(kind: OfferingKind): void {
    const existing = this.state.drafts[NEW_DRAFT_KEY];
    if (existing?.fields.kind === kind) return;
    const draft: OfferingDraft = { key: NEW_DRAFT_KEY, source: 'voice', drafted: false, fields: emptyFields(kind, this.host.language), updatedAt: now() };
    this.update((state) => ({ ...state, drafts: { ...state.drafts, [NEW_DRAFT_KEY]: draft } }));
  }

  patchDraft(key: string, patch: Partial<Omit<OfferingDraft, 'fields' | 'key'>>): void {
    const draft = this.state.drafts[key];
    if (!draft) return;
    this.update((state) => ({ ...state, drafts: { ...state.drafts, [key]: { ...draft, ...patch, updatedAt: now() } } }));
  }

  patchDraftFields(key: string, patch: Partial<OfferingFields>): void {
    const draft = this.state.drafts[key];
    if (!draft) return;
    this.update((state) => ({ ...state, drafts: { ...state.drafts, [key]: { ...draft, fields: { ...draft.fields, ...patch }, updatedAt: now() } } }));
  }

  async saveVoiceNote(key: string, recording: Blob, seconds: number): Promise<void> {
    const previous = this.state.drafts[key]?.fields.voiceNoteKey;
    const voiceNoteKey = `voice-${createId()}`;
    await hostAppStorage.putBlob(voiceNoteKey, recording);
    if (previous) void hostAppStorage.deleteBlob(previous);
    this.patchDraftFields(key, { voiceNoteKey, voiceNoteSeconds: seconds, transcript: undefined });
  }

  async addDraftPhoto(key: string, photo: Blob): Promise<void> {
    const photoKey = `photo-${createId()}`;
    await hostAppStorage.putBlob(photoKey, photo);
    const draft = this.state.drafts[key];
    if (draft) this.patchDraftFields(key, { photos: [...draft.fields.photos, { key: photoKey, bytes: photo.size }] });
  }

  removeDraftPhoto(key: string, photoKey: string): void {
    const draft = this.state.drafts[key];
    if (!draft) return;
    void hostAppStorage.deleteBlob(photoKey);
    this.patchDraftFields(key, { photos: draft.fields.photos.filter((photo) => photo.key !== photoKey) });
  }

  /** Fills the draft from the cached AI result for this kind. See listing-samples.constant.ts. */
  applyDraftedListing(key: string): void {
    const draft = this.state.drafts[key];
    if (!draft) return;
    this.patchDraftFields(key, LISTING_SAMPLES[draft.fields.kind].fields);
    this.patchDraft(key, { drafted: true });
  }

  discardDraft(key: string): void {
    this.update((state) => ({ ...state, drafts: Object.fromEntries(Object.entries(state.drafts).filter(([draftKey]) => draftKey !== key)) }));
  }

  beginEdit(offeringId: string): void {
    const offering = this.state.offerings.find((item) => item.id === offeringId);
    if (!offering || this.state.drafts[offeringId]) return;
    const draft: OfferingDraft = { key: offeringId, source: 'edit', offeringId, drafted: true, fields: pickFields(offering), updatedAt: now() };
    this.update((state) => ({ ...state, drafts: { ...state.drafts, [offeringId]: draft } }));
  }

  saveEdit(offeringId: string): void {
    const draft = this.state.drafts[offeringId];
    const existing = this.state.offerings.find((item) => item.id === offeringId);
    if (!draft || !existing) return;
    const category = kindOption(draft.fields.kind).category;
    const merged: Offering = { ...existing, ...draft.fields, category };
    const pendingSync = this.enqueue('PATCH', `/offerings/${offeringId}`, toOfferingPayload(merged), (data) => this.applyOfferingStatus(offeringId, data));
    this.patchOffering(offeringId, { ...draft.fields, category, pendingSync });
    this.discardDraft(offeringId);
  }

  /** PRD: Tier 0 drafts but cannot go live; transport needs its credential at Tier 2 before going live. */
  private withGoLiveStatus(offering: Offering, tier: Host['tier']): Offering {
    if (tier === 'REGISTERED') return { ...offering, status: 'DRAFT', statusReason: HOST_COPY.create.needsIdReason };
    if (offering.kind === 'transport' && tier !== 'COMMUNITY') return { ...offering, status: 'IN_REVIEW', statusReason: HOST_COPY.create.needsLicenceReason };
    return { ...offering, status: 'LIVE', statusReason: undefined };
  }

  publishDraft(): PublishResult | undefined {
    const draft = this.state.drafts[NEW_DRAFT_KEY];
    if (!draft || missingDraftFields(draft.fields).length > 0) return undefined;
    const host = this.host;
    const created = now();
    const base: Offering = {
      ...draft.fields,
      id: createId(),
      hostId: host.id,
      category: kindOption(draft.fields.kind).category,
      sourceLanguage: host.language,
      status: 'DRAFT',
      views: 0,
      pendingSync: false,
      createdAt: created,
      updatedAt: created,
    };
    const pendingSync = this.enqueue('POST', '/offerings', { id: base.id, ...toOfferingPayload(base) }, (data) => this.applyOfferingStatus(base.id, data));
    const offering = { ...this.withGoLiveStatus(base, host.tier), pendingSync };
    const outcome: PublishResult['outcome'] =
      offering.status === 'DRAFT' ? 'NEEDS_ID' : offering.status === 'IN_REVIEW' ? 'NEEDS_LICENCE' : pendingSync ? 'WAITING_TO_UPLOAD' : 'LIVE';
    const result: PublishResult = { offeringId: offering.id, outcome };
    // Registration never captures an area; the traveller listing detail shows the host's town, so the first publish backfills it.
    if (!host.town) this.enqueue('PATCH', '/hosts/me', { serviceArea: draft.fields.town });
    this.update((state) => ({
      ...state,
      offerings: [offering, ...state.offerings],
      hosts: state.hosts.map((item) =>
        item.id === host.id ? { ...item, town: item.town || draft.fields.town, region: item.region || draft.fields.region } : item,
      ),
      lastPublished: result,
    }));
    // The draft stays until PublishedPage discards it on mount: discarding here races useRequireDraft's
    // own redirect on this screen and sends the host back to category before Published ever renders.
    return result;
  }

  // Offerings

  setOfferingPaused(id: string, paused: boolean): void {
    const status = paused ? 'PAUSED' : 'LIVE';
    const pendingSync = this.enqueue('PATCH', `/offerings/${id}`, { status }, (data) => this.applyOfferingStatus(id, data));
    this.patchOffering(id, { status, pendingSync });
  }

  duplicateOffering(sourceId: string): string | undefined {
    const source = this.state.offerings.find((item) => item.id === sourceId);
    if (!source) return undefined;
    const id = createId();
    const created = now();
    const base: Offering = { ...source, id, status: 'DRAFT', statusReason: undefined, views: 0, createdAt: created, updatedAt: created, pendingSync: false };
    const pendingSync = this.enqueue('POST', '/offerings', { id, ...toOfferingPayload(base) }, (data) => this.applyOfferingStatus(id, data));
    this.update((state) => ({ ...state, offerings: [{ ...base, pendingSync }, ...state.offerings] }));
    return id;
  }

  deleteOffering(id: string): void {
    this.enqueue('DELETE', `/offerings/${id}`);
    this.update((state) => ({ ...state, offerings: state.offerings.filter((item) => item.id !== id) }));
    this.discardDraft(id);
  }

  // Bookings

  acceptBooking(id: string): void {
    const pendingSync = this.enqueue('PATCH', `/hosts/me/bookings/${id}`, { status: 'CONFIRMED' }, (data) => this.applyBookingStatus(id, data));
    this.patchBooking(id, { status: 'CONFIRMED', pendingSync });
  }

  /** The reason is host-side only — the server's PATCH schema only accepts `status` — so it's kept in local state and never sent. */
  declineBooking(id: string, reason: ResponseReason): void {
    const pendingSync = this.enqueue('PATCH', `/hosts/me/bookings/${id}`, { status: 'DECLINED' }, (data) => this.applyBookingStatus(id, data));
    this.patchBooking(id, { status: 'DECLINED', responseReason: reason, pendingSync });
  }

  cancelBooking(id: string, reason: ResponseReason): void {
    // TODO: the /api/v1 table has accept, decline and complete but no host cancel yet.
    this.patchBooking(id, { status: 'CANCELLED', responseReason: reason, pendingSync: this.enqueue('POST', `/bookings/${id}/cancel`, { reason }) });
  }

  completeBooking(id: string): Payout | undefined {
    const booking = this.state.bookings.find((item) => item.id === id);
    if (!booking) return undefined;
    const host = this.host;
    const payout: Payout = {
      id: createId(),
      bookingId: id,
      hostId: host.id,
      amountCents: booking.hostReceivesCents || hostReceivesCents(booking.totalCents),
      channel: host.payoutChannel,
      destination: this.payoutDestination(host),
      status: 'PENDING',
      expectedBy: inMs((host.tier === 'COMMUNITY' ? 0 : PAYOUT_WINDOW_HOURS) * MS_PER_HOUR),
      autoSendAt: inMs(DEMO_PAYOUT_DELAY_MS),
    };
    // TODO: no POST /hosts/me/bookings/:id/complete endpoint yet — this enqueue 404s and drops; the payout above stays local-only until it exists.
    const pendingSync = this.enqueue('POST', `/bookings/${id}/complete`);
    this.update((state) => ({
      ...state,
      bookings: state.bookings.map((item) => (item.id === id ? { ...item, status: 'COMPLETED', pendingSync } : item)),
      payouts: [payout, ...state.payouts],
    }));
    return payout;
  }

  private payoutDestination(host: Host): string {
    const { payoutChannel, payoutDetails } = host;
    if (payoutChannel === 'BANK') return `${payoutDetails.bankName ?? ''} ***${payoutDetails.accountNumber?.slice(-4) ?? ''}`.trim();
    if (payoutChannel === 'CASH_PICKUP') return payoutDetails.pickupShop ?? '';
    return maskPhone(payoutDetails.phone ?? host.phone);
  }

  /** Demo only: stands in for the payout provider confirming the send. */
  markPayoutSent(id: string): void {
    this.update((state) => ({
      ...state,
      payouts: state.payouts.map((item) => (item.id === id ? { ...item, status: 'SENT', sentAt: now(), autoSendAt: undefined } : item)),
    }));
  }

  // Host settings

  setPayoutMethod(channel: PayoutChannel, details: PayoutDetails): void {
    this.enqueue('PATCH', '/hosts/me', { payoutChannel: channel });
    this.patchHost({ payoutChannel: channel, payoutDetails: { ...this.host.payoutDetails, ...details } });
  }

  setHostLanguage(language: LanguageCode): void {
    this.enqueue('PATCH', '/hosts/me', { language });
    this.patchHost({ language });
  }

  setContactChannel(contactChannel: ContactChannel): void {
    this.enqueue('PATCH', '/hosts/me', { contactChannel });
    this.patchHost({ contactChannel });
  }

  setNotification(channel: ContactChannel, on: boolean): void {
    this.patchHost({ notifications: { ...this.host.notifications, [channel]: on } });
  }

  // Demo controls, used by /flows only

  switchPersona(hostId: string): void {
    this.update((state) => ({ ...state, activeHostId: hostId, verification: { state: 'IDLE' }, lastPublished: undefined }));
  }

  setVerificationOutcome(verificationOutcome: VerificationOutcome): void {
    this.update((state) => ({ ...state, demo: { verificationOutcome } }));
  }

  /** Shared by resetDemo and signOut: wipe the local snapshot and start over from a fresh seed. */
  private async resetToSeed(): Promise<void> {
    await hostAppStorage.clear();
    this.update(() => createSeedState(new Date()));
  }

  async resetDemo(): Promise<void> {
    await this.resetToSeed();
  }

  /**
   * Tries to flush unsynced host work first, but neither wait below gates the session DELETE: F4
   * bounds every `hostApiService.request` to HOST_API_TIMEOUT_MS (host-api.service.ts), so a stalled
   * network can no longer hang this method and hold the `host_session` cookie (and the session) alive
   * on a shared phone — it now just fails the wait within that bound and sign-out proceeds regardless.
   * The DELETE itself is idempotent, so sending it whether or not the flush succeeded is safe. Local
   * data is still only wiped once the server has actually expired the cookie (`response.ok`) —
   * otherwise a shared phone would keep a live session after "signing out" offline — so `OFFLINE` now
   * means only that the DELETE itself failed (network down, or timed out), not that the outbox was
   * still pending. Only the signed-in host's own entries are attempted (F4): a dormant entry left
   * behind by an earlier host switch (see switchActiveHost) is never this host's to wait on.
   */
  async signOut(): Promise<'SIGNED_OUT' | 'OFFLINE'> {
    const activeHostId = this.state.activeHostId;
    // Writes `enqueue` sent straight at the network (online path, never queued) are still in flight
    // the moment Sign out is tapped — e.g. completeRegistration's PATCH, moments before the done
    // screen's header renders the Sign out button. Wait for them too, or the session DELETE below can
    // land first and the write is lost or rejected under a session that's already gone.
    if (this.inFlightSends.size > 0) await Promise.allSettled(this.inFlightSends);
    const ownOutbox = this.state.outbox.filter((entry) => entry.hostId === activeHostId);
    if (ownOutbox.length > 0) await this.replayOutbox(ownOutbox);
    // Unconditional and idempotent: a failed or timed-out flush above no longer blocks this, so a
    // stalled network can only ever delay sign-out by HOST_API_TIMEOUT_MS per wait, never hang it.
    const response = await hostApiService.request('DELETE', `${API}/auth/host/session`);
    if (!response.ok) return 'OFFLINE';
    // F4/2: the session cookie is now gone, so any sync still in flight is answering for a host
    // who is no longer signed in — bump the generation so it discards its result.
    this.syncGeneration++;
    await this.resetToSeed();
    return 'SIGNED_OUT';
  }
}

export const hostAppStore = new HostAppStore();
