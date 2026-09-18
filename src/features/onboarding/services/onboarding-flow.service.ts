import {
  ACTION_BEGIN,
  ACTION_CONFIRM,
  ACTION_REDO,
  DEMO_DATA_NOTICE,
  MAGIC_LINK_TTL_MINUTES,
  MAX_REPLY_BUTTONS,
  MIN_OFFERING_DESCRIPTION_LENGTH,
  RESTART_KEYWORDS,
} from '@/core/constants';
import { issueHostLink } from '@/features/auth/services';
import { ConversationSession, Offering, WhatsAppInboundMessage } from '@/core/interfaces';
import { ConversationStore, WhatsAppService } from '@/core/services';
import { prisma } from '@/core/services';
import { firstName, toE164 } from '@/shared/utils';
import { KYC_STEPS, OFFERING_DESCRIBE_PROMPT, SKIP_KEYWORD } from '../constants';
import { OfferingExtractionService } from './offering-extraction.service';
import { ProfileSubmissionService } from './profile-submission.service';

const CONFIRM_OPTIONS = [
  { id: ACTION_CONFIRM, title: 'Yes, that is right' },
  { id: ACTION_REDO, title: 'Let me redo it' },
];

const LOGIN_ACTION = 'login';

export class OnboardingFlowService {
  constructor(
    private readonly whatsapp: WhatsAppService,
    private readonly store: ConversationStore,
    private readonly extraction: OfferingExtractionService,
    private readonly submission: ProfileSubmissionService,
  ) {}

  async handle(message: WhatsAppInboundMessage, displayName?: string): Promise<void> {
    const text = message.text?.body?.trim() ?? '';
    const buttonId = message.interactive?.button_reply?.id ?? message.interactive?.list_reply?.id;
    const imageMediaId = message.image?.id;

    const session = RESTART_KEYWORDS.includes(text.toLowerCase())
      ? await this.store.reset(message.from)
      : await this.store.get(message.from, displayName);

    switch (session.stage) {
      case 'identify':
        return this.onIdentify(session);
      case 'returning':
        return this.onReturning(session, buttonId);
      case 'welcome':
        return this.onWelcome(session, buttonId);
      case 'kyc':
        return this.onKycStep(session, text, imageMediaId, buttonId);
      case 'kyc_review':
        return this.onKycReview(session, buttonId);
      case 'offerings':
        return this.onOfferings(session, text);
      case 'offerings_review':
        return this.onOfferingsReview(session, buttonId);
      default:
        return this.whatsapp.sendText(
          session.waId,
          'You are all set up. Send *restart* if you want to list someone else.',
        );
    }
  }


  /**
   * Every conversation starts here. A host who has been onboarded already is offered a way back
   * in rather than a second account, because the number they are messaging from is their identity.
   */
  private async onIdentify(session: ConversationSession): Promise<void> {
    const phone = toE164(session.waId);
    const existing = phone ? await prisma.host.findUnique({ where: { phone } }) : null;

    if (existing) {
      await this.store.save({ ...session, stage: 'returning' });
      await this.whatsapp.sendButtons(
        session.waId,
        `You already have an account, ${firstName(existing.fullName)}.\n\nWant to open your listings?`,
        [{ id: LOGIN_ACTION, title: 'Log me in' }],
      );
      return;
    }

    await this.store.save({ ...session, stage: 'welcome' });
    await this.onWelcome({ ...session, stage: 'welcome' });
  }

  private async onReturning(session: ConversationSession, buttonId?: string): Promise<void> {
    if (buttonId !== LOGIN_ACTION) {
      await this.whatsapp.sendButtons(session.waId, 'Want to open your listings?', [
        { id: LOGIN_ACTION, title: 'Log me in' },
      ]);
      return;
    }

    const phone = toE164(session.waId);
    const existing = phone ? await prisma.host.findUnique({ where: { phone } }) : null;
    if (!existing) {
      await this.store.save({ ...session, stage: 'identify' });
      return this.onIdentify({ ...session, stage: 'identify' });
    }

    await this.whatsapp.sendText(
      session.waId,
      `Here is your way in:\n${issueHostLink(existing.id)}\n\nThe link works once, for the next ${MAGIC_LINK_TTL_MINUTES} minutes.`,
    );
  }

