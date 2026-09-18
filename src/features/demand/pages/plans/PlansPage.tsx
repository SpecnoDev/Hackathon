'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button, EmptyState, Icon, OptionTile, TextInput } from '@/shared/components';
import { TravellerScreen } from '../../components';
import { COPY_ACCOUNT, COPY_EXPLORE, PLAN_NAME_MAX, TRAVELLER_ROUTES } from '../../constants';
import { useTravellerApp } from '../../hooks';
import type { Plan, TravellerAppState } from '../../interfaces';
import { travellerAppStore } from '../../services/client';

const copy = COPY_ACCOUNT.plans.list;
const planCopy = COPY_EXPLORE.plan;
const selectPlans = (state: TravellerAppState): Plan[] => state.plans;

/** Screen 20, the light itinerary: every named plan, and a way to start one without going through a listing first. */
export const PlansPage = () => {
  const router = useRouter();
  const plans = useTravellerApp(selectPlans);
  const [name, setName] = useState('');

  const startPlan = (event: FormEvent): void => {
    event.preventDefault();
    router.push(TRAVELLER_ROUTES.plans.detail(travellerAppStore.createPlan(name)));
  };

  return (
    <TravellerScreen barTitle={copy.barTitle} backHref={TRAVELLER_ROUTES.trips.list} heading={copy.title} width="column">
      <div className="flex flex-col gap-8">
        {plans.length === 0 ? (
          <EmptyState
            illustration="bookings"
            title={copy.emptyTitle}
            message={copy.empty}
            action={
              <Button size="md" variant="secondary" href={TRAVELLER_ROUTES.home}>
                {copy.explore}
              </Button>
            }
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {plans.map((plan) => (
              <li key={plan.id}>
                <OptionTile
                  icon="route"
                  title={plan.name}
                  description={planCopy.stops(plan.items.length)}
                  href={TRAVELLER_ROUTES.plans.detail(plan.id)}
                  trailing={<Icon name="chevron-right" className="shrink-0 text-muted" />}
                />
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={startPlan} className="flex flex-col gap-4">
          <h2 className="text-title-lg text-ink">{planCopy.newPlan}</h2>
          <TextInput label={planCopy.newPlanLabel} value={name} onChange={setName} helper={planCopy.newPlanExample} maxLength={PLAN_NAME_MAX} />
          <Button type="submit" size="md" icon="plus" disabled={!name.trim()}>
            {copy.create}
          </Button>
        </form>
      </div>
    </TravellerScreen>
  );
};
