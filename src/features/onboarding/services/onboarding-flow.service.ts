import {
  ACTION_BEGIN,
  ACTION_CONFIRM,
  ACTION_REDO,
  DEMO_DATA_NOTICE,
  MIN_OFFERING_DESCRIPTION_LENGTH,
  RESTART_KEYWORDS,
} from '@/core/constants';
import { ConversationSession, Offering, WhatsAppInboundMessage } from '@/core/interfaces';
import { ConversationStore, WhatsAppService } from '@/core/services';
import { KYC_STEPS, SKIP_KEYWORD } from '../constants';
import { OfferingExtractionService } from './offering-extraction.service';
import { ProfileSubmissionService } from './profile-submission.service';

const CONFIRM_OPTIONS = [
  { id: ACTION_CONFIRM, title: "Yes, that's right" },
  { id: ACTION_REDO, title: 'Let me redo it' },
];

const OFFERINGS_PROMPT =
  'Now tell me what you do — in your own words, one message. Include your rates if you have them.\n\n' +
  '_Example: "I do plumbing and geyser installs around the southern suburbs, R450 an hour, and I quote separately on bathroom renovations."_';

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
      case 'welcome':
        return this.onWelcome(session, buttonId);
      case 'kyc':
        return this.onKycStep(session, text, imageMediaId);
      case 'kyc_review':
        return this.onKycReview(session, buttonId);
      case 'offerings':
        return this.onOfferings(session, text);
      case 'offerings_review':
        return this.onOfferingsReview(session, buttonId);
      default:
        return this.whatsapp.sendText(
          session.waId,
          'You are all signed up. Send *restart* if you want to register another profile.',
        );
    }
  }

  private async onWelcome(session: ConversationSession, buttonId?: string): Promise<void> {
    if (buttonId !== ACTION_BEGIN) {
      const greeting = session.displayName ? `Hi ${session.displayName}! ` : 'Hi! ';
      await this.whatsapp.sendButtons(
        session.waId,
        `${greeting}I sign service providers up to the marketplace. It takes about two minutes: a few ID details, then tell me what you do.\n\n_${DEMO_DATA_NOTICE}_`,
        [{ id: ACTION_BEGIN, title: 'Get started' }],
      );
      return;
    }

    await this.store.save({ ...session, stage: 'kyc', stepIndex: 0 });
    await this.whatsapp.sendText(session.waId, KYC_STEPS[0].prompt);
  }

  private async onKycStep(session: ConversationSession, text: string, imageMediaId?: string): Promise<void> {
    const step = KYC_STEPS[session.stepIndex];
    const kyc = { ...session.kyc };

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
      Object.assign(kyc, { [step.field]: result.value }, step.derive?.(result.value));
    }

    const stepIndex = session.stepIndex + 1;
    const next = KYC_STEPS[stepIndex];

    if (next) {
      await this.store.save({ ...session, kyc, stepIndex });
      await this.whatsapp.sendText(session.waId, next.prompt);
      return;
    }

    const reviewed = { ...session, kyc, stepIndex, stage: 'kyc_review' as const };
    await this.store.save(reviewed);
    await this.whatsapp.sendButtons(session.waId, this.summariseKyc(reviewed), CONFIRM_OPTIONS);
  }

  private async onKycReview(session: ConversationSession, buttonId?: string): Promise<void> {
    if (buttonId === ACTION_REDO) {
      await this.store.save({ ...session, stage: 'kyc', stepIndex: 0, kyc: {} });
      await this.whatsapp.sendText(session.waId, `No problem, let's start those again.\n\n${KYC_STEPS[0].prompt}`);
      return;
    }

    if (buttonId !== ACTION_CONFIRM) {
      await this.whatsapp.sendButtons(session.waId, this.summariseKyc(session), CONFIRM_OPTIONS);
      return;
    }

    await this.store.save({ ...session, stage: 'offerings' });
    await this.whatsapp.sendText(session.waId, `Verified. ✅\n\n${OFFERINGS_PROMPT}`);
  }

  private async onOfferings(session: ConversationSession, text: string): Promise<void> {
    if (text.length < MIN_OFFERING_DESCRIPTION_LENGTH) {
      await this.whatsapp.sendText(session.waId, `Give me a bit more detail so I can set your listing up properly.\n\n${OFFERINGS_PROMPT}`);
      return;
    }

    await this.whatsapp.sendText(session.waId, 'Thanks — writing that up now, one moment…');

    try {
      const extracted = await this.extraction.extract(text);
      if (!extracted.offerings.length) {
        await this.whatsapp.sendText(session.waId, `I could not pick out any services there. Could you describe what you do again?\n\n${OFFERINGS_PROMPT}`);
        return;
      }

      const reviewed = { ...session, stage: 'offerings_review' as const, rawOfferingDescription: text, extracted };
      await this.store.save(reviewed);
      await this.whatsapp.sendButtons(session.waId, this.summariseOfferings(extracted.offerings, extracted.clarifications), CONFIRM_OPTIONS);
    } catch (error) {
      console.error(`[onboarding] Extraction failed for ${session.waId}`, error);
      await this.whatsapp.sendText(session.waId, 'Something went wrong writing that up. Please send your description again.');
    }
  }

  private async onOfferingsReview(session: ConversationSession, buttonId?: string): Promise<void> {
    if (buttonId === ACTION_REDO) {
      await this.store.save({ ...session, stage: 'offerings', extracted: undefined });
      await this.whatsapp.sendText(session.waId, OFFERINGS_PROMPT);
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
      const reference = await this.submission.submit(session);
      await this.store.save({ ...session, stage: 'done' });
      await this.whatsapp.sendText(
        session.waId,
        `You're listed. 🎉\n\nYour reference is *${reference}*. We'll be in touch when a customer requests one of your services.\n\nSend *restart* to register another provider.`,
      );
    } catch (error) {
      console.error(`[onboarding] Submission failed for ${session.waId}`, error);
      await this.store.save({ ...session, stage: 'offerings_review' });
      await this.whatsapp.sendButtons(session.waId, 'I could not reach the registry just then. Try again?', CONFIRM_OPTIONS);
    }
  }

  private summariseKyc(session: ConversationSession): string {
    const { kyc } = session;
    const lines = KYC_STEPS.map(({ field, label }) => {
      const value = kyc[field];
      if (field === 'idDocumentMediaId') return `*${label}:* ${value ? 'received' : 'skipped'}`;
      return `*${label}:* ${value ?? '—'}`;
    });
    return [`Let me read that back:`, '', ...lines, `*Date of birth:* ${kyc.dateOfBirth ?? '—'}`, '', 'Is this correct?'].join('\n');
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
