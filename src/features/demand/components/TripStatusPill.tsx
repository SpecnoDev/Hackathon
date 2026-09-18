import { StatusPill } from '@/shared/components';
import { COPY_COMMON, TRIP_STATUS_PILL } from '../constants';
import type { TripStatus } from '../interfaces';

export const TripStatusPill = ({ status }: { status: TripStatus }) => (
  <StatusPill tone={TRIP_STATUS_PILL[status].tone} icon={TRIP_STATUS_PILL[status].icon} label={COPY_COMMON.tripStatus[status]} density="traveller" />
);
