import { loadAdminOverview } from '@/features/admin/services';
import { formatRand } from '@/shared/utils';

export const dynamic = 'force-dynamic';

const Tile = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-md border border-hairline bg-canvas p-4">
    <p className="text-body-sm text-muted">{label}</p>
    <p className="mt-1 text-title-lg text-ink">{value}</p>
  </div>
);

const Group = ({ title, counts }: { title: string; counts: Record<string, number> }) => (
  <section className="mt-8">
    <h2 className="text-title-sm text-ink">{title}</h2>
    <div className="mt-3 grid grid-cols-2 gap-3 tablet:grid-cols-4">
      {Object.entries(counts).map(([label, value]) => (
        <Tile key={label} label={label.toLowerCase().replace(/_/g, ' ')} value={String(value)} />
      ))}
    </div>
  </section>
);

export default async function AdminOverviewPage() {
  const { hostsByTier, offeringsByStatus, bookingsByStatus, paidOutCents } = await loadAdminOverview();

  return (
    <>
      <h1 className="font-display text-display-md text-ink">Overview</h1>
      <div className="mt-4 rounded-md border border-hairline bg-canvas p-4">
        <p className="text-body-sm text-muted">Paid out to hosts</p>
        <p className="mt-1 font-display text-display-md text-ink">{formatRand(paidOutCents)}</p>
      </div>
      <Group title="Hosts by verification tier" counts={hostsByTier} />
      <Group title="Offerings by status" counts={offeringsByStatus} />
      <Group title="Bookings by status" counts={bookingsByStatus} />
    </>
  );
}
