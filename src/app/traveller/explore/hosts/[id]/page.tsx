import Image from 'next/image';
import { notFound } from 'next/navigation';
import { LANGUAGE_LABELS } from '@/core/constants';
import { ListingGrid, TravellerScreen } from '@/features/demand/components';
import { COPY_COMMON, COPY_HOST, TRAVELLER_ROUTES } from '@/features/demand/constants';
import { getHostProfile } from '@/features/demand/services';
import { formatMonthYear } from '@/features/demand/utils';
import { DetailFact, VerifiedBadge } from '@/shared/components';

export const metadata = { title: 'Host' };

/** Screen 7: the person behind the listings. Public fields only; the voice note waits on a public URL for host recordings. */
export default async function HostProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const host = await getHostProfile(id);
  if (!host) notFound();

  const badge = host.tier === 'REGISTERED' ? undefined : COPY_COMMON.badge[host.tier];

  return (
    <TravellerScreen barTitle={COPY_HOST.barTitle} backHref={TRAVELLER_ROUTES.home}>
      <div className="flex flex-col gap-10">
        <header className="flex flex-col items-center gap-4 text-center">
          <span className="relative size-28 overflow-hidden rounded-full bg-surface-strong">
            {host.portrait ? (
              <Image src={host.portrait} alt="" fill priority className="object-cover" sizes="112px" />
            ) : (
              <span aria-hidden className="flex size-full items-center justify-center font-display text-display-lg text-ink">
                {host.firstName.charAt(0)}
              </span>
            )}
          </span>
          <div className="flex flex-col items-center gap-2">
            <h1 className="font-display text-display-lg text-ink">{host.firstName}</h1>
            <p className="text-body-md text-muted">{host.town}</p>
            {badge ? <VerifiedBadge label={badge} density="traveller" /> : <p className="text-caption text-muted">{COPY_COMMON.tierName[host.tier]}</p>}
          </div>
        </header>

        <ul className="mx-auto flex w-full max-w-host flex-col gap-6">
          <DetailFact icon="calendar-check" title={COPY_HOST.memberSince(formatMonthYear(host.memberSince))}>
            {COPY_COMMON.tierName[host.tier]}
          </DetailFact>
          <DetailFact icon="globe" title={COPY_HOST.speaks}>
            {host.languages.map((code) => LANGUAGE_LABELS[code]).join(', ')}
          </DetailFact>
        </ul>

        {host.story ? (
          <section className="mx-auto flex w-full max-w-host flex-col gap-4 rounded-lg bg-surface-soft p-6">
            <h2 className="text-title-lg text-ink">{COPY_HOST.story(host.firstName)}</h2>
            <p className="text-body-md text-body">{host.story}</p>
          </section>
        ) : null}

        <section className="flex flex-col gap-4">
          <h2 className="text-title-lg text-ink">{COPY_HOST.offerings(host.firstName)}</h2>
          {host.offerings.length === 0 ? <p className="text-body-md text-muted">{COPY_HOST.noOfferings(host.firstName)}</p> : <ListingGrid offerings={host.offerings} />}
        </section>
      </div>
    </TravellerScreen>
  );
}
