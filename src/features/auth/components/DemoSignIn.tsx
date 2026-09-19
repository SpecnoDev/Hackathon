import { RETURN_TO_PARAM } from '@/core/constants';
import { Button } from '@/shared/components';
import { DEMO_SIGN_IN_FIELD, DEMO_SIGN_IN_PATH } from '../constants';
import type { DemoTraveller } from '../services';

const COPY = {
  title: 'Demo account',
  helper: 'Skips the email. Only on while the demo switch is set.',
  continueAs: (name: string) => `Continue as ${name}`,
};

export function DemoSignIn({ travellers, returnTo }: { travellers: DemoTraveller[]; returnTo: string | null }) {
  if (travellers.length === 0) return null;

  return (
    <section className="mt-8 rounded-lg border border-hairline bg-surface-soft p-6">
      <h2 className="text-title-md text-ink">{COPY.title}</h2>
      <p className="mt-2 text-body-sm text-muted">{COPY.helper}</p>
      <ul className="mt-4 flex flex-col gap-3">
        {travellers.map(({ email, name }) => (
          <li key={email}>
            <form method="post" action={DEMO_SIGN_IN_PATH}>
              <input type="hidden" name={DEMO_SIGN_IN_FIELD} value={email} />
              {returnTo ? <input type="hidden" name={RETURN_TO_PARAM} value={returnTo} /> : null}
              <Button type="submit" variant="secondary" size="md">
                {COPY.continueAs(name)}
              </Button>
            </form>
          </li>
        ))}
      </ul>
    </section>
  );
}
