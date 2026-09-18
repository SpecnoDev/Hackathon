'use client';

import Image from 'next/image';
import { Button, EmptyState, VerifiedBadge, VoiceNotePlayer } from '@/shared/components';
import { DetailFact, ListingGrid, TravellerScreen } from '../../components';
import { COPY_COMMON, COPY_EXPLORE, TRAVELLER_ROUTES, languageName } from '../../constants';
import { usePlaceholderVoiceNote } from '../../hooks';
import type { TravellerHost } from '../../interfaces';
import { badgeFor, findHost, listingsByHost } from '../../services/client';
import { formatMonthYear } from '../../utils';

const copy = COPY_EXPLORE.host;

const Profile = ({ host }: { host: TravellerHost }) => {
  const voiceNote = usePlaceholderVoiceNote(host.voiceNoteSeconds);
  const badge = badgeFor(host);

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col items-center gap-4 text-center">
        <span className="relative size-28 overflow-hidden rounded-full bg-surface-strong">
          <Image src={host.portrait} alt="" fill priority className="object-cover" sizes="112px" />
        </span>
        <div className="flex flex-col items-center gap-2">
          <h1 className="font-display text-display-lg text-ink">{host.firstName}</h1>
          <p className="text-body-md text-muted">{host.town}</p>
          {badge ? <VerifiedBadge label={badge} density="traveller" /> : <p className="text-caption text-muted">{COPY_COMMON.tierName[host.tier]}</p>}
        </div>
      </header>

      <ul className="mx-auto flex w-full max-w-host flex-col gap-6">
        <DetailFact icon="calendar-check" title={copy.memberSince(formatMonthYear(host.memberSince))}>
          {COPY_COMMON.tierName[host.tier]}
        </DetailFact>
        <DetailFact icon="globe" title={copy.speaks}>
          {host.languages.map(languageName).join(', ')}
        </DetailFact>
      </ul>

      <section className="mx-auto flex w-full max-w-host flex-col gap-4 rounded-lg bg-surface-soft p-6">
        <h2 className="text-title-lg text-ink">{copy.story(host.firstName)}</h2>
        <p className="text-body-md text-body">{host.story}</p>
        {voiceNote ? (
          <div className="flex flex-col gap-2">
            <p className="text-caption text-muted">{COPY_COMMON.voice.hear(host.firstName)}</p>
            <VoiceNotePlayer src={voiceNote} seconds={host.voiceNoteSeconds} playLabel={COPY_COMMON.voice.play} pauseLabel={COPY_COMMON.voice.pause} />
          </div>
        ) : null}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-title-lg text-ink">{copy.offerings(host.firstName)}</h2>
        <ListingGrid listings={listingsByHost(host.id)} />
      </section>
    </div>
  );
};

/** Screen 7: the person behind the listings. */
export const HostProfilePage = ({ hostId }: { hostId: string }) => {
  const host = findHost(hostId);

  return (
    <TravellerScreen barTitle={copy.barTitle} backHref={TRAVELLER_ROUTES.home}>
      {host ? (
        <Profile host={host} />
      ) : (
        <EmptyState
          illustration="missing"
          title={COPY_COMMON.notFoundTitle}
          message={copy.notFound}
          action={
            <Button size="md" variant="secondary" href={TRAVELLER_ROUTES.home}>
              {COPY_EXPLORE.listing.backToExplore}
            </Button>
          }
        />
      )}
    </TravellerScreen>
  );
};
