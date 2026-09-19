import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/core/constants';

const ROLE_CHOICES = [
  {
    href: '/traveller/explore',
    title: 'I want to explore',
    description: 'Find experiences run by local people, and book them.',
  },
  {
    href: '/host',
    title: 'I want to earn',
    description: 'List what you offer and get paid, with no bank account needed.',
  },
  {
    href: ROUTES.plan,
    title: 'Plan a trip with friends',
    description: 'Build one itinerary together: drag in experiences, vote, let the group decide.',
  },
] as const;

/**
 * A Supabase sign-in link falls back to the configured Site URL when its redirect is not on the
 * allow-list, dropping the one-time code here instead of on the page that trades it for a
 * session. Forwarding it means a misconfigured dashboard cannot silently swallow a sign-in.
 */
export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  if (code) redirect(`${ROUTES.loginComplete}?code=${encodeURIComponent(code)}`);

  return (
    <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col justify-center px-6 py-12">
      <h1 className="font-display text-display-xl text-ink">
        Travel that reaches the people who live here.
      </h1>
      <p className="mt-3 text-body-md text-muted">
        A marketplace for local guides, cooks and drivers. Choose how you want to start.
      </p>

      <nav className="mt-8 flex flex-col gap-3">
        {ROLE_CHOICES.map(({ href, title, description }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 rounded-lg border border-hairline bg-canvas p-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink active:bg-surface-soft"
          >
            <span className="flex-1">
              <span className="block text-title-lg text-ink">{title}</span>
              <span className="mt-1 block text-body-sm text-muted">{description}</span>
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-6 shrink-0 stroke-primary-text"
              fill="none"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        ))}
      </nav>
    </main>
  );
}
