import { listOfferingsForAdmin } from '@/features/admin/services';
import { formatRand } from '@/shared/utils';

export const dynamic = 'force-dynamic';

export default async function AdminOfferingsPage() {
  const offerings = await listOfferingsForAdmin();

  return (
    <>
      <h1 className="font-display text-display-md text-ink">Offerings</h1>
      <table className="mt-6 w-full border-collapse overflow-hidden rounded-md border border-hairline bg-canvas text-left">
        <thead className="border-b border-hairline">
          <tr className="text-caption text-muted">
            <th className="p-3">Title</th>
            <th className="p-3">Host</th>
            <th className="p-3">Town</th>
            <th className="p-3">Category</th>
            <th className="p-3">Status</th>
            <th className="p-3">Price</th>
          </tr>
        </thead>
        <tbody className="text-body-sm text-ink">
          {offerings.map(({ id, title, host, town, category, status, priceCents }) => (
            <tr key={id} className="border-b border-hairline-soft last:border-0">
              <td className="p-3">{title}</td>
              <td className="p-3">{host.fullName}</td>
              <td className="p-3">{town}</td>
              <td className="p-3">{category.toLowerCase()}</td>
              <td className="p-3">{status.toLowerCase().replace(/_/g, ' ')}</td>
              <td className="p-3">{formatRand(priceCents)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {offerings.length === 0 && <p className="mt-4 text-body-sm text-muted">No offerings yet.</p>}
    </>
  );
}
