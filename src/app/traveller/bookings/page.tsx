import { redirect } from 'next/navigation';
import { ROUTES } from '@/core/constants';

/** Bookings has no tab of its own — it lives inside Trips. Kept as a redirect so an old link still lands somewhere real. */
export default function BookingsPage() {
  redirect(ROUTES.trips);
}
