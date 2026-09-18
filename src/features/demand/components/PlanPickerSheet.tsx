'use client';

import { useState } from 'react';
import { Button, OptionTile, Sheet, TextInput, useToast } from '@/shared/components';
import { COPY_COMMON, COPY_EXPLORE, PLAN_NAME_MAX, TRAVELLER_ROUTES } from '../constants';
import { useTravellerApp } from '../hooks';
import type { Plan, TravellerAppState } from '../interfaces';
import { travellerAppStore } from '../services/client';

const copy = COPY_EXPLORE.plan;
const selectPlans = (state: TravellerAppState): Plan[] => state.plans;

/** Flow 7's entry point: from a listing or a trip, pick a named plan or start one. */
export const PlanPickerSheet = ({ listingId, tripId, onClose }: { listingId: string; tripId?: string; onClose: () => void }) => {
  const toast = useToast();
  const plans = useTravellerApp(selectPlans);
  const [name, setName] = useState('');

  const addTo = (plan: Pick<Plan, 'id' | 'name'>): void => {
    travellerAppStore.addToPlan(plan.id, listingId, tripId);
    toast(copy.added(plan.name), TRAVELLER_ROUTES.plans.detail(plan.id));
    onClose();
  };

  return (
    <Sheet
      title={copy.title}
      closeLabel={COPY_COMMON.close}
      onClose={onClose}
      actions={
        <Button size="md" icon="plus" disabled={!name.trim()} onClick={() => addTo({ id: travellerAppStore.createPlan(name), name: name.trim() })}>
          {copy.create}
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-body-md text-body">{copy.body}</p>
        {plans.length > 0 ? (
          <div className="flex flex-col gap-3">
            {plans.map((plan) => (
              <OptionTile key={plan.id} icon="route" title={plan.name} description={copy.stops(plan.items.length)} onSelect={() => addTo(plan)} />
            ))}
          </div>
        ) : null}
        <TextInput label={copy.newPlanLabel} value={name} onChange={setName} helper={copy.newPlanExample} maxLength={PLAN_NAME_MAX} />
      </div>
    </Sheet>
  );
};
