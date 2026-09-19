'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { ROUTES } from '@/core/constants';
import { Button, Icon, useToast, type IconName } from '@/shared/components';
import { savePlanAction } from '../actions';
import { PLANNER_COPY, PLANNER_ERRORS } from '../constants';
import type { PlannerActionState } from '../interfaces';

const STATUS_ICON_PX = 16;

type SaveStatus = 'saving' | 'saved' | 'failed';

const STATUS: Record<SaveStatus, { icon: IconName; text: string; tone: string }> = {
  saving: { icon: 'clock', text: PLANNER_COPY.board.saving, tone: 'text-muted' },
  saved: { icon: 'check', text: PLANNER_COPY.board.allSaved, tone: 'text-primary-text' },
  failed: { icon: 'alert', text: PLANNER_COPY.board.notSaved, tone: 'text-error' },
};

interface SaveBarProps {
  tripId: string;
  blockCount: number;
  dayCount: number;
  status: SaveStatus;
  locked: boolean;
  onAddExperiences: () => void;
  onError: (error: string) => void;
}

/** DESIGN.md sticky-book-bar: the plan's running total and save state, then the one closing action. Two rows on a phone, one on desktop. */
export const SaveBar = ({ tripId, blockCount, dayCount, status, locked, onAddExperiences, onError }: SaveBarProps) => {
  const router = useRouter();
  const showToast = useToast();
  const [saving, startSaving] = useTransition();
  const copy = PLANNER_COPY.board;
  const shown = STATUS[status];

  const save = () =>
    startSaving(async () => {
      const result = await savePlanAction(tripId).catch((): PlannerActionState => ({ error: PLANNER_ERRORS.generic }));
      if (result.error) {
        onError(result.error);
        return;
      }
      showToast(result.note ?? copy.allSaved);
      router.push(ROUTES.plan);
    });

  return (
    <div className="sticky bottom-0 z-20 -mx-4 -mb-10 border-t border-hairline bg-canvas px-4 py-2.5 shadow-lift tablet:-mx-6 tablet:px-6 desktop:py-3">
      <div className="mx-auto flex w-full max-w-page flex-wrap items-center gap-x-3 gap-y-2">
        <div className="flex min-w-0 basis-full flex-wrap items-baseline gap-x-3 gap-y-0.5 desktop:flex-1 desktop:flex-col desktop:items-start desktop:gap-0">
          <p className="text-title-sm text-ink">{copy.summary(blockCount, dayCount)}</p>
          <p className={`flex items-center gap-1.5 text-caption ${shown.tone}`}>
            <Icon name={shown.icon} size={STATUS_ICON_PX} />
            {shown.text}
          </p>
        </div>
        <div className="flex flex-1 gap-3 desktop:flex-none">
          {locked ? null : (
            <span className="flex-1 desktop:hidden">
              <Button variant="secondary" size="md" icon="plus" onClick={onAddExperiences}>
                {copy.add}
              </Button>
            </span>
          )}
          <span className="flex-1 desktop:flex-none">
            <Button size="md" icon="check" onClick={save} disabled={saving || status === 'saving'}>
              {copy.savePlan}
            </Button>
          </span>
        </div>
      </div>
    </div>
  );
};
