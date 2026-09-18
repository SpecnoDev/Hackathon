import type { AccountStatus, AdminAction, OfferingStatus } from '@prisma/client';
import type { AdminSubjectType } from '@/core/constants';
import { prisma } from '@/core/services';
import { ADMIN_LIST_LIMIT } from '../constants';

/**
 * Every read the back-office screens make. Each list is capped and each row carries the status
 * the operator decides on, so a screen never needs a second query per row to know what to offer.
 */
export const listAdminHosts = (status?: AccountStatus) =>
  prisma.host.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
    take: ADMIN_LIST_LIMIT,
    select: {
      id: true,
      fullName: true,
      phone: true,
      serviceArea: true,
      tier: true,
      status: true,
      _count: { select: { offerings: true } },
    },
  });

/** The ID hash and document path are deliberately not selected: an operator never needs them to decide. */
export const loadAdminHost = (id: string) =>
  prisma.host.findUnique({
    where: { id },
    select: {
      id: true,
      fullName: true,
      phone: true,
      serviceArea: true,
      story: true,
      tier: true,
      status: true,
      statusReason: true,
      statusChangedAt: true,
      payoutChannel: true,
      createdAt: true,
      offerings: {
        orderBy: { createdAt: 'desc' },
        take: ADMIN_LIST_LIMIT,
        select: { id: true, title: true, status: true, category: true, town: true, priceCents: true },
      },
    },
  });

export const listAdminTravellers = (status?: AccountStatus) =>
  prisma.traveller.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
    take: ADMIN_LIST_LIMIT,
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      statusReason: true,
      _count: { select: { bookings: true } },
    },
  });

export const listAdminOfferings = (status?: OfferingStatus) =>
  prisma.offering.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
    take: ADMIN_LIST_LIMIT,
    select: {
      id: true,
      title: true,
      status: true,
      category: true,
      priceCents: true,
      town: true,
      host: { select: { id: true, fullName: true, status: true } },
    },
  });

/** The trail for one person, for the detail screen; the whole trail lives on the audit page. */
export const listSubjectActions = (
  subjectType: AdminSubjectType,
  subjectId: string,
  limit: number,
): Promise<AdminAction[]> =>
  prisma.adminAction.findMany({ where: { subjectType, subjectId }, orderBy: { createdAt: 'desc' }, take: limit });
