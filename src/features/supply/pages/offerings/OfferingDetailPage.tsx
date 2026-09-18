'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Banner, Button, Icon, PhotoPlate, Sheet, useToast, type IconName } from '@/shared/components';
import { formatRand } from '@/shared/utils';
import { HostScreen, MissingNotice, OfferingStatusPill } from '../../components';
import { HOST_COPY, HOST_ROUTES, kindOption } from '../../constants';
import { useBlobUrl, useHostApp, useHostAppReady } from '../../hooks';
import type { HostAppState } from '../../interfaces';
import { hostAppStore, selectOfferingPerformance, selectOfferings } from '../../services';
import { formatDuration, priceUnitLabel } from '../../utils';

const copy = HOST_COPY.offerings.detail;

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1">
    <dt className="text-caption text-muted">{label}</dt>
    <dd className="text-title-lg text-ink">{value}</dd>
  </div>
);

/** A quiet row rather than a button: Edit is the one loud action on this screen. */
const ActionRow = ({ icon, label, danger = false, onClick }: { icon: IconName; label: string; danger?: boolean; onClick: () => void }) => (
  <li>
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-16 w-full items-center gap-4 border-b border-hairline-soft py-4 text-left text-title-md active:bg-surface-soft ${danger ? 'text-error' : 'text-ink'}`}
    >
      <Icon name={icon} className="shrink-0" />
      <span className="flex-1">{label}</span>
    </button>
  </li>
);

export const OfferingDetailPage = ({ offeringId }: { offeringId: string }) => {
  const router = useRouter();
  const toast = useToast();
  const ready = useHostAppReady();
  const offering = useHostApp(useCallback((state: HostAppState) => selectOfferings(state).find((item) => item.id === offeringId), [offeringId]));
  const performance = useHostApp(useCallback((state: HostAppState) => (offering ? selectOfferingPerformance(state, offering) : undefined), [offering]));
  const photo = useBlobUrl(offering?.photos[0]?.key);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (ready && !offering) {
    return <MissingNotice barTitle={copy.title} message={copy.notFound} backHref={HOST_ROUTES.offerings.list} backLabel={copy.backToList} />;
  }
  if (!offering || !performance) return <HostScreen barTitle={copy.title}>{null}</HostScreen>;

  const hasPhotos = offering.photos.length > 0;
  const title = offering.title || HOST_COPY.offerings.untitled;

  const setPaused = (paused: boolean): void => {
    hostAppStore.setOfferingPaused(offering.id, paused);
    toast(paused ? copy.paused : copy.resumed);
  };

  const duplicate = (): void => {
    const copyId = hostAppStore.duplicateOffering(offering.id);
    toast(copy.duplicated);
    if (copyId) router.push(HOST_ROUTES.offerings.detail(copyId));
  };

  const remove = (): void => {
    hostAppStore.deleteOffering(offering.id);
    toast(copy.deleted);
    router.replace(HOST_ROUTES.offerings.list);
  };

  const plate = (
    <PhotoPlate
      src={photo}
      alt={HOST_COPY.create.preview.photoAlt(title)}
      placeholderIcon={kindOption(offering.kind).icon}
      placeholderLabel={hasPhotos ? undefined : HOST_COPY.offerings.addPhotos}
    />
  );

  return (
    <HostScreen
      barTitle={copy.title}
      backHref={HOST_ROUTES.offerings.list}
      footer={
        <Button icon="pencil" href={HOST_ROUTES.offerings.edit(offering.id)}>
          {copy.edit}
        </Button>
      }
    >
      <div className="flex flex-col gap-8">
        <div className="relative">
          {hasPhotos ? plate : <Link href={HOST_ROUTES.offerings.edit(offering.id)}>{plate}</Link>}
          <span className="absolute left-3 top-3 rounded-full shadow-lift">
            <OfferingStatusPill offering={offering} />
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-display text-display-md text-ink">{title}</h1>
          <p className="text-body-host text-body">
            {[`${formatRand(offering.priceCents)} ${priceUnitLabel(offering.priceUnit)}`, formatDuration(offering.durationMin)].join(' · ')}
          </p>
        </div>

        {offering.statusReason ? <Banner tone={offering.status === 'REJECTED' ? 'error' : 'warning'}>{offering.statusReason}</Banner> : null}

        <dl className="grid grid-cols-3 gap-4 border-y border-hairline-soft py-5">
          <Stat label={copy.views} value={String(performance.views)} />
          <Stat label={copy.bookings} value={String(performance.bookings)} />
          <Stat label={copy.earned} value={formatRand(performance.earnedCents)} />
        </dl>

        <ul className="flex flex-col">
          {offering.status === 'LIVE' ? <ActionRow icon="pause" label={copy.pause} onClick={() => setPaused(true)} /> : null}
          {offering.status === 'PAUSED' ? <ActionRow icon="play" label={copy.resume} onClick={() => setPaused(false)} /> : null}
          <ActionRow icon="copy" label={copy.duplicate} onClick={duplicate} />
          <ActionRow icon="trash" label={copy.delete} danger onClick={() => setConfirmDelete(true)} />
        </ul>
      </div>

      {confirmDelete ? (
        <Sheet
          title={copy.deleteTitle}
          closeLabel={HOST_COPY.common.close}
          onClose={() => setConfirmDelete(false)}
          actions={
            <>
              <Button variant="destructive" size="lg" onClick={remove}>
                {copy.deleteConfirm}
              </Button>
              <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
                {copy.keep}
              </Button>
            </>
          }
        >
          {copy.deleteBody}
        </Sheet>
      ) : null}
    </HostScreen>
  );
};
