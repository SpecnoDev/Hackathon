import { TravellerShell } from '@/core/layout';
import { COPY_COMMON, TRAVELLER_ROUTES } from '@/features/demand/constants';
import { Button, EmptyState } from '@/shared/components';

export default function TravellerNotFound() {
  return (
    <TravellerShell width="column">
      <EmptyState
        illustration="missing"
        title={COPY_COMMON.notFoundTitle}
        message={COPY_COMMON.notFound}
        action={
          <Button size="md" variant="secondary" href={TRAVELLER_ROUTES.home}>
            {COPY_COMMON.toExplore}
          </Button>
        }
      />
    </TravellerShell>
  );
}
