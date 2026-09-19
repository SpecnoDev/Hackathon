'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Sheet } from '@/shared/components';
import { compressImage } from '@/shared/utils';
import { HostScreen, PhotoSlots } from '../../components';
import { CREATE_FLOW_STEPS, DEMO_LISTING_PHOTOS, HOST_COPY, HOST_ROUTES, NEW_DRAFT_KEY, PHOTOS_TO_GO_LIVE, isDemoMode } from '../../constants';
import { useRequireDraft } from '../../hooks';
import { hostAppStore } from '../../services';

const PHOTOS_STEP = 4;
const copy = HOST_COPY.create.photos;

export const PhotosPage = () => {
  const router = useRouter();
  const draft = useRequireDraft(NEW_DRAFT_KEY, HOST_ROUTES.create.category);
  const [confirmSkip, setConfirmSkip] = useState(false);
  const demoLoaded = useRef(false);
  const photoCount = draft?.fields.photos.length ?? 0;

  // Demo pitch mode: loads the three sample photos so the listing already qualifies to go LIVE
  // (PHOTOS_TO_GO_LIVE) and the presenter's only tap is the existing Continue button.
  useEffect(() => {
    if (!isDemoMode || !draft || photoCount > 0 || demoLoaded.current) return;
    demoLoaded.current = true;
    void (async () => {
      for (const src of DEMO_LISTING_PHOTOS) {
        const response = await fetch(src);
        await hostAppStore.addDraftPhoto(NEW_DRAFT_KEY, await compressImage(await response.blob()));
      }
    })();
  }, [draft, photoCount]);

  if (!draft) return <HostScreen barTitle={HOST_COPY.create.flowTitle}>{null}</HostScreen>;

  const hasPhotos = draft.fields.photos.length > 0;

  return (
    <HostScreen
      barTitle={HOST_COPY.create.flowTitle}
      backHref={HOST_ROUTES.create.draft}
      step={{ current: PHOTOS_STEP, total: CREATE_FLOW_STEPS }}
      heading={copy.title}
      helper={copy.helper(PHOTOS_TO_GO_LIVE)}
      footer={
        hasPhotos ? (
          <Button href={HOST_ROUTES.create.availability}>{HOST_COPY.common.continue}</Button>
        ) : (
          <Button variant="tertiary" onClick={() => setConfirmSkip(true)}>
            {copy.skip}
          </Button>
        )
      }
    >
      <PhotoSlots draftKey={NEW_DRAFT_KEY} photos={draft.fields.photos} />
      {confirmSkip ? (
        <Sheet
          title={copy.skipTitle}
          closeLabel={HOST_COPY.common.close}
          onClose={() => setConfirmSkip(false)}
          actions={
            <>
              <Button onClick={() => setConfirmSkip(false)}>{copy.addNow}</Button>
              <Button variant="secondary" onClick={() => router.push(HOST_ROUTES.create.availability)}>
                {copy.skipConfirm}
              </Button>
            </>
          }
        >
          {copy.skipBody}
        </Sheet>
      ) : null}
    </HostScreen>
  );
};
