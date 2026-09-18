import Link from 'next/link';
import { OfferingStatus } from '@prisma/client';
import { ROUTES, isAccountActive } from '@/core/constants';
import { updateOfferingStatus } from '@/features/admin/actions';
import {
  AccountStatusPill,
  AdminCell,
  AdminRow,
  AdminTable,
  ConfirmDecision,
  OfferingStatusPill,
  StatusFilter,
} from '@/features/admin/components';
import {
  ADMIN_COPY,
  ALL_STATUSES_FILTER,
  OFFERING_CATEGORY_LABEL,
  OFFERING_DECISIONS,
  OFFERING_QUEUE_DECISIONS,
  OFFERING_STATUS_LABEL,
  STATUS_FILTER_PARAM,
  adminHostPath,
} from '@/features/admin/constants';
import { listAdminOfferings } from '@/features/admin/services';
import { statusFilterOptions, statusFromQuery } from '@/features/admin/utils';
import { EmptyState, Pagination } from '@/shared/components';
import { OFFERING_STATUSES, readPagination, toPageRange } from '@/shared/dto';
import { formatRand } from '@/shared/utils';

export const dynamic = 'force-dynamic';

const COPY = ADMIN_COPY.offerings;
const COLUMNS = Object.values(COPY.columns);
const FILTERS = statusFilterOptions(OFFERING_STATUSES, OFFERING_STATUS_LABEL);

export default async function AdminOfferingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const requested = query[STATUS_FILTER_PARAM];
  // A moderation queue opens on the work: everything else has to be asked for.
  const status =
    requested === ALL_STATUSES_FILTER
      ? undefined
      : (statusFromQuery(requested, OFFERING_STATUSES) ?? OfferingStatus.IN_REVIEW);
  const pagination = readPagination(query);
  const { rows: offerings, total } = await listAdminOfferings(status, toPageRange(pagination));

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-display-md text-ink">{COPY.title}</h1>
        <p className="text-body-md text-muted">{COPY.subtitle}</p>
      </header>

      <StatusFilter basePath={ROUTES.adminOfferings} options={FILTERS} active={status ?? ALL_STATUSES_FILTER} />

      {total === 0 ? (
        <EmptyState illustration="offerings" title={COPY.empty.title} message={COPY.empty.message} />
      ) : (
        <>
          <AdminTable columns={COLUMNS}>
            {offerings.map(({ id, title, host, town, category, priceCents, status: offeringStatus }) => {
              const decide = updateOfferingStatus.bind(null, id);
              const decisions = OFFERING_QUEUE_DECISIONS[offeringStatus];

              return (
                <AdminRow key={id}>
                  <AdminCell>{title}</AdminCell>
                  <AdminCell>
                    <Link href={adminHostPath(host.id)} className="text-link text-primary-text underline">
                      {host.fullName}
                    </Link>
                    {isAccountActive(host.status) ? null : (
                      <span className="mt-1 block">
                        <AccountStatusPill status={host.status} />
                      </span>
                    )}
                  </AdminCell>
                  <AdminCell muted>{town}</AdminCell>
                  <AdminCell muted>{OFFERING_CATEGORY_LABEL[category]}</AdminCell>
                  <AdminCell muted>{formatRand(priceCents)}</AdminCell>
                  <AdminCell>
                    <OfferingStatusPill status={offeringStatus} />
                  </AdminCell>
                  <AdminCell muted>
                    {decisions.length === 0 ? (
                      COPY.noActions
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {decisions.map((key) => (
                          <ConfirmDecision key={key} decision={OFFERING_DECISIONS[key]} action={decide} />
                        ))}
                      </div>
                    )}
                  </AdminCell>
                </AdminRow>
              );
            })}
          </AdminTable>
          <Pagination
            total={total}
            page={pagination.page}
            size={pagination.size}
            basePath={ROUTES.adminOfferings}
            query={{ [STATUS_FILTER_PARAM]: status ?? ALL_STATUSES_FILTER }}
          />
        </>
      )}
    </div>
  );
}
