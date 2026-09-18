import { redirect } from 'next/navigation';
import { ROUTES } from '@/core/constants';

/** One door for both: signing in and signing up are the same code-by-email flow. */
export default function SignupPage() {
  redirect(ROUTES.login);
}
