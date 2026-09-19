import type { ReactNode } from 'react';

interface PanelProps {
  title: string;
  note?: string;
  children: ReactNode;
}

export const Panel = ({ title, note, children }: PanelProps) => (
  <section className="flex flex-col gap-4 rounded-lg border border-hairline bg-canvas p-6">
    <div className="flex flex-col gap-1">
      <h2 className="text-title-md text-ink">{title}</h2>
      {note ? <p className="text-body-sm text-muted">{note}</p> : null}
    </div>
    {children}
  </section>
);
