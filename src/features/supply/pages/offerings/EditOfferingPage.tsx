'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Banner, Button, useToast } from '@/shared/components';
import { HostScreen, OfferingDraftStack } from '../../components';
import { HOST_COPY, HOST_ROUTES } from '../../constants';
import { useDraft, useHostAppReady } from '../../hooks';
import { hostAppStore, missingDraftFields } from '../../services';

const copy = HOST_COPY.create.draft;

/** Screen 23: the same stack as screen 16, opened on a copy of the live values so nothing changes until Save. */
export const EditOfferingPage = ({ offeringId }: { offeringId: string }) => {
  const router = useRouter();
  const toast = useToast();
  const ready = useHostAppReady();
  const draft = useDraft(offeringId);
  const [showMissing, setShowMissing] = useState(false);

  useEffect(() => {
    if (ready) hostAppStore.beginEdit(offeringId);
  }, [ready, offeringId]);

  if (!draft) return <HostScreen barTitle={copy.titleEdit} backHref={HOST_ROUTES.offerings.detail(offeringId)}>{null}</HostScreen>;

  const save = (): void => {
    const incomplete = missingDraftFields(draft.fields).length > 0;
    setShowMissing(incomplete);
    if (incomplete) return;
    hostAppStore.saveEdit(offeringId);
    toast(copy.saved);
    router.push(HOST_ROUTES.offerings.detail(offeringId));
  };

  return (
    <HostScreen
      barTitle={HOST_COPY.offerings.detail.title}
      backHref={HOST_ROUTES.offerings.detail(offeringId)}
      heading={copy.titleEdit}
      helper={copy.helper}
      footer={<Button onClick={save}>{copy.saveEdit}</Button>}
    >
      <div className="flex flex-col gap-4">
        {showMissing ? <Banner tone="error">{copy.incomplete}</Banner> : null}
        <OfferingDraftStack withMedia fields={draft.fields} showMissing={showMissing} rowHref={(row) => HOST_ROUTES.offerings.editField(offeringId, row)} />
      </div>
    </HostScreen>
  );
};
