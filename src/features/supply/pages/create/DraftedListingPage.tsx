'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Banner, Button } from '@/shared/components';
import { HostScreen, OfferingDraftStack } from '../../components';
import { CREATE_FLOW_STEPS, GUIDED_FORM_FIELDS, HOST_COPY, HOST_ROUTES, NEW_DRAFT_KEY } from '../../constants';
import { useRequireDraft } from '../../hooks';
import { missingDraftFields } from '../../services';

const copy = HOST_COPY.create.draft;

export const DraftedListingPage = () => {
  const router = useRouter();
  const draft = useRequireDraft(NEW_DRAFT_KEY, HOST_ROUTES.create.category);
  const [showMissing, setShowMissing] = useState(false);
  if (!draft) return <HostScreen barTitle={HOST_COPY.create.flowTitle}>{null}</HostScreen>;

  const typed = draft.source === 'typed';

  const next = (): void => {
    const incomplete = missingDraftFields(draft.fields).length > 0;
    setShowMissing(incomplete);
    if (!incomplete) router.push(HOST_ROUTES.create.photos);
  };

  return (
    <HostScreen
      barTitle={HOST_COPY.create.flowTitle}
      backHref={typed ? HOST_ROUTES.create.form(GUIDED_FORM_FIELDS.length) : HOST_ROUTES.create.voice}
      step={{ current: 3, total: CREATE_FLOW_STEPS }}
      heading={typed ? copy.titleTyped : copy.titleVoice}
      helper={copy.helper}
      footer={<Button onClick={next}>{HOST_COPY.common.continue}</Button>}
    >
      <div className="flex flex-col gap-4">
        {showMissing ? <Banner tone="error">{copy.incomplete}</Banner> : null}
        <OfferingDraftStack fields={draft.fields} showMissing={showMissing} rowHref={HOST_ROUTES.create.field} />
      </div>
    </HostScreen>
  );
};
