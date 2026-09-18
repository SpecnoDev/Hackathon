'use client';

import Image from 'next/image';
import Link from 'next/link';
import { VerifiedBadge, VoiceNotePlayer } from '@/shared/components';
import { COPY_COMMON, COPY_EXPLORE, TRAVELLER_ROUTES } from '../constants';
import { usePlaceholderVoiceNote } from '../hooks';
import type { TravellerHost } from '../interfaces';
import { badgeFor } from '../services/client';

/**
 * DESIGN.md host-story-block with the host's portrait: "This block is the brand; give it room."
 * The shared HostStoryBlock draws an initial because the host app has no portraits yet; this one has a photo to show.
 */
export const HostStory = ({ host, linkToProfile = true }: { host: TravellerHost; linkToProfile?: boolean }) => {
  const voiceNote = usePlaceholderVoiceNote(host.voiceNoteSeconds);
  const badge = badgeFor(host);

  return (
    <section className="flex flex-col gap-4 rounded-lg bg-surface-soft p-6">
      <div className="flex items-center gap-4">
        <span className="relative size-14 shrink-0 overflow-hidden rounded-full bg-surface-strong">
          <Image src={host.portrait} alt="" fill className="object-cover" sizes="56px" />
        </span>
        <div className="flex min-w-0 flex-col items-start gap-1">
          <h2 className="text-title-md text-ink">{`${host.firstName} · ${host.town}`}</h2>
          {badge ? <VerifiedBadge label={badge} density="traveller" /> : <p className="text-caption text-muted">{COPY_COMMON.tierName[host.tier]}</p>}
        </div>
      </div>
      <p className="text-body-md text-body">{host.story}</p>
      {voiceNote ? (
        <div className="flex flex-col gap-2">
          <p className="text-caption text-muted">{COPY_COMMON.voice.hear(host.firstName)}</p>
          <VoiceNotePlayer src={voiceNote} seconds={host.voiceNoteSeconds} playLabel={COPY_COMMON.voice.play} pauseLabel={COPY_COMMON.voice.pause} />
        </div>
      ) : null}
      {linkToProfile ? (
        <Link href={TRAVELLER_ROUTES.host(host.id)} className="flex min-h-12 items-center text-link text-primary-text underline">
          {COPY_EXPLORE.listing.seeProfile(host.firstName)}
        </Link>
      ) : null}
    </section>
  );
};
