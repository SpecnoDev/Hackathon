'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/components';
import { AvailabilityEditor, HostScreen, availabilityIssue } from '../../components';
import { CREATE_FLOW_STEPS, HOST_COPY, HOST_ROUTES, NEW_DRAFT_KEY } from '../../constants';
import { useRequireDraft } from '../../hooks';
import { hostAppStore } from '../../services';

const AVAILABILITY_STEP = 5;

export const AvailabilityPage = () => {
  const router = useRouter();
  const draft = useRequireDraft(NEW_DRAFT_KEY, HOST_ROUTES.create.category);
  const [error, setError] = useState<string>();
  if (!draft) return <HostScreen barTitle={HOST_COPY.create.flowTitle}>{null}</HostScreen>;

  const next = (): void => {
    const issue = availabilityIssue(draft.fields.availability);
    setError(issue);
    if (!issue) router.push(HOST_ROUTES.create.preview);
  };

  return (
    <HostScreen
      barTitle={HOST_COPY.create.flowTitle}
      backHref={HOST_ROUTES.create.photos}
      step={{ current: AVAILABILITY_STEP, total: CREATE_FLOW_STEPS }}
      heading={HOST_COPY.create.availability.title}
      footer={<Button onClick={next}>{HOST_COPY.common.continue}</Button>}
    >
      <AvailabilityEditor
        availability={draft.fields.availability}
        error={error}
        onChange={(availability) => {
          setError(undefined);
          hostAppStore.patchDraftFields(NEW_DRAFT_KEY, { availability });
        }}
      />
    </HostScreen>
  );
};