  /** A question with answers is sent as buttons, or a list when there are more than WhatsApp allows. */
  private async ask(waId: string, step: { prompt: string; helper?: string; choices?: readonly { id: string; title: string; description?: string }[] }): Promise<void> {
    const body = step.helper ? `${step.prompt}\n\n_${step.helper}_` : step.prompt;
    if (!step.choices?.length) return this.whatsapp.sendText(waId, body);

    return step.choices.length <= MAX_REPLY_BUTTONS
      ? this.whatsapp.sendButtons(waId, body, [...step.choices])
      : this.whatsapp.sendList(waId, body, 'Choose', [...step.choices]);
  }

  private async onWelcome(session: ConversationSession, buttonId?: string): Promise<void> {
    if (buttonId !== ACTION_BEGIN) {
      const greeting = session.displayName ? `Hi ${session.displayName}! ` : 'Hi! ';
      await this.whatsapp.sendButtons(
        session.waId,
        `${greeting}This is Hosted. We put local guides, drivers and home cooks in front of travellers. You get booked, and you get paid to your phone.\n\n` +
          'It takes about two minutes. A few details about you, then tell us what you offer.\n\n' +
          `_${DEMO_DATA_NOTICE}_`,
        [{ id: ACTION_BEGIN, title: 'Get started' }],
      );
      return;
    }

    await this.store.save({ ...session, stage: 'kyc', stepIndex: 0 });
    await this.ask(session.waId, KYC_STEPS[0]);
  }

  private async onKycStep(
    session: ConversationSession,
    text: string,
    imageMediaId?: string,
    buttonId?: string,
  ): Promise<void> {
    const step = KYC_STEPS[session.stepIndex];
    const kyc = { ...session.kyc };

    if (step.choices) {
      const chosen = step.choices.find(({ id }) => id === buttonId);
      if (!chosen) {
        await this.ask(session.waId, step);
        return;
      }
      kyc[step.field] = chosen.id;
      return this.advance(session, kyc);
    }

    if (step.expectsImage) {
      const skipped = step.skippable && text.toLowerCase() === SKIP_KEYWORD;
      if (!imageMediaId && !skipped) {
        await this.whatsapp.sendText(session.waId, `Please send a photo, or reply ${SKIP_KEYWORD.toUpperCase()}. ${step.prompt}`);
        return;
      }
      kyc[step.field] = imageMediaId;
    } else {
      const result = step.parse!(text);
      if (!result.ok) {
        await this.whatsapp.sendText(session.waId, result.error);
        return;
      }
      kyc[step.field] = result.value;
    }

    return this.advance(session, kyc);
  }

  private async advance(session: ConversationSession, kyc: ConversationSession['kyc']): Promise<void> {
    const stepIndex = session.stepIndex + 1;
    const next = KYC_STEPS[stepIndex];

    if (next) {
      await this.store.save({ ...session, kyc, stepIndex });
      await this.ask(session.waId, next);
      return;
    }

    const reviewed = { ...session, kyc, stepIndex, stage: 'kyc_review' as const };
    await this.store.save(reviewed);
    await this.whatsapp.sendButtons(session.waId, this.summariseKyc(reviewed), CONFIRM_OPTIONS);
  }

  private async onKycReview(session: ConversationSession, buttonId?: string): Promise<void> {
    if (buttonId === ACTION_REDO) {
      await this.store.save({ ...session, stage: 'kyc', stepIndex: 0, kyc: {} });
      await this.whatsapp.sendText(session.waId, 'No problem. Let us start again.');
      await this.ask(session.waId, KYC_STEPS[0]);
      return;
    }

    if (buttonId !== ACTION_CONFIRM) {
      await this.whatsapp.sendButtons(session.waId, this.summariseKyc(session), CONFIRM_OPTIONS);
      return;
    }

    await this.store.save({ ...session, stage: 'offerings' });
    await this.whatsapp.sendText(session.waId, `Thank you. We will check your ID and tell you. ✅\n\n${OFFERING_DESCRIBE_PROMPT}`);
  }

