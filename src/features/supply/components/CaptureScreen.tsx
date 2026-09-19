'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Banner, Button } from '@/shared/components';
import { compressImage } from '@/shared/utils';
import { DEMO_SAMPLE_PHOTO, HOST_COPY, VERIFY_FLOW_STEPS, isDemoMode } from '../constants';
import { useBlobUrl, useHostApp } from '../hooks';
import type { CaptureKind, HostAppState } from '../interfaces';
import { hostAppStore } from '../services';
import { HostScreen } from './HostScreen';

const copy = HOST_COPY.verify.capture;

const selectKey: Record<CaptureKind, (state: HostAppState) => string | undefined> = {
  document: (state) => state.verification.documentPhotoKey,
  selfie: (state) => state.verification.selfieKey,
};

const DocumentOutline = () => (
  <svg viewBox="0 0 240 160" className="h-2/3 w-2/3 stroke-border-strong" fill="none" strokeWidth="3" strokeLinecap="round" aria-hidden>
    <rect x="6" y="6" width="228" height="148" rx="14" strokeDasharray="10 8" />
    <circle cx="66" cy="70" r="22" />
    <path d="M34 124c8-16 20-24 32-24s24 8 32 24" />
    <path d="M128 60h72M128 86h72M128 112h44" />
  </svg>
);

const FaceOutline = () => (
  <svg viewBox="0 0 160 200" className="h-3/4 stroke-border-strong" fill="none" strokeWidth="3" strokeLinecap="round" aria-hidden>
    <ellipse cx="80" cy="92" rx="56" ry="74" strokeDasharray="10 8" />
    <path d="M14 196c10-24 36-34 66-34s56 10 66 34" />
  </svg>
);

interface CaptureScreenProps {
  kind: CaptureKind;
  step: number;
  backHref: string;
  nextHref: string;
}

/**
 * Opens the phone's own camera rather than an in-page viewfinder: it is the camera the host already
 * knows, it handles focus and flash, and it works on a cheap Android where a live preview struggles.
 */
export const CaptureScreen = ({ kind, step, backHref, nextHref }: CaptureScreenProps) => {
  const picker = useRef<HTMLInputElement>(null);
  const photoKey = useHostApp(selectKey[kind]);
  const photoUrl = useBlobUrl(photoKey);
  const [failed, setFailed] = useState(false);
  const demoLoaded = useRef(false);

  const handlePhoto = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      await hostAppStore.saveCapture(kind, await compressImage(file));
      setFailed(false);
    } catch {
      setFailed(true);
    }
  };

  const openCamera = (): void => picker.current?.click();

  // Demo pitch mode: opens the screen already showing the sample photo so the presenter's only tap
  // is the existing Use button, same as a real capture.
  useEffect(() => {
    if (!isDemoMode || photoKey || demoLoaded.current) return;
    demoLoaded.current = true;
    void (async () => {
      try {
        const response = await fetch(DEMO_SAMPLE_PHOTO[kind]);
        await hostAppStore.saveCapture(kind, await compressImage(await response.blob()));
      } catch {
        setFailed(true);
      }
    })();
  }, [kind, photoKey]);

  return (
    <HostScreen
      barTitle={HOST_COPY.verify.flowTitle}
      backHref={backHref}
      step={{ current: step, total: VERIFY_FLOW_STEPS }}
      heading={copy[kind].title}
      helper={copy[kind].tip}
      footer={
        photoUrl ? (
          <>
            <Button href={nextHref}>{copy.use}</Button>
            <Button variant="secondary" icon="retake" onClick={openCamera}>
              {copy.retake}
            </Button>
          </>
        ) : (
          <Button icon="camera" onClick={openCamera}>
            {copy.take}
          </Button>
        )
      }
    >
      <div className="flex flex-col gap-4">
        <div
          className={`flex w-full items-center justify-center overflow-hidden rounded-lg bg-surface-soft ${kind === 'selfie' ? 'aspect-square' : 'aspect-[4/3]'}`}
        >
          {photoUrl ? (
            // An object URL from IndexedDB, which next/image cannot optimise.
            <img src={photoUrl} alt={copy[kind].alt} className="size-full object-cover" />
          ) : (
            <div role="img" aria-label={copy[kind].frame} className="flex size-full items-center justify-center">
              {kind === 'selfie' ? <FaceOutline /> : <DocumentOutline />}
            </div>
          )}
        </div>
        {failed ? <Banner tone="error">{copy.failed}</Banner> : null}
        <input
          ref={picker}
          type="file"
          accept="image/*"
          capture={kind === 'selfie' ? 'user' : 'environment'}
          onChange={(event) => void handlePhoto(event)}
          className="sr-only"
          tabIndex={-1}
          aria-hidden
        />
      </div>
    </HostScreen>
  );
};
