import { ROUTES } from '@/core/constants';
import { updateTravellerStatus } from '@/features/admin/actions';
import {
  AccountStatusPill,
  AdminCell,
  AdminRow,
  AdminTable,
  ConfirmDecision,
  StatusFilter,
} from '@/features/admin/components';
import {
  ACCOUNT_DECISIONS,
  ACCOUNT_STATUS_LABEL,
  ADMIN_COPY,
  ALL_STATUSES_FILTER,
  STATUS_FILTER_PARAM,
  TRAVELLER_DECISIONS,
} from '@/features/admin/constants';
import { listAdminTravellers } from '@/features/admin/services';
import { statusFilterOptions, statusFromQuery } from '@/features/admin/utils';
import { EmptyState, Pagination } from '@/shared/components';
import { ACCOUNT_STATUSES, readPagination, toPageRange } from '@/shared/dto';

export const dynamic = 'force-dynamic';

const COPY = ADMIN_COPY.travellers;
const COLUMNS = Object.values(COPY.columns);
const FILTERS = statusFilterOptions(ACCOUNT_STATUSES, ACCOUNT_STATUS_LABEL);

export default async function AdminTravellersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const status = statusFromQuery(query[STATUS_FILTER_PARAM], ACCOUNT_STATUSES);
  const pagination = readPagination(query);
  const { rows: travellers, total } = await listAdminTravellers(status, toPageRange(pagination));

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-display-md text-ink">{COPY.title}</h1>
        <p className="text-body-md text-muted">{COPY.subtitle}</p>
      </header>

      <StatusFilter basePath={ROUTES.adminTravellers} options={FILTERS} active={status ?? ALL_STATUSES_FILTER} />

      {total === 0 ? (
        <EmptyState illustration="missing" title={COPY.empty.title} message={COPY.empty.message} />
      ) : (
        <>
          <AdminTable columns={COLUMNS}>
            {travellers.map(({ id, name, email, status: travellerStatus, statusReason, _count }) => {
              const decide = updateTravellerStatus.bind(null, id);

              return (
                <AdminRow key={id}>
                  <AdminCell>{name}</AdminCell>
                  <AdminCell muted>{email}</AdminCell>
                  <AdminCell muted>{_count.bookings}</AdminCell>
                  <AdminCell>
                    <AccountStatusPill status={travellerStatus} />
                    {statusReason ? (
                      <p className="mt-1 text-caption text-muted">{ADMIN_COPY.host.reasonOnRecord(statusReason)}</p>
                    ) : null}
                  </AdminCell>
                  <AdminCell>
                    <div className="flex flex-wrap gap-2">
                      {TRAVELLER_DECISIONS[travellerStatus].map((key) => (
                        <ConfirmDecision key={key} decision={ACCOUNT_DECISIONS[key]} action={decide} />
                      ))}
                    </div>
                  </AdminCell>
                </AdminRow>
              );
            })}
          </AdminTable>
          <Pagination
            total={total}
            page={pagination.page}
            size={pagination.size}
            basePath={ROUTES.adminTravellers}
            query={{ [STATUS_FILTER_PARAM]: status }}
          />
        </>
      )}
    </div>
  );
}
