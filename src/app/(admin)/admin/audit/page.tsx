import { ADMIN_ACTIONS, ADMIN_ACTION_QUERY_PARAM, ROUTES, type AdminActionType } from '@/core/constants';
import { AuditTable, FilterChips, ListSurface, PageHeader } from '@/features/admin/components';
import { ADMIN_ACTION_TYPE_LABELS, AUDIT_COPY, auditFilterHref } from '@/features/admin/constants';
import { loadAuditTrail } from '@/features/admin/services';
import { Pagination } from '@/shared/components';
import { readPagination, toPageRange } from '@/shared/dto';

export const dynamic = 'force-dynamic';

const FILTERS: readonly { action?: AdminActionType; label: string }[] = [
  { label: AUDIT_COPY.allActions },
  ...Object.values(ADMIN_ACTIONS).map((action) => ({ action, label: ADMIN_ACTION_TYPE_LABELS[action] })),
];

const ACTION_TYPES: readonly AdminActionType[] = Object.values(ADMIN_ACTIONS);

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminAuditPage({ searchParams }: PageProps) {
  const query = await searchParams;
  // A hand-edited query string must not 500 the screen someone opened mid-incident.
  const action = ACTION_TYPES.find((value) => value === query[ADMIN_ACTION_QUERY_PARAM]);
  const pagination = readPagination(query);
  const { rows: entries, total } = await loadAuditTrail(action, toPageRange(pagination));

  return (
    <>
      <PageHeader title={AUDIT_COPY.title} subtitle={AUDIT_COPY.subtitle} />

      <ListSurface
        toolbar={
          <FilterChips
            label={AUDIT_COPY.filterLabel}
            chips={FILTERS.map(({ action: value, label }) => ({ href: auditFilterHref(value), label, selected: value === action }))}
          />
        }
        meta={AUDIT_COPY.count(total)}
        footer={
          total > 0 ? (
            <Pagination total={total} page={pagination.page} size={pagination.size} basePath={ROUTES.adminAudit} query={{ [ADMIN_ACTION_QUERY_PARAM]: action }} />
          ) : undefined
        }
      >
        {entries.length === 0 ? (
          <p className="px-6 py-8 text-body-md text-muted">{action ? AUDIT_COPY.emptyFiltered : AUDIT_COPY.empty}</p>
        ) : (
          <AuditTable entries={entries} />
        )}
      </ListSurface>
    </>
  );
}
