import type { AccountStatus, OfferingStatus } from '@prisma/client';
import { StatusPill } from '@/shared/components';
import {
  ACCOUNT_STATUS_LABEL,
  ACCOUNT_STATUS_TONE,
  OFFERING_STATUS_LABEL,
  OFFERING_STATUS_TONE,
} from '../constants';

export const AccountStatusPill = ({ status }: { status: AccountStatus }) => (
  <StatusPill density="traveller" tone={ACCOUNT_STATUS_TONE[status]} label={ACCOUNT_STATUS_LABEL[status]} />
);

export const OfferingStatusPill = ({ status }: { status: OfferingStatus }) => (
  <StatusPill density="traveller" tone={OFFERING_STATUS_TONE[status]} label={OFFERING_STATUS_LABEL[status]} />
);
