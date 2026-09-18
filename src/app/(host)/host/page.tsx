import { OfferingStatus, VerificationTier } from '@prisma/client';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/core/constants';
import { requireHostPage } from '@/core/guards';
import { isHostOnboarded, listHostOfferings } from '@/core/services';
import { firstName, formatRands } from '@/shared/utils';

const TIER_LABEL: Record<VerificationTier, string> = {
  REGISTERED: 'Registered host',
  IDENTITY: 'Verified host',
  COMMUNITY: 'Community verified host',
};

/** Each pill carries a glyph as well as a tint, so the state reads without colour (DESIGN.md). */
const STATUS_PILL: Record<OfferingStatus, { label: string; className: string }> = {
  DRAFT: { label: '• Draft', className: 'bg-surface-strong text-body' },
  IN_REVIEW: { label: '◷ In review', className: 'bg-accent-tint text-ink' },
  LIVE: { label: '✓ Live', className: 'bg-primary-tint text-primary-text' },
  PAUSED: { label: '❙❙ Paused', className: 'bg-surface-strong text-body' },
  REJECTED: { label: '✕ Rejected', className: 'bg-error-tint text-error' },
};

const HOST_ACTIONS: readonly { href: string; title: string; description: string; primary?: boolean }[] = [
  {
    href: ROUTES.hostListings,
    title: 'Add an offering',
    description: 'Tell travellers what you offer and what it costs.',
    primary: true,
  },
  { href: ROUTES.hostBookings, title: 'Bookings', description: 'Accept or decline the requests you get.' },
  { href: ROUTES.hostEarnings, title: 'Earnings', description: 'See what you have made and how you get paid.' },
  { href: ROUTES.hostProfile, title: 'Profile', description: 'Your name, your area and your verification.' },
];

export default async function HostHomePage() {
  const host = await requireHostPage();
  if (!isHostOnboarded(host)) redirect(ROUTES.hostOnboarding);

  const offerings = await listHostOfferings(host.id);

  return (
    <>
      <section className="flex flex-col gap-1">
        <h1 className="font-display text-display-lg text-ink">Hello, {firstName(host.fullName)}</h1>
        <p className="text-caption text-muted">
          {TIER_LABEL[host.tier]} · {host.serviceArea}
        </p>
      </section>

      <nav className="flex flex-col gap-3">
        {HOST_ACTIONS.map(({ href, title, description, primary }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col gap-1 rounded-lg border p-6 ${primary ? 'border-primary bg-primary-tint' : 'border-hairline bg-canvas'}`}
          >
            <span className="text-title-lg text-ink">{title}</span>
            <span className="text-body-sm text-muted">{description}</span>
          </Link>
        ))}
      </nav>

      <section className="flex flex-col gap-3">
        <h2 className="text-title-md text-ink">Your offerings</h2>

        {offerings.length === 0 ? (
          <p className="text-body-host text-muted">
            You have no offerings yet. Add your first one and travellers can start booking you.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {offerings.map(({ id, title, status, priceCents }) => (
              <li key={id} className="flex items-center gap-3 rounded-md border border-hairline p-4">
                <span className="flex-1">
                  <span className="block text-title-sm text-ink">{title}</span>
                  <span className="block text-body-sm text-muted">{formatRands(priceCents)}</span>
                </span>
                <span className={`rounded-full px-2.5 py-1 text-badge ${STATUS_PILL[status].className}`}>
                  {STATUS_PILL[status].label}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
