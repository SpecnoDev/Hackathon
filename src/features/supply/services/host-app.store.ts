import { connectivityService } from '@/core/services/client';
import { hostReceivesCents, maskPhone, toE164 } from '@/shared/utils';
import {
  DEMO_PAYOUT_DELAY_MS,
  DEMO_REJECTED_OTP,
  DEMO_VERIFICATION_DELAY_MS,
  GROUP_SIZE_MIN,
  HOST_APP_SCHEMA_VERSION,
  HOST_COPY,
  LISTING_SAMPLES,
  MS_PER_HOUR,
  NEW_DRAFT_KEY,
  PAYOUT_WINDOW_HOURS,
  TITLE_MIN_LENGTH,
  createSeedState,
  kindOption,
} from '../constants';
import type {
  Booking,
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
  OutboxEntry,
  Payout,
  PayoutChannel,
  PayoutDetails,
  PublishResult,
  RegistrationProgress,
  ResponseReason,
  VerificationOutcome,
  VerificationProgress,
} from '../interfaces';
import { createId } from '../utils';
import { hostAppStorage } from './host-app-storage.service';

type Listener = () => void;

const SAVE_DEBOUNCE_MS = 150;
const DEFAULT_GROUP_MAX = 4;
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
  languages: language === 'EN' ? ['EN'] : [language, 'EN'],
  photos: [],
  availability: { type: 'ON_REQUEST', dates: [], weekdays: [] },
  details: {},
});

/** The listing content of an offering, without its identity, status or counters. */
const pickFields = (offering: Offering): OfferingFields => {
  const { id, hostId, category, region, sourceLanguage, status, statusReason, views, pendingSync, createdAt, updatedAt, ...fields } = offering;
  return fields;
};

