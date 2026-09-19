'use client';

import Link from 'next/link';
import { PhotoPlate, StatusPill } from '@/shared/components';
import { formatRand } from '@/shared/utils';
import { HOST_COPY, HOST_ROUTES, OFFERING_STATUS_TONE, kindOption } from '../constants';
import { useBlobUrl } from '../hooks';
import type { Offering } from '../interfaces';
import { priceUnitLabel } from '../utils';

export const OfferingStatusPill = ({ offering }: { offering: Offering }) =>
  offering.pendingSync ? (
    <StatusPill tone="review" icon="cloud-off" label={HOST_COPY.common.waitingToUpload} />
  ) : (
    <StatusPill tone={OFFERING_STATUS_TONE[offering.status]} label={HOST_COPY.offerings.status[offering.status]} />
  );

/**
 * Photo first, no box around it: the photo is the card and the status floats on it (DESIGN.md listing-card).
 * With no photo yet, the plate becomes the nudge to add one.
 */
export const OfferingCard = ({ offering }: { offering: Offering }) => {
  const photo = useBlobUrl(offering.photos[0]?.key);
  const title = offering.title || HOST_COPY.offerings.untitled;
  return (
    <Link href={HOST_ROUTES.offerings.detail(offering.id)} className="flex flex-col gap-3 active:opacity-80">
      <div className="relative">
        <PhotoPlate
          src={photo}
          alt={HOST_COPY.create.preview.photoAlt(title)}
          placeholderIcon={kindOption(offering.kind).icon}
          placeholderLabel={offering.photos.length === 0 ? HOST_COPY.offerings.addPhotos : undefined}
        />
        <span className="absolute left-3 top-3 rounded-xs shadow-lift">
          <OfferingStatusPill offering={offering} />
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-title-md text-ink">{title}</h2>
        <p className="text-body-host text-body">{`${formatRand(offering.priceCents)} ${priceUnitLabel(offering.priceUnit)}`}</p>
        {offering.statusReason ? <p className="text-caption text-muted">{offering.statusReason}</p> : null}
      </div>
    </Link>
  );
};
