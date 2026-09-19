import Link from 'next/link';
import { ROUTES } from '@/core/constants';
import { AccountStatusPill, AdminCell, AdminRow, AdminTable, ListSurface, PageHeader, StatusFilter } from '@/features/admin/components';
import {
  ACCOUNT_STATUS_LABEL,
  ADMIN_COPY,
  ALL_STATUSES_FILTER,
  STATUS_FILTER_PARAM,
  VERIFICATION_TIER_LABEL,
  adminHostPath,
} from '@/features/admin/constants';
import { listAdminHosts } from '@/features/admin/services';
import { statusFilterOptions, statusFromQuery } from '@/features/admin/utils';
import { EmptyState, Pagination } from '@/shared/components';
import { ACCOUNT_STATUSES, readPagination, toPageRange } from '@/shared/dto';

export const dynamic = 'force-dynamic';

const COPY = ADMIN_COPY.hosts;
const COLUMNS = Object.values(COPY.columns);
const FILTERS = statusFilterOptions(ACCOUNT_STATUSES, ACCOUNT_STATUS_LABEL);

export default async function AdminHostsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const query = await searchParams;
  const status = statusFromQuery(query[STATUS_FILTER_PARAM], ACCOUNT_STATUSES);
  const pagination = readPagination(query);
  const { rows: hosts, total } = await listAdminHosts(status, toPageRange(pagination));

  return (
    <>
      <PageHeader title={COPY.title} subtitle={COPY.subtitle} />

      <ListSurface
        toolbar={<StatusFilter basePath={ROUTES.adminHosts} options={FILTERS} active={status ?? ALL_STATUSES_FILTER} />}
        meta={COPY.count(total)}
        footer={
          total > 0 ? (
            <Pagination total={total} page={pagination.page} size={pagination.size} basePath={ROUTES.adminHosts} query={{ [STATUS_FILTER_PARAM]: status }} />
          ) : undefined
        }
      >
        {total === 0 ? (
          <div className="px-6">
            <EmptyState illustration="missing" title={COPY.empty.title} message={COPY.empty.message} />
          </div>
        ) : (
          <AdminTable columns={COLUMNS}>
            {hosts.map(({ id, fullName, phone, serviceArea, tier, status: hostStatus, _count }) => (
              <AdminRow key={id}>
                <AdminCell>
                  <Link href={adminHostPath(id)} className="text-link text-primary-text underline">
                    {fullName}
                  </Link>
                </AdminCell>
                <AdminCell muted>{phone}</AdminCell>
                <AdminCell muted>{serviceArea}</AdminCell>
                <AdminCell muted>{VERIFICATION_TIER_LABEL[tier]}</AdminCell>
                <AdminCell>
                  <AccountStatusPill status={hostStatus} />
                </AdminCell>
                <AdminCell muted>{_count.offerings}</AdminCell>
              </AdminRow>
            ))}
          </AdminTable>
        )}
      </ListSurface>
    </>
  );
}
