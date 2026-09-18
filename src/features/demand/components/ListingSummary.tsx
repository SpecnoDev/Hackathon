import type { ReactNode } from 'react';
import Image from 'next/image';
import { COPY_COMMON } from '../constants';
import type { Listing } from '../interfaces';
import { hostOf } from '../services/client';

/** A listing in one line: thumbnail, title, host. Used wherever a booking, a trip or a plan names what it is for. */
export const ListingSummary = ({ listing, children }: { listing: Listing; children?: ReactNode }) => (
  <div className="flex items-start gap-4">
    <span className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-md bg-surface-soft">
      {listing.photos[0] ? <Image src={listing.photos[0]} alt="" fill className="object-cover" sizes="80px" /> : null}
    </span>
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <p className="text-title-sm text-ink">{listing.title}</p>
      <p className="text-body-sm text-muted">{`${COPY_COMMON.hostedBy(hostOf(listing).firstName)} · ${listing.town}`}</p>
      {children}
    </div>
  </div>
);
