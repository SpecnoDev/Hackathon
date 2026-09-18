import Link from 'next/link';
import { ADMIN_ACTIONS, type AdminActionType } from '@/core/constants';
import { AuditTable } from '@/features/admin/components';
import { ADMIN_ACTION_TYPE_LABELS, AUDIT_COPY, auditFilterHref } from '@/features/admin/constants';
import { loadAuditTrail } from '@/features/admin/services';
import { Icon } from '@/shared/components';
import { adminActionQuerySchema } from '@/shared/dto';

export const dynamic = 'force-dynamic';

const FILTER_ICON_PX = 16;

const FILTERS: readonly { action?: AdminActionType; label: string }[] = [
  { label: AUDIT_COPY.allActions },
  ...Object.values(ADMIN_ACTIONS).map((action) => ({ action, label: ADMIN_ACTION_TYPE_LABELS[action] })),
];

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminAuditPage({ searchParams }: PageProps) {
  // A hand-edited query string must not 500 the screen someone opened mid-incident.
  const query = adminActionQuerySchema.safeParse(await searchParams).data ?? adminActionQuerySchema.parse({});
  const entries = await loadAuditTrail(query);

  return (
    <>
      <h1 className="font-display text-display-md text-ink">{AUDIT_COPY.title}</h1>
      <p className="mt-2 text-body-md text-muted">{AUDIT_COPY.subtitle}</p>
      <nav aria-label={AUDIT_COPY.filterLabel} className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map(({ action, label }) => {
          const selected = action === query.action;

          return (
            <Link
              key={label}
              href={auditFilterHref(action)}
              aria-current={selected ? 'page' : undefined}
              className={`inline-flex min-h-12 items-center gap-2 rounded-full px-4 text-button-sm ${selected ? 'bg-ink text-on-dark' : 'bg-canvas text-ink'}`}
            >
              {selected ? <Icon name="check" size={FILTER_ICON_PX} /> : null}
              {label}
            </Link>
          );
        })}
      </nav>
      <AuditTable entries={entries} emptyMessage={query.action ? AUDIT_COPY.emptyFiltered : AUDIT_COPY.empty} />
    </>
  );
}
