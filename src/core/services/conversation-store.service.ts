import { Prisma } from '@prisma/client';
import { PROCESSED_MESSAGE_TTL_MS, SESSION_TTL_MS } from '../constants';
import { ConversationSession } from '../interfaces';
import { prisma } from './prisma.service';

export class ConversationStore {
  /** Returns false when this message id has already been handled (Meta retries webhooks). */
  async claimMessage(messageId: string): Promise<boolean> {
    await this.evictExpired();
    const { count } = await prisma.processedWebhookMessage.createMany({
      data: { id: messageId },
      skipDuplicates: true,
    });
    return count === 1;
  }

  async get(waId: string, displayName?: string): Promise<ConversationSession> {
    const stored = await prisma.conversationSession.findUnique({ where: { waId } });

    return stored
      ? (stored.state as unknown as ConversationSession)
      : { waId, stage: 'welcome', stepIndex: 0, displayName, kyc: {}, updatedAt: Date.now() };
  }

  async save(session: ConversationSession): Promise<void> {
    const state = { ...session, updatedAt: Date.now() } as unknown as Prisma.InputJsonObject;

    await prisma.conversationSession.upsert({
      where: { waId: session.waId },
      create: { waId: session.waId, state },
      update: { state },
    });
  }

  async reset(waId: string): Promise<ConversationSession> {
    await prisma.conversationSession.deleteMany({ where: { waId } });
    return this.get(waId);
  }

  private async evictExpired(): Promise<void> {
    const now = Date.now();

    await Promise.all([
      prisma.processedWebhookMessage.deleteMany({
        where: { receivedAt: { lt: new Date(now - PROCESSED_MESSAGE_TTL_MS) } },
      }),
      prisma.conversationSession.deleteMany({
        where: { updatedAt: { lt: new Date(now - SESSION_TTL_MS) } },
      }),
    ]);
  }
}

export const conversationStore = new ConversationStore();
