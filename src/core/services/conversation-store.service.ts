import { PROCESSED_MESSAGE_TTL_MS, SESSION_TTL_MS } from '../constants';
import { ConversationSession } from '../interfaces';

/**
 * In-memory only: state lives in this Node process. It survives `next dev` hot reloads
 * via the globalThis handle below, but NOT a restart, and NOT a serverless deployment
 * where each invocation may get a fresh process. Swap for Redis before either matters.
 */
export class ConversationStore {
  private readonly sessions = new Map<string, ConversationSession>();
  private readonly processed = new Map<string, number>();

  /** Returns false when this message id has already been handled (Meta retries webhooks). */
  claimMessage(messageId: string): boolean {
    this.evictExpired();
    if (this.processed.has(messageId)) return false;
    this.processed.set(messageId, Date.now());
    return true;
  }

  get(waId: string, displayName?: string): ConversationSession {
    const existing = this.sessions.get(waId);
    if (existing) return existing;

    const created: ConversationSession = {
      waId,
      stage: 'welcome',
      stepIndex: 0,
      displayName,
      kyc: {},
      updatedAt: Date.now(),
    };
    this.sessions.set(waId, created);
    return created;
  }

  save(session: ConversationSession): void {
    this.sessions.set(session.waId, { ...session, updatedAt: Date.now() });
  }

  reset(waId: string): ConversationSession {
    this.sessions.delete(waId);
    return this.get(waId);
  }

  private evictExpired(): void {
    const now = Date.now();
    for (const [id, at] of this.processed)
      if (now - at > PROCESSED_MESSAGE_TTL_MS) this.processed.delete(id);
    for (const [id, session] of this.sessions)
      if (now - session.updatedAt > SESSION_TTL_MS) this.sessions.delete(id);
  }
}

const globalScope = globalThis as { __conversationStore?: ConversationStore };

export const conversationStore = (globalScope.__conversationStore ??= new ConversationStore());
