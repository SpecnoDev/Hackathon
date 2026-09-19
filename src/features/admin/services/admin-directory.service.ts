import type { AccountStatus, AdminAction, OfferingStatus } from '@prisma/client';
import type { AdminSubjectType } from '@/core/constants';
import { prisma } from '@/core/services';
import type { PageRange } from '@/shared/dto';
import { ADMIN_LIST_LIMIT } from '../constants';

const NEWEST_FIRST = { createdAt: 'desc' } as const;

/**
 * Every read the back-office screens make. Each list comes back with its total so the screen can
 * page it, and each row carries the status the operator decides on, so a screen never needs a
 * second query per row to know what to offer.
 */
export const listAdminHosts = async (status: AccountStatus | undefined, { skip, take }: PageRange) => {
  const where = status ? { status } : undefined;
  const [rows, total] = await prisma.$transaction([
    prisma.host.findMany({
      where,
      orderBy: NEWEST_FIRST,
      skip,
      take,
      select: {
        id: true,
        fullName: true,
        phone: true,
        serviceArea: true,
        tier: true,
        status: true,
        _count: { select: { offerings: true } },
      },
    }),
    prisma.host.count({ where }),
  ]);

  return { rows, total };
};

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
        orderBy: NEWEST_FIRST,
        take: ADMIN_LIST_LIMIT,
        select: { id: true, title: true, status: true, category: true, town: true, priceCents: true },
      },
    },
  });

export const listAdminTravellers = async (status: AccountStatus | undefined, { skip, take }: PageRange) => {
  const where = status ? { status } : undefined;
  const [rows, total] = await prisma.$transaction([
    prisma.traveller.findMany({
      where,
      orderBy: NEWEST_FIRST,
      skip,
      take,
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        statusReason: true,
        _count: { select: { bookings: true } },
      },
    }),
    prisma.traveller.count({ where }),
  ]);

  return { rows, total };
};

export const listAdminOfferings = async (status: OfferingStatus | undefined, { skip, take }: PageRange) => {
  const where = status ? { status } : undefined;
  const [rows, total] = await prisma.$transaction([
    prisma.offering.findMany({
      where,
      orderBy: NEWEST_FIRST,
      skip,
      take,
      select: {
        id: true,
        title: true,
        status: true,
        category: true,
        priceCents: true,
        town: true,
        host: { select: { id: true, fullName: true, status: true } },
      },
    }),
    prisma.offering.count({ where }),
  ]);

  return { rows, total };
};

/** The trail for one person, for the detail screen; the whole trail lives on the audit page. */
export const listSubjectActions = (
  subjectType: AdminSubjectType,
  subjectId: string,
  limit: number,
): Promise<AdminAction[]> =>
  prisma.adminAction.findMany({ where: { subjectType, subjectId }, orderBy: NEWEST_FIRST, take: limit });
