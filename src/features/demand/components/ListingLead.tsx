'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon, PhotoCarousel, type IconName } from '@/shared/components';
import { COPY_COMMON, COPY_LISTING, TRAVELLER_ROUTES } from '../constants';
import { useSavedListings } from './SavedListingsProvider';
import { ShareSheet } from './ShareSheet';

const OVERLAY_BUTTON = 'flex size-12 items-center justify-center rounded-full bg-canvas text-ink shadow-lift';

const OverlayButton = ({ icon, label, pressed, href, onClick }: { icon: IconName; label: string; pressed?: boolean; href?: string; onClick?: () => void }) => {
  const glyph = <Icon name={icon} className={pressed ? 'fill-current' : ''} />;
  return href ? (
    <Link href={href} aria-label={label} className={OVERLAY_BUTTON}>
      {glyph}
    </Link>
  ) : (
    <button type="button" aria-label={label} aria-pressed={pressed} onClick={onClick} className={OVERLAY_BUTTON}>
      {glyph}
    </button>
  );
};

/** DESIGN.md photo-carousel with back, share and the save heart laid over it — the one client island on listing detail. */
export const ListingLead = ({ offeringId, title, photos }: { offeringId: string; title: string; photos: string[] }) => {
  const router = useRouter();
  const [sharing, setSharing] = useState(false);
  const { savedIds, toggleSaved } = useSavedListings();
  const saved = savedIds.has(offeringId);

  return (
    <div className="mx-auto w-full max-w-page tablet:px-6 tablet:pt-6">
      <div className="overflow-hidden tablet:rounded-lg">
        <PhotoCarousel
          photos={photos}
          alt={(position) => COPY_LISTING.photoOf(title, position)}
          countLabel={COPY_LISTING.photoCount}
          overlay={
            <>
              <OverlayButton icon="chevron-left" label={COPY_COMMON.back} onClick={() => router.back()} />
              <span className="flex gap-2">
                <OverlayButton icon="share" label={COPY_LISTING.share} onClick={() => setSharing(true)} />
                <OverlayButton icon="heart" label={saved ? COPY_COMMON.saved.remove(title) : COPY_COMMON.saved.add(title)} pressed={saved} onClick={() => toggleSaved(offeringId)} />
              </span>
            </>
          }
        />
      </div>
      {sharing ? <ShareSheet path={TRAVELLER_ROUTES.listing(offeringId)} message={title} onClose={() => setSharing(false)} /> : null}
    </div>
  );
};
