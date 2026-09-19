import { Button, EmptyState } from '@/shared/components';
import { COPY_COMMON } from '../constants';
import { TravellerScreen } from './TravellerScreen';

interface BookingNoticeProps {
  barTitle: string;
  /** Defaults to "We could not find that". Set it when the booking exists but is in the wrong state for the screen. */
  title?: string;
  message: string;
  backHref: string;
  backLabel: string;
}

/** A stale link, or a booking in the wrong state for the screen: what happened and where to go, in one sentence and one button. */
export const BookingNotice = ({ barTitle, title = COPY_COMMON.notFoundTitle, message, backHref, backLabel }: BookingNoticeProps) => (
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
