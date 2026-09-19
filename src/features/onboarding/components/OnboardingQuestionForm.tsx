'use client';

import { useActionState } from 'react';
import { HostOnboardingQuestion, ONBOARDING_ANSWER_FIELD } from '../constants';

export interface OnboardingAnswerState {
  readonly error?: string;
}

interface Props {
  readonly question: HostOnboardingQuestion;
  readonly answer: string;
  readonly submit: (state: OnboardingAnswerState, formData: FormData) => Promise<OnboardingAnswerState>;
}

export function OnboardingQuestionForm({ question, answer, submit }: Props) {
  const [state, action, pending] = useActionState(submit, {});

  return (
    <form action={action} className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-display-lg text-ink">{question.prompt}</h1>
        {question.helper && <p className="text-caption text-muted">{question.helper}</p>}
      </div>

      {question.options ? (
        <fieldset className="flex flex-col gap-3">
          <legend className="sr-only">{question.prompt}</legend>
          {question.options.map(({ value, label }) => (
            <label
              key={value}
              className="flex h-16 items-center gap-3 rounded-lg border-2 border-hairline px-4 text-title-lg has-[:checked]:border-primary has-[:checked]:bg-primary-tint"
            >
              <input
                type="radio"
                name={ONBOARDING_ANSWER_FIELD}
                value={value}
                defaultChecked={value === answer}
                className="peer sr-only"
              />
              <span className="flex-1">{label}</span>
              <span aria-hidden="true" className="text-primary-text opacity-0 peer-checked:opacity-100">
                ✓
              </span>
            </label>
          ))}
        </fieldset>
      ) : (
        <input
          name={ONBOARDING_ANSWER_FIELD}
          defaultValue={answer}
          aria-label={question.prompt}
          autoFocus
          className="h-14 rounded-md border border-hairline px-4 text-body-host text-ink focus:border-2 focus:border-ink focus:outline-none"
        />
      )}

      {state.error && (
        <p role="alert" className="rounded-md bg-error-tint px-4 py-3 text-caption text-error">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-auto h-14 w-full rounded-md bg-primary text-button-lg text-on-primary disabled:bg-primary-disabled"
      >
        {pending ? 'Saving…' : 'Continue'}
      </button>
    </form>
  );
}
