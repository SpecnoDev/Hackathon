'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Sheet } from '@/shared/components';
import { HostScreen, PhotoSlots } from '../../components';
import { CREATE_FLOW_STEPS, HOST_COPY, HOST_ROUTES, NEW_DRAFT_KEY, PHOTOS_TO_GO_LIVE } from '../../constants';
import { useRequireDraft } from '../../hooks';

const PHOTOS_STEP = 4;
const copy = HOST_COPY.create.photos;

export const PhotosPage = () => {
  const router = useRouter();
  const draft = useRequireDraft(NEW_DRAFT_KEY, HOST_ROUTES.create.category);
  const [confirmSkip, setConfirmSkip] = useState(false);
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
