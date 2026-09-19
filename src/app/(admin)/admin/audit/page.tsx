import Link from 'next/link';
import { ADMIN_ACTIONS, ADMIN_ACTION_QUERY_PARAM, ROUTES, type AdminActionType } from '@/core/constants';
import { AuditTable } from '@/features/admin/components';
import { ADMIN_ACTION_TYPE_LABELS, AUDIT_COPY, auditFilterHref } from '@/features/admin/constants';
import { loadAuditTrail } from '@/features/admin/services';
import { Icon, Pagination } from '@/shared/components';
import { readPagination, toPageRange } from '@/shared/dto';

export const dynamic = 'force-dynamic';

const FILTER_ICON_PX = 16;
const CHIP = 'inline-flex min-h-12 items-center gap-2 rounded-sm px-4 text-button-sm';

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
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-display-md text-ink">{AUDIT_COPY.title}</h1>
        <p className="text-body-md text-muted">{AUDIT_COPY.subtitle}</p>
      </header>

      <nav aria-label={AUDIT_COPY.filterLabel} className="flex flex-wrap gap-2">
        {FILTERS.map(({ action: value, label }) => {
          const selected = value === action;

          return (
            <Link
              key={label}
              href={auditFilterHref(value)}
              aria-current={selected ? 'page' : undefined}
              className={`${CHIP} ${selected ? 'bg-primary text-on-primary' : 'bg-surface-soft text-ink'}`}
            >
              {selected ? <Icon name="check" size={FILTER_ICON_PX} /> : null}
              {label}
            </Link>
          );
        })}
      </nav>

      <AuditTable entries={entries} emptyMessage={action ? AUDIT_COPY.emptyFiltered : AUDIT_COPY.empty} />

      {total > 0 ? (
        <Pagination
          total={total}
          page={pagination.page}
          size={pagination.size}
          basePath={ROUTES.adminAudit}
          query={{ [ADMIN_ACTION_QUERY_PARAM]: action }}
        />
      ) : null}
    </div>
  );
}
