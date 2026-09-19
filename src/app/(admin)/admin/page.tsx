import { AccountStatus, OfferingStatus, PayoutStatus } from '@prisma/client';
import { ROUTES } from '@/core/constants';
import { Figure, PageHeader, QueueList, RecentChanges, StatusBreakdown, type QueueItem, type StatusSegment } from '@/features/admin/components';
import {
  ACCOUNT_STATUS_LABEL,
  ACCOUNT_STATUS_TONE,
  ADMIN_COPY,
  OFFERING_STATUS_LABEL,
  OFFERING_STATUS_TONE,
  RECENT_CHANGES_LIMIT,
} from '@/features/admin/constants';
import { loadAdminOverview, loadAuditTrail } from '@/features/admin/services';
import { statusHref } from '@/features/admin/utils';
import { formatRand } from '@/shared/utils';

export const dynamic = 'force-dynamic';

const COPY = ADMIN_COPY.overview;
/* Hairline gaps between white cells: one surface, three columns, no cards. */
const STRIP = 'grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline tablet:grid-cols-3';

const accountSegments = (counts: Record<AccountStatus, number>, basePath: string): StatusSegment[] =>
  Object.values(AccountStatus).map((status) => ({
    key: status,
    label: ACCOUNT_STATUS_LABEL[status],
    count: counts[status],
    tone: ACCOUNT_STATUS_TONE[status],
    href: statusHref(basePath, status),
  }));

const sum = (counts: Record<string, number>): number => Object.values(counts).reduce((total, count) => total + count, 0);

export default async function AdminOverviewPage() {
  const [overview, recent] = await Promise.all([loadAdminOverview(), loadAuditTrail(undefined, { skip: 0, take: RECENT_CHANGES_LIMIT })]);
  const { hostsByStatus, travellersByStatus, offeringsByStatus, bookingsInFlight, payoutsByStatus, paidOutCents } = overview;

  const queue: QueueItem[] = [
    {
      label: COPY.queue.offeringsInReview,
      count: offeringsByStatus.IN_REVIEW,
      href: statusHref(ROUTES.adminOfferings, OfferingStatus.IN_REVIEW),
      tone: OFFERING_STATUS_TONE.IN_REVIEW,
    },
    { label: COPY.queue.hostsInReview, count: hostsByStatus.IN_REVIEW, href: statusHref(ROUTES.adminHosts, AccountStatus.IN_REVIEW), tone: ACCOUNT_STATUS_TONE.IN_REVIEW },
    {
      label: COPY.queue.travellersInReview,
      count: travellersByStatus.IN_REVIEW,
      href: statusHref(ROUTES.adminTravellers, AccountStatus.IN_REVIEW),
      tone: ACCOUNT_STATUS_TONE.IN_REVIEW,
    },
    { label: COPY.queue.hostsSuspended, count: hostsByStatus.SUSPENDED, href: statusHref(ROUTES.adminHosts, AccountStatus.SUSPENDED), tone: ACCOUNT_STATUS_TONE.SUSPENDED },
    {
      label: COPY.queue.travellersSuspended,
      count: travellersByStatus.SUSPENDED,
      href: statusHref(ROUTES.adminTravellers, AccountStatus.SUSPENDED),
      tone: ACCOUNT_STATUS_TONE.SUSPENDED,
    },
  ];

  const offeringSegments: StatusSegment[] = Object.values(OfferingStatus).map((status) => ({
    key: status,
    label: OFFERING_STATUS_LABEL[status],
    count: offeringsByStatus[status],
    tone: OFFERING_STATUS_TONE[status],
    href: statusHref(ROUTES.adminOfferings, status),
  }));

  return (
    <>
      <PageHeader title={COPY.title} subtitle={COPY.subtitle} />

      <QueueList title={COPY.queue.title} note={COPY.queue.note} clearMessage={COPY.queue.clear} items={queue} />

      <section className="flex flex-col gap-3">
        <h2 className="text-title-lg text-ink">{COPY.glance.title}</h2>
        <div className={STRIP}>
          <StatusBreakdown
            title={COPY.glance.hosts}
            headline={hostsByStatus.ACTIVE}
            headlineLabel={COPY.glance.active}
            totalLabel={COPY.glance.total(sum(hostsByStatus))}
            none={COPY.glance.none}
            segments={accountSegments(hostsByStatus, ROUTES.adminHosts)}
          />
          <StatusBreakdown
            title={COPY.glance.travellers}
            headline={travellersByStatus.ACTIVE}
            headlineLabel={COPY.glance.active}
            totalLabel={COPY.glance.total(sum(travellersByStatus))}
            none={COPY.glance.none}
            segments={accountSegments(travellersByStatus, ROUTES.adminTravellers)}
          />
          <StatusBreakdown
            title={COPY.glance.offerings}
            headline={offeringsByStatus.LIVE}
            headlineLabel={COPY.glance.live}
            totalLabel={COPY.glance.total(sum(offeringsByStatus))}
            none={COPY.glance.none}
            segments={offeringSegments}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-title-lg text-ink">{COPY.money.title}</h2>
        <div className={STRIP}>
          <Figure label={COPY.money.bookingsInFlight} value={String(bookingsInFlight)} note={COPY.money.bookingsNote} />
          <Figure
            label={COPY.money.payoutsPending}
            value={String(payoutsByStatus[PayoutStatus.PENDING].count)}
            note={COPY.money.amountNote(formatRand(payoutsByStatus[PayoutStatus.PENDING].cents))}
          />
          <Figure label={COPY.money.paidOut} value={formatRand(paidOutCents)} note={COPY.money.paidOutNote(payoutsByStatus[PayoutStatus.SENT].count)} money />
        </div>
      </section>

      <RecentChanges title={COPY.recent.title} allLabel={COPY.recent.all} allHref={ROUTES.adminAudit} empty={COPY.recent.empty} entries={recent.rows} />
    </>
  );
}
