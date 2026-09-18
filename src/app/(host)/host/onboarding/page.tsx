import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/core/constants';
import { requireHostPage } from '@/core/guards';
import { isHostOnboarded, issueHostSession } from '@/core/services';
import { OnboardingAnswerState, OnboardingQuestionForm } from '@/features/onboarding/components';
import {
  HOST_ONBOARDING_QUESTIONS,
  HostOnboardingQuestion,
  ONBOARDING_ANSWER_FIELD,
  ONBOARDING_STEP_PARAM,
  ONBOARDING_TOTAL_STEPS,
} from '@/features/onboarding/constants';
import {
  findOnboardingQuestion,
  nextOnboardingQuestion,
  onboardingAnswer,
  saveOnboardingAnswer,
} from '@/features/onboarding/services';

const questionAt = (index: number): HostOnboardingQuestion | undefined =>
  index >= 0 ? HOST_ONBOARDING_QUESTIONS[index] : undefined;

const stepHref = ({ field }: HostOnboardingQuestion): string =>
  `${ROUTES.hostOnboarding}?${ONBOARDING_STEP_PARAM}=${field}`;

async function saveAnswer(
  field: string,
  _state: OnboardingAnswerState,
  formData: FormData,
): Promise<OnboardingAnswerState> {
  'use server';

  const host = await requireHostPage();
  const question = findOnboardingQuestion(field);
  if (!question) redirect(ROUTES.hostOnboarding);

  const answer = String(formData.get(ONBOARDING_ANSWER_FIELD) ?? '');
  const saved = await saveOnboardingAnswer(host.id, question.field, answer);
  if (!saved.ok) return { error: saved.error };

  // middleware.ts gates on the onboarding claim inside the signed cookie, so the last answer
  // has to re-issue it. Without this the host is redirected back here for the rest of the session.
  if (isHostOnboarded(saved.host)) await issueHostSession(saved.host.id, { onboarded: true });

  const next = questionAt(HOST_ONBOARDING_QUESTIONS.indexOf(question) + 1);

  redirect(next ? stepHref(next) : ROUTES.hostOnboarding);
}

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex flex-1 gap-1">
        {Array.from({ length: ONBOARDING_TOTAL_STEPS }, (_, index) => (
          <span key={index} className={`h-1 flex-1 rounded-full ${index < step ? 'bg-primary' : 'bg-hairline'}`} />
        ))}
      </span>
      <span className="text-caption text-muted">
        Step {step} of {ONBOARDING_TOTAL_STEPS}
      </span>
    </div>
  );
}

export default async function HostOnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const host = await requireHostPage();
  const requested = (await searchParams)[ONBOARDING_STEP_PARAM];
  const question =
    findOnboardingQuestion(typeof requested === 'string' ? requested : undefined) ?? nextOnboardingQuestion(host);

  // The last step is the first offering, which is Marlon's voice-first create flow.
  // TODO(Marlon): point this at the recorder once /host/listings can create one.
  if (!question) {
    return (
      <>
        <StepIndicator step={ONBOARDING_TOTAL_STEPS} />
        <section className="flex flex-1 flex-col gap-3">
          <h1 className="font-display text-display-lg text-ink">Your first offering</h1>
          <p className="text-body-host text-muted">
            Your details are saved. The last step is telling travellers what you offer.
          </p>
          <Link
            href={ROUTES.hostListings}
            className="mt-auto flex h-14 items-center justify-center rounded-full bg-primary text-button-lg text-on-primary"
          >
            Add my first offering
          </Link>
          <Link
            href={ROUTES.host}
            className="flex h-14 items-center justify-center rounded-full border border-ink text-button-lg text-ink"
          >
            I will do this later
          </Link>
        </section>
      </>
    );
  }

  const index = HOST_ONBOARDING_QUESTIONS.indexOf(question);
  const previous = questionAt(index - 1);

  return (
    <>
      <StepIndicator step={index + 1} />
      {previous && (
        <Link href={stepHref(previous)} className="text-link text-primary-text underline">
          Back
        </Link>
      )}
      <OnboardingQuestionForm
        question={question}
        answer={onboardingAnswer(host, question.field)}
        submit={saveAnswer.bind(null, question.field)}
      />
    </>
  );
}
