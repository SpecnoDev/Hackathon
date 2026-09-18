'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/components';
import { FieldEditor, HostScreen, isFieldComplete } from '../../components';
import { GUIDED_FORM_FIELDS, HOST_COPY, HOST_ROUTES, NEW_DRAFT_KEY } from '../../constants';
import { useRequireDraft } from '../../hooks';
import { hostAppStore } from '../../services';

const copy = HOST_COPY.create;

/** Screens 16a to 16f: the typed route. One question per screen, each with an example and the option to speak. */
export const GuidedFormPage = ({ step }: { step: number }) => {
  const router = useRouter();
  const draft = useRequireDraft(NEW_DRAFT_KEY, HOST_ROUTES.create.category);
  const [error, setError] = useState<string>();
  const total = GUIDED_FORM_FIELDS.length;
  const field = GUIDED_FORM_FIELDS[step - 1];

  useEffect(() => {
    if (!field) router.replace(HOST_ROUTES.create.form(1));
    else hostAppStore.patchDraft(NEW_DRAFT_KEY, { source: 'typed' });
  }, [field, router]);

  if (!draft || !field) return <HostScreen barTitle={copy.flowTitle}>{null}</HostScreen>;

  const next = (): void => {
    if (!isFieldComplete(field, draft.fields)) {
      setError(field === 'price' ? copy.editor.priceEmpty : copy.editor.empty);
      return;
    }
    if (step === total) hostAppStore.patchDraft(NEW_DRAFT_KEY, { drafted: true });
    router.push(step === total ? HOST_ROUTES.create.draft : HOST_ROUTES.create.form(step + 1));
  };

  return (
    <HostScreen
      barTitle={copy.flowTitle}
      backHref={step === 1 ? HOST_ROUTES.create.voice : HOST_ROUTES.create.form(step - 1)}
      step={{ current: step, total }}
      heading={copy.fields[field].question}
      helper={copy.fields[field].example}
      footer={<Button onClick={next}>{HOST_COPY.common.continue}</Button>}
    >
      <FieldEditor
        field={field}
        fields={draft.fields}
        error={error}
        onChange={(patch) => {
          setError(undefined);
          hostAppStore.patchDraftFields(NEW_DRAFT_KEY, patch);
        }}
      />
    </HostScreen>
  );
};
