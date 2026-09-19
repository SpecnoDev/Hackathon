'use client';

import { ROUTES } from '@/core/constants';
import { Button, useToast } from '@/shared/components';
import { PLANNER_COPY } from '../constants';

export const InviteButton = ({ shareCode }: { shareCode: string }) => {
  const showToast = useToast();

  const invite = async (): Promise<void> => {
    await navigator.clipboard.writeText(`${window.location.origin}${ROUTES.planJoin}/${shareCode}`);
    showToast(PLANNER_COPY.board.invited);
  };

  return (
    <Button variant="secondary" size="md" fullWidth={false} icon="link" onClick={() => void invite()}>
      {PLANNER_COPY.board.invite}
    </Button>
  );
};
