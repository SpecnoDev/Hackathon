'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { OTP_CODE_LENGTH, ROUTES, withReturnTo } from '@/core/constants';
import { createSupabaseBrowserClient } from '@/core/services/client';
import { useToast } from '@/shared/components';

type Stage = 'email' | 'code';

const COPY = {
  emailLabel: 'Email address',
  emailHelper: 'We email you a code. No password to remember.',
  send: 'Send my code',
  sending: 'Sending…',
  codeLabel: 'Your code',
  codeHelper: (email: string) => `We sent ${OTP_CODE_LENGTH} numbers to ${email}.`,
  linkFallback: 'If your email has a button instead of numbers, tap that and you are signed in.',
  verify: 'Sign in',
  verifying: 'Checking…',
  change: 'Use a different email',
  failed: 'That did not work. Check it and try again.',
  codeSent: (email: string) => `Code sent to ${email}`,
};

export function EmailSignIn({ returnTo }: { returnTo: string | null }) {
  const router = useRouter();
  const toast = useToast();
  const [stage, setStage] = useState<Stage>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const run = async (event: FormEvent, action: () => Promise<{ error: { message: string } | null }>) => {
    event.preventDefault();
    setBusy(true);
    setError('');

    const { error: failure } = await action();
    setBusy(false);
    if (failure) return setError(failure.message || COPY.failed);

    if (stage === 'email') {
      toast(COPY.codeSent(email));
      return setStage('code');
    }
    router.replace(withReturnTo(ROUTES.loginComplete, returnTo));
  };

  return stage === 'email' ? (
    <form
      onSubmit={(event) =>
        run(event, () =>
          createSupabaseBrowserClient().auth.signInWithOtp({
            email,
            options: {
              emailRedirectTo: `${window.location.origin}${ROUTES.loginComplete}`,
            },
          }),
        )
      }
      className="mt-8"
    >
      <label htmlFor="email" className="block text-caption text-ink">
        {COPY.emailLabel}
      </label>
      <input
        id="email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="mt-2 h-14 w-full rounded-md border border-hairline bg-canvas px-4 text-body-md text-ink focus:border-2 focus:border-ink focus:outline-none"
      />
      <p className="mt-2 text-caption text-muted">{COPY.emailHelper}</p>
      {error && <p className="mt-2 text-caption text-error">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="mt-6 h-12 w-full rounded-md bg-primary text-button-md text-on-primary disabled:bg-primary-disabled"
      >
        {busy ? COPY.sending : COPY.send}
      </button>
    </form>
  ) : (
    <form
      onSubmit={(event) =>
        run(event, () =>
          createSupabaseBrowserClient().auth.verifyOtp({
            email,
            token: code,
            type: 'email',
          }),
        )
      }
      className="mt-8"
    >
      <label htmlFor="code" className="block text-caption text-ink">
        {COPY.codeLabel}
      </label>
      <input
        id="code"
        inputMode="numeric"
        autoComplete="one-time-code"
        required
        maxLength={OTP_CODE_LENGTH}
        value={code}
        onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))}
        className="mt-2 h-14 w-full rounded-md border border-hairline bg-canvas px-4 text-display-md tracking-[0.3em] text-ink focus:border-2 focus:border-ink focus:outline-none"
      />
      <p className="mt-2 text-caption text-muted">{COPY.codeHelper(email)}</p>
      <p className="mt-1 text-caption text-muted">{COPY.linkFallback}</p>
      {error && <p className="mt-2 text-caption text-error">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="mt-6 h-12 w-full rounded-md bg-primary text-button-md text-on-primary disabled:bg-primary-disabled"
      >
        {busy ? COPY.verifying : COPY.verify}
      </button>
      <button
        type="button"
        onClick={() => {
          setStage('email');
          setCode('');
          setError('');
        }}
        className="mt-4 w-full text-link text-primary-text underline"
      >
        {COPY.change}
      </button>
    </form>
  );
}
