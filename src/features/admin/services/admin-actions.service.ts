import { AccountStatus, AdminAction, OfferingStatus, Prisma, VerificationTier } from '@prisma/client';
import {
  ADMIN_ACTIONS,
  ADMIN_SUBJECT_TYPES,
  API_ERROR_CODES,
  HTTP_STATUS,
  RESTRICTED_ACCOUNT_STATUSES,
  adminActionName,
  adminActionPrefix,
} from '@/core/constants';
import { prisma } from '@/core/services';
import { ApiError } from '@/core/utils';
import type { AdminActionQueryDto } from '@/shared/dto';

/**
 * Every write here is a transaction that closes over its own AdminAction row: the trail and the
 * change land together or neither does, so the log can never claim something the data denies.
 */
type Tx = Prisma.TransactionClient;

const notFound = (subject: string): ApiError =>
  new ApiError(API_ERROR_CODES.notFound, HTTP_STATUS.notFound, `${subject} not found`);

const accountStatusChange = (status: AccountStatus, reason: string | null) => ({
  status,
  statusReason: reason,
  statusChangedAt: new Date(),
});

const logAction = (
  tx: Tx,
  entry: { actorEmail: string; action: string; subjectType: string; subjectId: string; reason: string | null },
) => tx.adminAction.create({ data: entry });

export interface HostStatusResult {
  id: string;
  status: AccountStatus;
  pausedOfferings: number;
}

export const setHostStatus = (
  hostId: string,
  status: AccountStatus,
  reason: string | null,
  actorEmail: string,
): Promise<HostStatusResult> =>
  prisma.$transaction(async (tx) => {
    const { count } = await tx.host.updateMany({ where: { id: hostId }, data: accountStatusChange(status, reason) });
    if (!count) throw notFound('Host');

    // A host who is off the platform must not stay bookable. Reinstating them does not undo this:
    // republishing a listing is the host's own decision, taken one listing at a time.
    const pausedOfferings = RESTRICTED_ACCOUNT_STATUSES.includes(status)
      ? (
          await tx.offering.updateMany({
            where: { hostId, status: OfferingStatus.LIVE },
            data: { status: OfferingStatus.PAUSED },
          })
        ).count
      : 0;

    await logAction(tx, {
      actorEmail,
      action: adminActionName(ADMIN_ACTIONS.hostStatus, status),
      subjectType: ADMIN_SUBJECT_TYPES.host,
      subjectId: hostId,
      reason,
    });

    return { id: hostId, status, pausedOfferings };
  });

export const setTravellerStatus = (
  travellerId: string,
  status: AccountStatus,
  reason: string | null,
  actorEmail: string,
): Promise<{ id: string; status: AccountStatus }> =>
  prisma.$transaction(async (tx) => {
    const { count } = await tx.traveller.updateMany({
      where: { id: travellerId },
      data: accountStatusChange(status, reason),
    });
    if (!count) throw notFound('Traveller');

    await logAction(tx, {
      actorEmail,
      action: adminActionName(ADMIN_ACTIONS.travellerStatus, status),
      subjectType: ADMIN_SUBJECT_TYPES.traveller,
      subjectId: travellerId,
      reason,
    });

    return { id: travellerId, status };
  });

/** The manual KYC override. A new tier never republishes a listing — `goLiveStatus` is re-run only when the host resubmits. */
export const setVerificationTier = (
  hostId: string,
  tier: VerificationTier,
  reason: string | null,
  actorEmail: string,
): Promise<{ id: string; tier: VerificationTier }> =>
  prisma.$transaction(async (tx) => {
    const { count } = await tx.host.updateMany({ where: { id: hostId }, data: { tier } });
    if (!count) throw notFound('Host');

    await logAction(tx, {
      actorEmail,
      action: adminActionName(ADMIN_ACTIONS.verificationTier, tier),
      subjectType: ADMIN_SUBJECT_TYPES.host,
      subjectId: hostId,
      reason,
    });

    return { id: hostId, tier };
  });

export const setOfferingStatus = (
  offeringId: string,
  status: OfferingStatus,
  reason: string | null,
  actorEmail: string,
): Promise<{ id: string; status: OfferingStatus }> =>
  prisma.$transaction(async (tx) => {
    const { count } = await tx.offering.updateMany({ where: { id: offeringId }, data: { status } });
    if (!count) throw notFound('Offering');

    await logAction(tx, {
      actorEmail,
      action: adminActionName(ADMIN_ACTIONS.offeringStatus, status),
      subjectType: ADMIN_SUBJECT_TYPES.offering,
      subjectId: offeringId,
      reason,
    });

    return { id: offeringId, status };
  });

export const listAdminActions = ({ limit, action }: AdminActionQueryDto): Promise<AdminAction[]> =>
  prisma.adminAction.findMany({
    where: action ? { action: { startsWith: adminActionPrefix(action) } } : undefined,
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
