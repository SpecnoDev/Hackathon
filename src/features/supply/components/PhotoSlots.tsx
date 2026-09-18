'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { Banner, Button, Icon, PhotoPlate } from '@/shared/components';
import { compressImage, formatDataSize } from '@/shared/utils';
import { HOST_COPY, PHOTOS_TO_GO_LIVE } from '../constants';
import { useBlobUrl } from '../hooks';
import type { OfferingPhoto } from '../interfaces';
import { hostAppStore } from '../services';

const copy = HOST_COPY.create.photos;

const Slot = ({ photo, position, onRemove, onAdd }: { photo?: OfferingPhoto; position: number; onRemove: () => void; onAdd: () => void }) => {
  const url = useBlobUrl(photo?.key);
  return (
    <li className="relative">
      {photo ? (
        <>
          <PhotoPlate src={url} alt={copy.slot(position)} />
          <button
            type="button"
            aria-label={copy.remove(position)}
            onClick={onRemove}
            className="absolute right-1 top-1 flex size-12 items-center justify-center rounded-full bg-canvas text-ink shadow-lift"
          >
            <Icon name="x" />
          </button>
        </>
      ) : (
        <button
          type="button"
          aria-label={`${copy.slot(position)}. ${copy.upload}`}
          onClick={onAdd}
          className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border-strong bg-surface-soft text-muted"
        >
          <Icon name="plus" />
          <span className="text-caption">{copy.slot(position)}</span>
        </button>
      )}
    </li>
  );
};

/** Three slots, take or choose, compressed on the phone before anything is stored or uploaded. */
export const PhotoSlots = ({ draftKey, photos }: { draftKey: string; photos: OfferingPhoto[] }) => {
  const camera = useRef<HTMLInputElement>(null);
  const library = useRef<HTMLInputElement>(null);
  const [failed, setFailed] = useState(false);
  const full = photos.length >= PHOTOS_TO_GO_LIVE;
  const totalBytes = photos.reduce((total, photo) => total + photo.bytes, 0);

  const handleFiles = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = Array.from(event.target.files ?? []).slice(0, PHOTOS_TO_GO_LIVE - photos.length);
    event.target.value = '';
    try {
      for (const file of files) await hostAppStore.addDraftPhoto(draftKey, await compressImage(file));
      setFailed(false);
    } catch {
      setFailed(true);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <ul className="grid grid-cols-3 gap-3">
        {Array.from({ length: PHOTOS_TO_GO_LIVE }, (_, index) => (
          <Slot
            key={photos[index]?.key ?? index}
            photo={photos[index]}
            position={index + 1}
            onRemove={() => hostAppStore.removeDraftPhoto(draftKey, photos[index].key)}
            onAdd={() => library.current?.click()}
          />
        ))}
      </ul>
      {totalBytes > 0 ? <p className="text-caption text-muted">{copy.data(formatDataSize(totalBytes))}</p> : null}
      {failed ? <Banner tone="error">{copy.failed}</Banner> : null}
      <div className="flex flex-col gap-3">
        <Button variant="secondary" icon="camera" disabled={full} onClick={() => camera.current?.click()}>
          {copy.take}
        </Button>
        <Button variant="secondary" icon="image" disabled={full} onClick={() => library.current?.click()}>
          {copy.upload}
        </Button>
      </div>
      <input ref={camera} type="file" accept="image/*" capture="environment" onChange={(event) => void handleFiles(event)} className="sr-only" tabIndex={-1} aria-hidden />
      <input ref={library} type="file" accept="image/*" multiple onChange={(event) => void handleFiles(event)} className="sr-only" tabIndex={-1} aria-hidden />
    </div>
  );
};
