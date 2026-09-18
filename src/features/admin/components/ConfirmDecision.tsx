'use client';

import { useActionState, useEffect, useId, useRef, useState } from 'react';
import { ADMIN_REASON_MAX_LENGTH } from '@/core/constants';
import { Banner, Button, Sheet } from '@/shared/components';
import { ADMIN_COPY, ADMIN_FORM_FIELDS, type AdminDecision } from '../constants';
import type { AdminFormAction } from '../interfaces';

const REASON_ROWS = 3;
const FIELD = 'w-full rounded-md border border-hairline bg-canvas p-4 text-body-md text-ink focus:border-ink focus:outline-none';

interface ConfirmDecisionProps {
  decision: AdminDecision<string>;
  action: AdminFormAction;
}

/**
 * Nothing an operator does to an account happens on one click. Where the decision takes someone
 * off the platform, the typed reason is what enables the button: the trail is the point of it.
 */
export const ConfirmDecision = ({ decision, action }: ConfirmDecisionProps) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [state, submit, pending] = useActionState(action, {});
  const wasPending = useRef(false);
  const formId = useId();

  useEffect(() => {
    if (wasPending.current && !pending && !state.error) setOpen(false);
    wasPending.current = pending;
  }, [pending, state.error]);

  const blocked = decision.requireReason && !reason.trim();
  const variant = decision.destructive ? 'destructive' : 'primary';
  const reasonCopy = decision.requireReason ? ADMIN_COPY.confirm.reasonRequired : ADMIN_COPY.confirm.reasonOptional;

  return (
    <>
      <Button variant={variant} size="md" fullWidth={false} onClick={() => setOpen(true)}>
        {decision.label}
      </Button>
      {open ? (
        <Sheet
          title={decision.title}
          onClose={() => setOpen(false)}
          closeLabel={ADMIN_COPY.confirm.close}
          actions={
            <>
              <div className={blocked ? 'opacity-50' : undefined}>
                <Button type="submit" form={formId} variant={variant} size="md" disabled={blocked || pending}>
                  {pending ? ADMIN_COPY.confirm.working : decision.confirmLabel}
                </Button>
              </div>
              <Button type="button" variant="secondary" size="md" onClick={() => setOpen(false)}>
                {ADMIN_COPY.confirm.cancel}
              </Button>
            </>
          }
        >
          <form id={formId} action={submit} className="flex flex-col gap-4">
            <input type="hidden" name={ADMIN_FORM_FIELDS.status} value={decision.status} />
            <p className="text-body-md text-body">{decision.description}</p>
            <label className="flex flex-col gap-2 text-caption text-ink">
              {reasonCopy.label}
              <textarea
                name={ADMIN_FORM_FIELDS.reason}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                rows={REASON_ROWS}
                maxLength={ADMIN_REASON_MAX_LENGTH}
                autoFocus
                className={FIELD}
              />
              <span className="text-caption text-muted">{reasonCopy.helper}</span>
            </label>
            {state.error ? <Banner tone="error">{state.error}</Banner> : null}
          </form>
        </Sheet>
      ) : null}
    </>
  );
};
