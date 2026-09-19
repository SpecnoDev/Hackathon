interface PriceLine {
  label: string;
  value: string;
}

interface PriceSummaryProps {
  lines: PriceLine[];
  totalLabel: string;
  total: string;
  /** e.g. an approximate amount in the traveller's own currency. */
  note?: string;
}

/** DESIGN.md price-summary: every line, then the total, always before payment. */
export const PriceSummary = ({ lines, totalLabel, total, note }: PriceSummaryProps) => (
  <dl className="flex flex-col gap-3 rounded-lg bg-surface-soft p-5">
    {lines.map((line) => (
      <div key={line.label} className="flex items-baseline justify-between gap-4 text-body-md text-body">
        <dt>{line.label}</dt>
        <dd>{line.value}</dd>
      </div>
    ))}
    <div className="flex items-baseline justify-between gap-4 border-t border-hairline pt-3 text-title-md text-ink">
      <dt>{totalLabel}</dt>
      <dd>{total}</dd>
    </div>
    {note ? <p className="text-caption text-muted">{note}</p> : null}
  </dl>
);
