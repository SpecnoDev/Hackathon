'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { ROUTES } from '@/core/constants';
import { Button, Icon, useToast, type IconName } from '@/shared/components';
import { savePlanAction } from '../actions';
import { PLANNER_COPY } from '../constants';

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

/** DESIGN.md sticky-book-bar: the plan's running total on the left, the one closing action on the right. */
export const SaveBar = ({ tripId, blockCount, dayCount, status, locked, onAddExperiences, onError }: SaveBarProps) => {
  const router = useRouter();
  const showToast = useToast();
  const [saving, startSaving] = useTransition();
  const copy = PLANNER_COPY.board;
  const shown = STATUS[status];

  const save = () =>
    startSaving(async () => {
      const result = await savePlanAction(tripId);
      if (result.error) {
        onError(result.error);
        return;
      }
      showToast(result.note ?? copy.allSaved);
      router.push(ROUTES.plan);
    });

  return (
    <div className="sticky bottom-0 z-20 -mx-4 -mb-10 border-t border-hairline bg-canvas px-4 py-3 shadow-lift tablet:-mx-6 tablet:px-6">
      <div className="mx-auto flex w-full max-w-page flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-title-sm text-ink">{copy.summary(blockCount, dayCount)}</p>
          <p className={`flex items-center gap-1.5 text-caption ${shown.tone}`}>
            <Icon name={shown.icon} size={STATUS_ICON_PX} />
            {shown.text}
          </p>
        </div>
        {locked ? null : (
          <span className="desktop:hidden">
            <Button variant="secondary" size="md" fullWidth={false} icon="plus" onClick={onAddExperiences}>
              {copy.addExperiences}
            </Button>
          </span>
        )}
        <Button size="md" fullWidth={false} icon="check" onClick={save} disabled={saving || status === 'saving'}>
          {copy.savePlan}
        </Button>
      </div>
    </div>
  );
};