/** What a listing needs before a traveller could book it. Photos are encouraged, not required. */
export const missingDraftFields = (fields: OfferingFields): Array<'title' | 'description' | 'duration' | 'price' | 'meetingPoint'> => [
  ...(fields.title.trim().length < TITLE_MIN_LENGTH ? (['title'] as const) : []),
  ...(fields.description.trim() ? [] : (['description'] as const)),
  ...(fields.durationMin > 0 ? [] : (['duration'] as const)),
  ...(fields.priceCents > 0 ? [] : (['price'] as const)),
  ...(fields.meetingPoint.trim() && fields.town.trim() ? [] : (['meetingPoint'] as const)),
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

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getState = (): HostAppState => this.state;
  getServerState = (): HostAppState => this.serverState;
  isReady = (): boolean => this.ready;

  hydrate(): Promise<void> {
    this.hydration ??= hostAppStorage.loadSnapshot().then((saved) => {
      if (saved?.schemaVersion === HOST_APP_SCHEMA_VERSION) this.state = saved;
      this.ready = true;
      this.emit();
    });
    return this.hydration;
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
   * Records a write in the shape docs/TECH_STACK.md gives the outbox. Online it is treated as delivered;
   * offline it waits. TODO: replace the online branch with a real fetch once /api/v1 exists.
   * Returns true when the write is still waiting to upload.
   */
  private enqueue(method: OutboxEntry['method'], path: string, body?: unknown): boolean {
    if (connectivityService.isOnline()) return false;
    this.update((state) => ({ ...state, outbox: [...state.outbox, { id: createId(), method, path: `${API}${path}`, body, attempts: 0 }] }));
    return true;
  }

  /** Called when signal returns. Returns how many writes were waiting. */
  flushOutbox(): number {
    const waiting = this.state.outbox.length;
    if (waiting === 0) return 0;
    this.update((state) => ({
      ...state,
      outbox: [],
      offerings: state.offerings.map((item) => ({ ...item, pendingSync: false })),
      bookings: state.bookings.map((item) => ({ ...item, pendingSync: false })),
      lastPublished: state.lastPublished?.outcome === 'WAITING_TO_UPLOAD' ? { ...state.lastPublished, outcome: 'LIVE' } : state.lastPublished,
    }));
    return waiting;
  }

  // Registration

  /** A fresh start from the landing page. */
  startRegistration(): void {
    this.update((state) => ({ ...state, registration: {} }));
  }

  answerRegistration(patch: Partial<RegistrationProgress>): void {
    this.update((state) => ({ ...state, registration: { ...state.registration, ...patch } }));
  }

  /** Saves the number and "sends" the OTP. Also used for Send again. */
  sendCode(phone: string): void {
    this.answerRegistration({ phone, codeSentAt: now(), codeConfirmed: undefined });
  }

  confirmCode(code: string): boolean {
    if (code === DEMO_REJECTED_OTP) return false;
    this.answerRegistration({ codeConfirmed: true });
    return true;
  }

  /** The last step. Creates the host and signs them in. */
  completeRegistration(contactChannel: ContactChannel): void {
    const { registration } = this.state;
    const phone = toE164(registration.phone ?? '') ?? '';
    const host: Host = {
      id: createId(),
      phone,
      firstName: (registration.firstName ?? '').trim(),
      language: registration.language ?? 'EN',
      contactChannel,
      notifications: { WHATSAPP: true, SMS: true, IN_APP: true },
      town: '',
      region: '',
      story: '',
      tier: 'REGISTERED',
      payoutChannel: 'CASH_SEND',
      payoutDetails: { phone },
    };
    this.enqueue('POST', '/hosts', { phone, fullName: host.firstName, language: host.language, contactChannel });
    this.update((state) => ({
      ...state,
      hosts: [...state.hosts, host],
      activeHostId: host.id,
      registration: { ...state.registration, contactChannel, completedAt: now() },
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
    // TODO: no verification endpoint in the /api/v1 table yet; this path is a placeholder for Henry to confirm.
    this.enqueue('POST', '/hosts/me/verification', { documentType: this.state.verification.documentType });
    this.setVerification({ state: 'CHECKING', resolveAt: inMs(DEMO_VERIFICATION_DELAY_MS) });
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
    if (!draft) return;
    const pendingSync = this.enqueue('PATCH', `/offerings/${offeringId}`, draft.fields);
    this.patchOffering(offeringId, { ...draft.fields, category: kindOption(draft.fields.kind).category, pendingSync });
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
      region: host.region,
      sourceLanguage: host.language,
      status: 'DRAFT',
      views: 0,
      pendingSync: false,
      createdAt: created,
      updatedAt: created,
    };
    const pendingSync = this.enqueue('POST', '/offerings', { id: base.id, ...draft.fields });
    const offering = { ...this.withGoLiveStatus(base, host.tier), pendingSync };
    const outcome: PublishResult['outcome'] =
      offering.status === 'DRAFT' ? 'NEEDS_ID' : offering.status === 'IN_REVIEW' ? 'NEEDS_LICENCE' : pendingSync ? 'WAITING_TO_UPLOAD' : 'LIVE';
    const result: PublishResult = { offeringId: offering.id, outcome };
    this.update((state) => ({
      ...state,
      offerings: [offering, ...state.offerings],
      hosts: state.hosts.map((item) => (item.id === host.id && !item.town ? { ...item, town: draft.fields.town } : item)),
      lastPublished: result,
    }));
    this.discardDraft(NEW_DRAFT_KEY);
    return result;
  }

  // Offerings

  setOfferingPaused(id: string, paused: boolean): void {
    const pendingSync = this.enqueue('PATCH', `/offerings/${id}`, { status: paused ? 'PAUSED' : 'LIVE' });
    this.patchOffering(id, { status: paused ? 'PAUSED' : 'LIVE', pendingSync });
  }

  duplicateOffering(sourceId: string): string | undefined {
    const source = this.state.offerings.find((item) => item.id === sourceId);
    if (!source) return undefined;
    const id = createId();
    const created = now();
    const pendingSync = this.enqueue('POST', '/offerings', { id, ...pickFields(source) });
    const copy: Offering = { ...source, id, status: 'DRAFT', statusReason: undefined, views: 0, createdAt: created, updatedAt: created, pendingSync };
    this.update((state) => ({ ...state, offerings: [copy, ...state.offerings] }));
    return id;
  }

  deleteOffering(id: string): void {
    // TODO: the /api/v1 table has no DELETE for offerings yet.
    this.enqueue('DELETE', `/offerings/${id}`);
    this.update((state) => ({ ...state, offerings: state.offerings.filter((item) => item.id !== id) }));
    this.discardDraft(id);
  }

  // Bookings

  acceptBooking(id: string): void {
    this.patchBooking(id, { status: 'CONFIRMED', pendingSync: this.enqueue('POST', `/bookings/${id}/accept`) });
  }

  declineBooking(id: string, reason: ResponseReason): void {
    this.patchBooking(id, { status: 'DECLINED', responseReason: reason, pendingSync: this.enqueue('POST', `/bookings/${id}/decline`, { reason }) });
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

  async resetDemo(): Promise<void> {
    await hostAppStorage.clear();
    this.update(() => createSeedState(new Date()));
  }
}

export const hostAppStore = new HostAppStore();
