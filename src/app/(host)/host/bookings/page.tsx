import { HostPlaceholder } from '@/core/layout';

// TODO(Marlon): booking requests with accept and decline, from GET /api/v1/bookings?role=host.
export default function HostBookingsPage() {
  return (
    <HostPlaceholder title="Bookings" note="Requests from travellers, with accept and decline, land here." />
  );
}
