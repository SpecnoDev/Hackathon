import Link from 'next/link';
import { APP_NAME, ROUTES } from '@/core/constants';
import { Button, EmptyState, HostedLogo } from '@/shared/components';

const COPY = {
  title: 'We could not find that page',
  message: 'The link may be old, or the page may have moved. Start again from the front door.',
  action: 'Go to the home page',
};

/** Every unmatched URL in the app, in the design language rather than the framework's black default. */
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-sand">
      <header className="mx-auto w-full max-w-page px-4 py-4 tablet:px-6">
        <Link href={ROUTES.home} aria-label={APP_NAME}>
          <HostedLogo name={APP_NAME} size="sm" />
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-host flex-1 items-center px-4 tablet:px-6">
        <EmptyState
          illustration="missing"
          title={COPY.title}
          message={COPY.message}
          action={
            <Button href={ROUTES.home} size="md">
              {COPY.action}
            </Button>
          }
        />
      </main>
    </div>
  );
}
