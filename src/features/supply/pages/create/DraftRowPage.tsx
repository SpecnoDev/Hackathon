'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/components';
import { AvailabilityEditor, FieldEditor, HostScreen, PhotoSlots, availabilityIssue, isFieldComplete } from '../../components';
import { HOST_COPY, HOST_ROUTES, NEW_DRAFT_KEY, PHOTOS_TO_GO_LIVE, draftFieldOrder } from '../../constants';
import { useRequireDraft } from '../../hooks';
import type { DraftRowId, OfferingFieldId } from '../../interfaces';
import { hostAppStore } from '../../services';

const copy = HOST_COPY.create;

const isFieldRow = (row: string, fields: readonly OfferingFieldId[]): row is OfferingFieldId => (fields as readonly string[]).includes(row);

/**
 * One row of the drafted-listing stack, on its own screen. Serves both a new listing (draftKey "new")
 * and an edit of a live offering (draftKey is the offering id), so screens 16 and 23 share everything.
 */
export const DraftRowPage = ({ draftKey, row }: { draftKey: string; row: DraftRowId }) => {
  const router = useRouter();
  const isNew = draftKey === NEW_DRAFT_KEY;
  const stackHref = isNew ? HOST_ROUTES.create.draft : HOST_ROUTES.offerings.edit(draftKey);
  const draft = useRequireDraft(draftKey, isNew ? HOST_ROUTES.create.category : HOST_ROUTES.offerings.detail(draftKey));
  const [error, setError] = useState<string>();
  if (!draft) return <HostScreen barTitle={copy.flowTitle}>{null}</HostScreen>;

  const { fields } = draft;
  const fieldRow = isFieldRow(row, draftFieldOrder(fields.kind)) ? row : undefined;
  const heading = fieldRow ? copy.fields[fieldRow].question : row === 'photos' ? copy.photos.title : copy.availability.title;
  const helper = fieldRow ? copy.fields[fieldRow].example : row === 'photos' ? copy.photos.helper(PHOTOS_TO_GO_LIVE) : undefined;

  const save = (): void => {
    const issue = fieldRow
      ? isFieldComplete(fieldRow, fields)
        ? undefined
        : fieldRow === 'price'
          ? copy.editor.priceEmpty
          : copy.editor.empty
      : row === 'availability'
        ? availabilityIssue(fields.availability)
        : undefined;
    setError(issue);
    if (!issue) router.push(stackHref);
  };

  const change = (patch: Parameters<typeof hostAppStore.patchDraftFields>[1]): void => {
    setError(undefined);
    hostAppStore.patchDraftFields(draftKey, patch);
  };

  return (
    <HostScreen
      barTitle={isNew ? copy.flowTitle : copy.draft.titleEdit}
      backHref={stackHref}
      heading={heading}
      helper={helper}
      footer={<Button onClick={save}>{HOST_COPY.common.save}</Button>}
    >
      {fieldRow ? <FieldEditor field={fieldRow} fields={fields} error={error} onChange={change} /> : null}
      {row === 'photos' ? <PhotoSlots draftKey={draftKey} photos={fields.photos} /> : null}
      {row === 'availability' ? <AvailabilityEditor availability={fields.availability} error={error} onChange={(availability) => change({ availability })} /> : null}
    </HostScreen>
  );
};
