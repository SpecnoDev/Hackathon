import { listHostsForAdmin } from '@/features/admin/services';

export const dynamic = 'force-dynamic';

export default async function AdminHostsPage() {
  const hosts = await listHostsForAdmin();

  return (
    <>
      <h1 className="font-display text-display-md text-ink">Hosts</h1>
      <table className="mt-6 w-full border-collapse overflow-hidden rounded-md border border-hairline bg-canvas text-left">
        <thead className="border-b border-hairline">
          <tr className="text-caption text-muted">
            <th className="p-3">Name</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Area</th>
            <th className="p-3">Tier</th>
            <th className="p-3">Offerings</th>
          </tr>
        </thead>
        <tbody className="text-body-sm text-ink">
          {hosts.map(({ id, fullName, phone, serviceArea, tier, _count }) => (
            <tr key={id} className="border-b border-hairline-soft last:border-0">
              <td className="p-3">{fullName}</td>
              <td className="p-3">{phone}</td>
              <td className="p-3">{serviceArea}</td>
              <td className="p-3">{tier.toLowerCase()}</td>
              <td className="p-3">{_count.offerings}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {hosts.length === 0 && <p className="mt-4 text-body-sm text-muted">No hosts yet.</p>}
    </>
  );
}
