'use client';

import { useCallback, useState } from 'react';
import { Button, EmptyState, Icon } from '@/shared/components';
import { PlanStop, ShareSheet, TravellerScreen } from '../../components';
import { COPY_ACCOUNT, COPY_COMMON, TRAVELLER_ROUTES } from '../../constants';
import { useTravellerApp } from '../../hooks';
import type { TravellerAppState } from '../../interfaces';
import { driveBetween, findListing, selectPlan } from '../../services/client';

const DRIVE_ICON_PX = 16;
const copy = COPY_ACCOUNT.plans.detail;

/** Screen 20, the light itinerary: one plan as an ordered list of stops under day headings, with the drive between them. */
export const PlanDetailPage = ({ planId }: { planId: string }) => {
  const plan = useTravellerApp(useCallback((state: TravellerAppState) => selectPlan(state, planId), [planId]));
  const [sharing, setSharing] = useState(false);

  // TODO: plans live on this phone until /api/v1 holds them, so a shared link lands here on anyone else's phone.
  if (!plan) {
    return (
      <TravellerScreen barTitle={copy.barTitle} backHref={TRAVELLER_ROUTES.plans.list} width="column">
        <EmptyState
          illustration="missing"
          title={COPY_COMMON.notFoundTitle}
          message={copy.notFound}
          action={
            <Button size="md" href={TRAVELLER_ROUTES.plans.list}>
              {copy.backToPlans}
            </Button>
          }
        />
      </TravellerScreen>
    );
  }

  const stops = plan.items.flatMap((item) => {
    const listing = findListing(item.listingId);
    return listing ? [{ item, listing }] : [];
  });

  return (
    <TravellerScreen
      barTitle={copy.barTitle}
      backHref={TRAVELLER_ROUTES.plans.list}
      heading={plan.name}
      helper={stops.length > 0 ? copy.helper : undefined}
      width="column"
      footer={
        stops.length > 0 ? (
          <Button size="md" icon="share" onClick={() => setSharing(true)}>
            {copy.share}
          </Button>
        ) : undefined
      }
    >
      {stops.length === 0 ? (
        <EmptyState
          illustration="offerings"
          title={copy.emptyTitle}
          message={copy.empty}
          action={
            <Button size="md" variant="secondary" href={TRAVELLER_ROUTES.home}>
              {copy.explore}
            </Button>
          }
        />
      ) : (
        <ol className="flex flex-col gap-4">
          {stops.map(({ item, listing }, index) => {
            const previous = stops[index - 1];
            const drive = previous ? driveBetween(previous.listing, listing) : undefined;
            return (
              <li key={item.id} className="flex flex-col gap-3">
                {previous?.item.day === item.day ? null : <h2 className={`text-title-lg text-ink ${previous ? 'pt-4' : ''}`}>{copy.day(item.day)}</h2>}
                {drive ? (
                  <p className="flex items-start gap-2 px-4 text-caption text-muted">
                    <Icon name="car" size={DRIVE_ICON_PX} className="mt-px shrink-0" />
                    {drive}
                  </p>
                ) : null}
                <PlanStop planId={plan.id} item={item} listing={listing} isFirst={index === 0} isLast={index === stops.length - 1} />
              </li>
            );
          })}
        </ol>
      )}
      {sharing ? <ShareSheet path={TRAVELLER_ROUTES.plans.detail(plan.id)} message={copy.shareMessage(plan.name)} onClose={() => setSharing(false)} /> : null}
    </TravellerScreen>
  );
};
