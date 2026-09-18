import Link from 'next/link';
import type { ReactNode } from 'react';

interface StatTileProps {
  label: string;
  value: string;
  note?: string;
  /** The list this number came from. A tile without one is a number the back office cannot open yet. */
  href?: string;
  /** DESIGN.md keeps orange as a fill: money gets the accent tint and a dot, never orange text. */
  money?: boolean;
}

const SHELL = 'flex flex-col gap-1 rounded-md border p-4';
const PLAIN = 'border-hairline bg-canvas';
const MONEY = 'border-accent-tint bg-accent-tint';

export const StatTile = ({ label, value, note, href, money = false }: StatTileProps) => {
  const body = (
    <>
      <p className="text-body-sm text-muted">{label}</p>
      <p className="flex items-center gap-2 text-ink">
        {money ? <span className="size-2 rounded-full bg-accent" /> : null}
        <span className={money ? 'font-display text-display-md' : 'text-title-lg'}>{value}</span>
      </p>
      {note ? <p className="text-caption text-muted">{note}</p> : null}
    </>
  );

  return href ? (
    <Link href={href} className={`${SHELL} ${money ? MONEY : PLAIN} hover:border-ink`}>
      {body}
    </Link>
  ) : (
    <div className={`${SHELL} ${money ? MONEY : PLAIN}`}>{body}</div>
  );
};

export const StatSection = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="flex flex-col gap-3">
    <h2 className="text-title-md text-ink">{title}</h2>
    <div className="grid grid-cols-2 gap-4 tablet:grid-cols-4">{children}</div>
  </section>
);
