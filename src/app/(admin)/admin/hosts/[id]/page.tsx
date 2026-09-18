import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ADMIN_SUBJECT_TYPES, ROUTES } from '@/core/constants';
import { updateHostStatus, updateHostTier } from '@/features/admin/actions';
import {
  AccountStatusPill,
  AdminCell,
  AdminRow,
  AdminTable,
  ConfirmDecision,
  OfferingStatusPill,
  Panel,
  SubjectHistory,
  TierOverride,
} from '@/features/admin/components';
import {
  ACCOUNT_DECISIONS,
  ADMIN_COPY,
  ADMIN_DATE,
  ADMIN_HISTORY_LIMIT,
  ADMIN_TIMESTAMP,
  HOST_DECISIONS,
  OFFERING_CATEGORY_LABEL,
  PAYOUT_CHANNEL_LABEL,
  VERIFICATION_TIER_LABEL,
} from '@/features/admin/constants';
import { listSubjectActions, loadAdminHost } from '@/features/admin/services';
import { Icon } from '@/shared/components';
import { formatRand } from '@/shared/utils';

export const dynamic = 'force-dynamic';

const COPY = ADMIN_COPY.host;
const OFFERING_COLUMNS = Object.values(COPY.offeringColumns);
const BACK_ICON_PX = 16;

const Fact = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1">
    <dt className="text-caption text-muted">{label}</dt>
    <dd className="text-body-md text-ink">{value}</dd>
  </div>
);

export default async function AdminHostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [host, history] = await Promise.all([
    loadAdminHost(id),
    listSubjectActions(ADMIN_SUBJECT_TYPES.host, id, ADMIN_HISTORY_LIMIT),
  ]);
  if (!host) notFound();

  const decide = updateHostStatus.bind(null, host.id);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <Link href={ROUTES.adminHosts} className="inline-flex items-center gap-1 text-link text-primary-text underline">
          <Icon name="chevron-left" size={BACK_ICON_PX} />
          {COPY.back}
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-display-md text-ink">{host.fullName}</h1>
          <AccountStatusPill status={host.status} />
          <span className="text-body-sm text-muted">{VERIFICATION_TIER_LABEL[host.tier]}</span>
        </div>
        {host.statusReason ? <p className="text-body-md text-body">{COPY.reasonOnRecord(host.statusReason)}</p> : null}
        {host.statusChangedAt ? (
          <p className="text-caption text-muted">{COPY.changedAt(ADMIN_TIMESTAMP.format(host.statusChangedAt))}</p>
        ) : null}
      </header>

      <div className="grid gap-6 desktop:grid-cols-3">
        <div className="flex flex-col gap-6">
          <Panel title={COPY.actions} note={COPY.actionsNote}>
            <div className="flex flex-wrap gap-3">
              {HOST_DECISIONS[host.status].map((key) => (
                <ConfirmDecision key={key} decision={ACCOUNT_DECISIONS[key]} action={decide} />
              ))}
            </div>
          </Panel>

          <Panel title={COPY.profile}>
            <dl className="grid grid-cols-2 gap-4">
              <Fact label={COPY.fields.phone} value={host.phone} />
              <Fact label={COPY.fields.area} value={host.serviceArea} />
              <Fact label={COPY.fields.joined} value={ADMIN_DATE.format(host.createdAt)} />
              <Fact
                label={COPY.fields.payout}
                value={host.payoutChannel ? PAYOUT_CHANNEL_LABEL[host.payoutChannel] : COPY.noPayout}
              />
            </dl>
            <p className="text-body-md text-body">{host.story ?? COPY.noStory}</p>
          </Panel>

          <Panel title={COPY.tier} note={COPY.tierNote}>
            <TierOverride tier={host.tier} action={updateHostTier.bind(null, host.id)} />
          </Panel>
        </div>

        <div className="flex flex-col gap-6 desktop:col-span-2">
          <section className="flex flex-col gap-3">
            <h2 className="text-title-md text-ink">{COPY.offerings}</h2>
            {host.offerings.length === 0 ? (
              <p className="rounded-lg border border-hairline bg-canvas p-6 text-body-md text-muted">{COPY.noOfferings}</p>
            ) : (
              <AdminTable columns={OFFERING_COLUMNS}>
                {host.offerings.map(({ id: offeringId, title, category, town, priceCents, status }) => (
                  <AdminRow key={offeringId}>
                    <AdminCell>{title}</AdminCell>
                    <AdminCell muted>{OFFERING_CATEGORY_LABEL[category]}</AdminCell>
                    <AdminCell muted>{town}</AdminCell>
                    <AdminCell muted>{formatRand(priceCents)}</AdminCell>
                    <AdminCell>
                      <OfferingStatusPill status={status} />
                    </AdminCell>
                  </AdminRow>
                ))}
              </AdminTable>
            )}
          </section>

          <Panel title={COPY.history}>
            <SubjectHistory entries={history} subjectName={host.fullName} emptyMessage={COPY.noHistory} />
          </Panel>
        </div>
      </div>
    </div>
  );
}
