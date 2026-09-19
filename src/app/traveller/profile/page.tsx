import { LANGUAGE_LABELS } from '@/core/constants';
import { requireTravellerPage } from '@/core/guards';
import { signOutTraveller } from '@/features/auth/actions';
import { TravellerScreen } from '@/features/demand/components';
import { Button, DetailFact } from '@/shared/components';

export const metadata = { title: 'Profile' };

export default async function ProfilePage() {
  const { traveller } = await requireTravellerPage();

  return (
    <TravellerScreen pageTitle="Profile" showNav width="column">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-5">
          <span aria-hidden className="flex size-20 shrink-0 items-center justify-center rounded-full bg-surface-strong text-display-lg text-ink">
            {traveller.name.charAt(0).toUpperCase()}
          </span>
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="break-words text-title-lg text-ink">{traveller.name}</h2>
            <p className="text-body-md text-muted">{traveller.email}</p>
          </div>
        </div>

        <ul className="flex flex-col gap-5">
          <DetailFact icon="globe" title="Language">
            {LANGUAGE_LABELS[traveller.language]}
          </DetailFact>
          {traveller.phone ? (
            <DetailFact icon="phone" title="Phone">
              {traveller.phone}
            </DetailFact>
          ) : null}
        </ul>

        <form action={signOutTraveller}>
          <Button type="submit" variant="secondary" size="md">
            Sign out
          </Button>
        </form>
      </div>
    </TravellerScreen>
  );
}
