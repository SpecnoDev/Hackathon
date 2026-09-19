import Link from 'next/link';
import { redirect } from 'next/navigation';
import { RETURN_TO_PARAM, ROLE_HOME_ROUTE, ROUTES, isMockAuthEnabled, safeReturnPath } from '@/core/constants';
import { getCurrentUser } from '@/core/services';
import { DemoSignIn, EmailSignIn, SessionFromUrl } from '@/features/auth/components';
import { TravellerScreen } from '@/features/demand/components';
import { listDemoTravellers } from '@/features/auth/services';

export const metadata = { title: 'Sign in' };
export const dynamic = 'force-dynamic';

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const returnTo = safeReturnPath((await searchParams)[RETURN_TO_PARAM]);
  const user = await getCurrentUser();
  if (user) redirect(returnTo ?? ROLE_HOME_ROUTE[user.role]);
  const demoTravellers = isMockAuthEnabled() ? await listDemoTravellers() : [];

  return (
    <TravellerScreen pageTitle="Sign in" showNav width="column">
      <p className="-mt-4 text-body-md text-muted">Travellers sign in with their email.</p>

      <SessionFromUrl returnTo={returnTo} />
      <DemoSignIn travellers={demoTravellers} returnTo={returnTo} />
      <EmailSignIn returnTo={returnTo} />

      <div className="mt-10 rounded-lg border border-hairline p-6">
        <h2 className="text-title-md text-ink">Are you a host?</h2>
        <p className="mt-2 text-body-sm text-muted">
          Message us on WhatsApp and we send you a link that opens your listings. No code to type.
        </p>
        <Link
          href={ROUTES.host}
          className="mt-4 flex h-12 items-center justify-center rounded-md border border-hairline text-button-md text-ink"
        >
          Open the host app
        </Link>
      </div>

      <Link href={ROUTES.explore} className="mt-8 text-center text-link text-primary-text underline">
        Just looking? Browse experiences
      </Link>
    </TravellerScreen>
  );
}
