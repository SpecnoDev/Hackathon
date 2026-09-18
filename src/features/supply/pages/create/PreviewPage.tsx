'use client';

import { useRouter } from 'next/navigation';
import { Banner, Button } from '@/shared/components';
import { HostScreen, ListingPreview } from '../../components';
import { CREATE_FLOW_STEPS, HOST_COPY, HOST_ROUTES, NEW_DRAFT_KEY } from '../../constants';
import { useHostApp, useRequireDraft } from '../../hooks';
import type { Host, HostAppState } from '../../interfaces';
import { hostAppStore, missingDraftFields, selectHost } from '../../services';

const copy = HOST_COPY.create.preview;
const selectCurrentHost = (state: HostAppState): Host => selectHost(state);

export const PreviewPage = () => {
  const router = useRouter();
  const host = useHostApp(selectCurrentHost);
  const draft = useRequireDraft(NEW_DRAFT_KEY, HOST_ROUTES.create.category);
  if (!draft) return <HostScreen barTitle={HOST_COPY.create.flowTitle}>{null}</HostScreen>;

  const incomplete = missingDraftFields(draft.fields).length > 0;

  const publish = (): void => {
    if (hostAppStore.publishDraft()) router.replace(HOST_ROUTES.create.published);
  };

  return (
    <HostScreen
      barTitle={HOST_COPY.create.flowTitle}
      backHref={HOST_ROUTES.create.availability}
      step={{ current: CREATE_FLOW_STEPS, total: CREATE_FLOW_STEPS }}
      heading={copy.title}
      helper={copy.english}
      footer={
        <>
          <Button onClick={publish} disabled={incomplete}>
            {copy.publish}
          </Button>
          <Button variant="secondary" href={HOST_ROUTES.create.draft}>
            {copy.change}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        {incomplete ? <Banner tone="error">{copy.incomplete}</Banner> : null}
        {draft.fields.voiceNoteKey ? (
          <Banner tone="info" icon="mic">
            {copy.voiceNote}
          </Banner>
        ) : null}
        <ListingPreview fields={draft.fields} host={host} />
      </div>
    </HostScreen>
  );
};
