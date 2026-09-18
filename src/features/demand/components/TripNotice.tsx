import { Button, EmptyState } from '@/shared/components';
import { COPY_COMMON } from '../constants';
import { TravellerScreen } from './TravellerScreen';

interface TripNoticeProps {
  barTitle: string;
  /** Defaults to "We could not find that". Set it when the trip exists but is in the wrong state for the screen. */
  title?: string;
  message: string;
  backHref: string;
  backLabel: string;
}

/** A stale link, or a trip in the wrong state for the screen, lands here: what happened and where to go, in one sentence and one button. */
export const TripNotice = ({ barTitle, title = COPY_COMMON.notFoundTitle, message, backHref, backLabel }: TripNoticeProps) => (
  <TravellerScreen barTitle={barTitle} backHref={backHref} width="column">
    <EmptyState
      illustration="missing"
      title={title}
      message={message}
      action={
        <Button size="md" variant="secondary" href={backHref}>
          {backLabel}
        </Button>
      }
    />
  </TravellerScreen>
);
