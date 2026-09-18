import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ROLE_HOME_ROUTE, ROUTES } from '@/core/constants';
import { getCurrentUser } from '@/core/services';
import { EmailSignIn } from '@/features/auth/components';

export const metadata = { title: 'Sign in' };
export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(ROLE_HOME_ROUTE[user.role]);

  return (
    <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col justify-center px-6 py-12">
      <h1 className="font-display text-display-lg text-ink">Sign in</h1>
      <p className="mt-2 text-body-md text-muted">Travellers sign in with their email.</p>

      <EmailSignIn />

      <div className="mt-10 rounded-lg border border-hairline p-6">
        <h2 className="text-title-md text-ink">Are you a host?</h2>
        <p className="mt-2 text-body-sm text-muted">
          Message us on WhatsApp and we send you a link that opens your listings. No code to type.
        </p>
        <Link
          href={ROUTES.host}
          className="mt-4 flex h-12 items-center justify-center rounded-full border border-ink text-button-md text-ink"
        >
          Open the host app
        </Link>
      </div>

      <Link href={ROUTES.explore} className="mt-8 text-center text-link text-primary-text underline">
        Just looking? Browse experiences
      </Link>
    </main>
  );
}