  private async onOfferings(session: ConversationSession, text: string): Promise<void> {
    if (text.length < MIN_OFFERING_DESCRIPTION_LENGTH) {
      await this.whatsapp.sendText(session.waId, `Tell us a little more so we can write your listing properly.\n\n${OFFERING_DESCRIBE_PROMPT}`);
      return;
    }

    await this.whatsapp.sendText(session.waId, 'Thank you. We are writing down what you said…');

    try {
      const extracted = await this.extraction.extract(text);
      if (!extracted.offerings.length) {
        await this.whatsapp.sendText(session.waId, `We could not work out what you offer from that. Say it again in your own words.\n\n${OFFERING_DESCRIBE_PROMPT}`);
        return;
      }

      const reviewed = { ...session, stage: 'offerings_review' as const, rawOfferingDescription: text, extracted };
      await this.store.save(reviewed);
      await this.whatsapp.sendButtons(session.waId, this.summariseOfferings(extracted.offerings, extracted.clarifications), CONFIRM_OPTIONS);
    } catch (error) {
      console.error(`[onboarding] Extraction failed for ${session.waId}`, error);
      await this.whatsapp.sendText(session.waId, 'Something went wrong on our side. Send your description again.');
    }
  }

  private async onOfferingsReview(session: ConversationSession, buttonId?: string): Promise<void> {
    if (buttonId === ACTION_REDO) {
      await this.store.save({ ...session, stage: 'offerings', extracted: undefined });
      await this.whatsapp.sendText(session.waId, OFFERING_DESCRIBE_PROMPT);
      return;
    }

    if (buttonId !== ACTION_CONFIRM) {
      await this.whatsapp.sendButtons(
        session.waId,
        this.summariseOfferings(session.extracted!.offerings, session.extracted!.clarifications),
        CONFIRM_OPTIONS,
      );
      return;
    }

    await this.store.save({ ...session, stage: 'submitting' });

    try {
      const hostId = await this.submission.submit(session);
      await this.store.save({ ...session, stage: 'done' });
      await this.whatsapp.sendText(
        session.waId,
        `You are in. 🎉 Travellers can find you now.\n\nOpen your listings here:\n${issueHostLink(hostId)}\n\n` +
          `The link signs you in for ${MAGIC_LINK_TTL_MINUTES} minutes. Send *restart* to list someone else.`,
      );
    } catch (error) {
      console.error(`[onboarding] Submission failed for ${session.waId}`, error);
      await this.store.save({ ...session, stage: 'offerings_review' });
      await this.whatsapp.sendButtons(session.waId, 'We could not save that just now. Try again?', CONFIRM_OPTIONS);
    }
  }

  private summariseKyc(session: ConversationSession): string {
    const { kyc } = session;
    const lines = KYC_STEPS.map(({ field, label }) => {
      const value = kyc[field];
      if (field.endsWith('MediaId')) return `*${label}:* ${value ? 'received' : 'skipped'}`;
      return `*${label}:* ${value ?? '—'}`;
    });
    return [`Let me read that back:`, '', ...lines, '', 'Is this correct?'].join('\n');
  }

  private summariseOfferings(offerings: Offering[], clarifications: string[]): string {
    const priced = ({ pricingModel, rateAmount, currency }: Offering): string =>
      rateAmount === null
        ? 'quoted per job'
        : `${currency} ${rateAmount}${pricingModel === 'hourly' ? '/hour' : ' fixed'}`;

    const listed = offerings.map(
      (offering, index) => `${index + 1}. *${offering.title}* (${offering.category}) — ${priced(offering)}\n   ${offering.description}`,
    );

    return [
      `Here is your listing — ${offerings.length} service${offerings.length === 1 ? '' : 's'}:`,
      '',
      ...listed,
      ...(clarifications.length ? ['', `_Worth adding later: ${clarifications.join(' ')}_`] : []),
      '',
      'Shall I publish this?',
    ].join('\n');
  }
}
