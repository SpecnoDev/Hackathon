import type { ReactNode } from 'react';
import Link from 'next/link';
import { Icon } from './Icon';

interface TopBarProps {
  title: string;
  /** Tab roots have no larger heading below the bar, so the bar title is the page heading there. */
  titleIsHeading?: boolean;
  backHref?: string;
  backLabel?: string;
  action?: ReactNode;
}

export const TopBar = ({ title, titleIsHeading = false, backHref, backLabel, action }: TopBarProps) => {
  const Title = titleIsHeading ? 'h1' : 'p';
  return (
    <>
      <header className="flex h-14 items-center border-b border-hairline bg-canvas px-2 tablet:hidden">
        <div className="flex w-14 justify-start">
          {backHref ? (
            <Link href={backHref} aria-label={backLabel} className="flex size-12 items-center justify-center rounded-full">
              <Icon name="chevron-left" />
            </Link>
          ) : null}
        </div>
        <Title className="min-w-0 flex-1 truncate text-center text-title-md text-ink">{title}</Title>
        <div className="flex min-w-14 justify-end">{action}</div>
      </header>
      <div className="hidden flex-col gap-2 tablet:flex tablet:px-6">
        {backHref ? (
          <Link href={backHref} aria-label={backLabel} className="inline-flex w-fit items-center gap-1 text-link text-primary-text underline">
            <Icon name="chevron-left" />
            {backLabel}
          </Link>
        ) : null}
        <div className="flex items-baseline justify-between gap-4">
          <Title className="text-display-md text-ink">{title}</Title>
          {action}
        </div>
      </div>
    </>
  );
};
