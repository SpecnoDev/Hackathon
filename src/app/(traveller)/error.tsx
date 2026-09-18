'use client';

import { TravellerShell } from '@/core/layout';
import { COPY_COMMON, TRAVELLER_ROUTES } from '@/features/demand/constants';
import { Button, EmptyState } from '@/shared/components';

/** Any traveller screen that breaks lands here: what happened, that nothing was charged, and two ways forward. */
export default function TravellerError({ reset }: { error: Error; reset: () => void }) {
  return (
    <TravellerShell width="column">
      <EmptyState
        illustration="missing"
        title={COPY_COMMON.errorTitle}
        message={COPY_COMMON.error}
        action={
          <div className="flex flex-col gap-3">
            <Button size="md" onClick={reset}>
              {COPY_COMMON.tryAgain}
            </Button>
            <Button size="md" variant="secondary" href={TRAVELLER_ROUTES.home}>
              {COPY_COMMON.toExplore}
            </Button>
          </div>
        }
      />
    </TravellerShell>
  );
}
