import type { ReactNode } from 'react';
import { EmptyIllustration, type EmptyIllustrationName } from './EmptyIllustration';

interface EmptyStateProps {
  illustration: EmptyIllustrationName;
  /** What this place is for, in a few words. */
  title: string;
  /** What happens next, in one sentence. Never just "nothing here". */
  message: string;
  /** One action that goes somewhere useful. */
  action?: ReactNode;
}

/** Picture, title, one sentence, one action. The screen gutter supplies the sides. */
export const EmptyState = ({ illustration, title, message, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center gap-6 py-12 text-center">
    <EmptyIllustration name={illustration} />
    <div className="flex flex-col gap-2">
      <h2 className="text-title-lg text-ink">{title}</h2>
      <p className="text-body-host text-muted">{message}</p>
    </div>
    {action ? <div className="w-full">{action}</div> : null}
  </div>
);
