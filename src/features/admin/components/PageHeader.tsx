import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** A back link or a breadcrumb, above the title. */
  eyebrow?: ReactNode;
  /** Actions or a status, level with the title on wide screens. */
  aside?: ReactNode;
}

/** The screen's one display element, so everything under it uses the title styles. */
export const PageHeader = ({ title, subtitle, eyebrow, aside }: PageHeaderProps) => (
  <header className="flex flex-wrap items-end justify-between gap-4">
    <div className="flex min-w-0 flex-col gap-1">
      {eyebrow ? <div className="text-caption text-muted">{eyebrow}</div> : null}
      <h1 className="font-display text-display-md text-ink">{title}</h1>
      {subtitle ? <p className="text-body-md text-muted">{subtitle}</p> : null}
    </div>
    {aside}
  </header>
);
