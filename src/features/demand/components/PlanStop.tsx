'use client';

import { useCallback } from 'react';
import { flushSync } from 'react-dom';
import { Button, Icon, useToast, type IconName } from '@/shared/components';
import { COPY_ACCOUNT, COPY_EXPLORE, PLAN_FIRST_DAY, TRAVELLER_ROUTES } from '../constants';
import { useTravellerApp } from '../hooks';
import type { Listing, PlanItem, TravellerAppState } from '../interfaces';
import { selectTripForListing, travellerAppStore } from '../services/client';
import { ListingSummary } from './ListingSummary';
import { TripStatusPill } from './TripStatusPill';

const CONTROL_ICON_PX = 20;
const copy = COPY_ACCOUNT.plans.detail;

/**
 * React re-inserts a stop that moves down the list, and a re-inserted button drops focus to the page. The change is
 * committed first so focus can go straight back, or to the control beside it when the stop has reached an end.
 */
const pressAndKeepFocus = (pressed: HTMLButtonElement, onPress: () => void): void => {
  flushSync(onPress);
  (pressed.disabled ? pressed.parentElement?.querySelector<HTMLButtonElement>('button:enabled') : pressed)?.focus();
};

/** A 40px circle inside a 48px target, so five controls fit across a small phone without shrinking what a thumb has to hit. */
const ControlButton = ({ icon, label, disabled = false, onPress }: { icon: IconName; label: string; disabled?: boolean; onPress: () => void }) => (
  <button
    type="button"
    aria-label={label}
    disabled={disabled}
    onClick={(event) => pressAndKeepFocus(event.currentTarget, onPress)}
    className="group flex size-12 shrink-0 items-center justify-center text-ink active:opacity-70 disabled:text-muted-soft disabled:active:opacity-100"
  >
    <span className="flex size-10 items-center justify-center rounded-full bg-surface-strong group-disabled:bg-surface-soft">
      <Icon name={icon} size={CONTROL_ICON_PX} />
    </span>
  </button>
);

interface PlanStopProps {
  planId: string;
  item: PlanItem;
  listing: Listing;
  isFirst: boolean;
  isLast: boolean;
}

/** One stop of a trip plan: what it is, whether it is booked yet, and the controls that put it in the right place on the right day. */
export const PlanStop = ({ planId, item, listing, isFirst, isLast }: PlanStopProps) => {
  const toast = useToast();
  const trip = useTravellerApp(useCallback((state: TravellerAppState) => selectTripForListing(state, listing.id), [listing.id]));

  const remove = (): void => {
    travellerAppStore.removePlanItem(planId, item.id);
    toast(copy.removed);
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-hairline p-4">
      <ListingSummary listing={listing}>
        <div className="flex pt-1">
          {trip ? (
            <TripStatusPill status={trip.status} />
          ) : (
            <Button size="md" variant="secondary" fullWidth={false} href={TRAVELLER_ROUTES.book.date(listing.id)}>
              {COPY_EXPLORE.listing.book}
            </Button>
          )}
        </div>
      </ListingSummary>
      <div className="flex flex-wrap items-center justify-between gap-y-2 border-t border-hairline-soft pt-3">
        <div className="flex">
          <ControlButton icon="arrow-up" label={copy.moveEarlier(listing.title)} disabled={isFirst} onPress={() => travellerAppStore.movePlanItem(planId, item.id, -1)} />
          <ControlButton icon="arrow-down" label={copy.moveLater(listing.title)} disabled={isLast} onPress={() => travellerAppStore.movePlanItem(planId, item.id, 1)} />
        </div>
        <div className="flex items-center">
          <ControlButton icon="minus" label={copy.dayEarlier(listing.title)} disabled={item.day <= PLAN_FIRST_DAY} onPress={() => travellerAppStore.setPlanItemDay(planId, item.id, item.day - 1)} />
          <output aria-live="polite" className="min-w-12 text-center text-caption text-ink">
            {copy.day(item.day)}
          </output>
          <ControlButton icon="plus" label={copy.dayLater(listing.title)} onPress={() => travellerAppStore.setPlanItemDay(planId, item.id, item.day + 1)} />
        </div>
        <ControlButton icon="trash" label={copy.remove(listing.title)} onPress={remove} />
      </div>
    </div>
  );
};
