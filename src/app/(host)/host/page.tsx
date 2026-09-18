import { redirect } from 'next/navigation';
import { HOST_ROUTES } from '@/features/supply/constants';

export default function Page() {
  redirect(HOST_ROUTES.offerings.list);
}
