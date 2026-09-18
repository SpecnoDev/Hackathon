import { AccountStatus, OfferingStatus, PayoutStatus } from '@prisma/client';
import { ROUTES } from '@/core/constants';
import { StatSection, StatTile } from '@/features/admin/components';
import { ACCOUNT_STATUS_LABEL, ADMIN_COPY, OFFERING_STATUS_LABEL } from '@/features/admin/constants';
import { loadAdminOverview } from '@/features/admin/services';
import { statusHref } from '@/features/admin/utils';
import { formatRand } from '@/shared/utils';

export const dynamic = 'force-dynamic';

const COPY = ADMIN_COPY.overview;

export default async function AdminOverviewPage() {
  const { hostsByStatus, travellersByStatus, offeringsByStatus, bookingsInFlight, payoutsByStatus, paidOutCents } =
    await loadAdminOverview();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-display-md text-ink">{COPY.title}</h1>
        <p className="text-body-md text-muted">{COPY.subtitle}</p>
      </header>

      <StatSection title={COPY.hosts}>
        {Object.values(AccountStatus).map((status) => (
          <StatTile
            key={status}
            label={ACCOUNT_STATUS_LABEL[status]}
            value={String(hostsByStatus[status])}
            href={statusHref(ROUTES.adminHosts, status)}
          />
        ))}
      </StatSection>

      <StatSection title={COPY.travellers}>
        {Object.values(AccountStatus).map((status) => (
          <StatTile
            key={status}
            label={ACCOUNT_STATUS_LABEL[status]}
            value={String(travellersByStatus[status])}
            href={statusHref(ROUTES.adminTravellers, status)}
          />
        ))}
      </StatSection>

      <StatSection title={COPY.offerings}>
        {Object.values(OfferingStatus).map((status) => (
          <StatTile
            key={status}
            label={OFFERING_STATUS_LABEL[status]}
            value={String(offeringsByStatus[status])}
            href={statusHref(ROUTES.adminOfferings, status)}
          />
        ))}
      </StatSection>

      <StatSection title={COPY.work}>
        <StatTile label={COPY.bookingsInFlight} value={String(bookingsInFlight)} note={COPY.bookingsNote} />
        <StatTile
          label={COPY.payoutsPending}
          value={String(payoutsByStatus[PayoutStatus.PENDING].count)}
          note={COPY.amountNote(formatRand(payoutsByStatus[PayoutStatus.PENDING].cents))}
        />
        <StatTile
          label={COPY.payoutsSent}
          value={String(payoutsByStatus[PayoutStatus.SENT].count)}
          note={COPY.amountNote(formatRand(payoutsByStatus[PayoutStatus.SENT].cents))}
        />
        <StatTile label={COPY.paidOut} value={formatRand(paidOutCents)} note={COPY.paidOutNote} money />
      </StatSection>
    </div>
  );
}
