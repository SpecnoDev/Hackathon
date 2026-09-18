import Link from 'next/link';

const ROLE_CHOICES = [
  {
    href: '/explore',
    title: 'I want to explore',
    description: 'Find experiences run by local people, and book them.',
  },
  {
    href: '/host',
    title: 'I want to earn',
    description: 'List what you offer and get paid, with no bank account needed.',
  },
] as const;

export default function LandingPage() {
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
