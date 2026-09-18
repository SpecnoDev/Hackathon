import { Button, EmptyState } from '@/shared/components';
import { HOST_COPY } from '../constants';
import { HostScreen } from './HostScreen';

interface MissingNoticeProps {
  barTitle: string;
  message: string;
  backHref: string;
  backLabel: string;
}

/** A stale link or a deleted record lands here: what happened and where to go, in one sentence and one button. */
export const MissingNotice = ({ barTitle, message, backHref, backLabel }: MissingNoticeProps) => (
  <HostScreen barTitle={barTitle} barTitleIsHeading backHref={backHref}>
    <EmptyState illustration="missing" title={HOST_COPY.common.notFoundTitle} message={message} action={<Button href={backHref}>{backLabel}</Button>} />
  </HostScreen>
);
