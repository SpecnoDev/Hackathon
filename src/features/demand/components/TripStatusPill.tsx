import { StatusPill, type StatusTone } from '@/shared/components';
import type { BookingSummary } from '@/shared/dto';

const STATUS_LABEL: Record<BookingSummary['status'], string> = {
  REQUESTED: 'Waiting for host',
  CONFIRMED: 'Confirmed',
  DECLINED: 'Declined',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const STATUS_TONE: Record<BookingSummary['status'], StatusTone> = {
  REQUESTED: 'review',
  CONFIRMED: 'live',
  DECLINED: 'rejected',
  COMPLETED: 'live',
  CANCELLED: 'paused',
};

export const BookingStatusPill = ({ status }: { status: BookingSummary['status'] }) => (
  <StatusPill tone={STATUS_TONE[status]} label={STATUS_LABEL[status]} density="traveller" />
);
