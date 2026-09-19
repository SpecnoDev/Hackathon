'use client';

import { ROUTES } from '@/core/constants';
import { Button, useToast } from '@/shared/components';
import { PLANNER_COPY } from '../constants';

const TRAILING_SLASH = /\/$/;

/**
 * Read statically so the build inlines it: a dynamic lookup is undefined in the browser. The public
 * app URL, not `window.location.origin`: a link copied on a Vercel branch alias would otherwise send
 * friends to Vercel's own sign-in, since those aliases sit behind deployment protection.
 */
const publicOrigin = (): string => (process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin).replace(TRAILING_SLASH, '');

export const InviteButton = ({ shareCode }: { shareCode: string }) => {
  const showToast = useToast();

  const invite = async (): Promise<void> => {
    await navigator.clipboard.writeText(`${publicOrigin()}${ROUTES.planJoin}/${shareCode}`);
    showToast(PLANNER_COPY.board.invited);
  };

  return (
    <Button variant="tertiary" icon="link" onClick={() => void invite()}>
      {PLANNER_COPY.board.invite}
    </Button>
  );
};
