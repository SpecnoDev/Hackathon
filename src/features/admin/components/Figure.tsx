interface FigureProps {
  label: string;
  value: string;
  note?: string;
  /** DESIGN.md keeps orange as a fill: money gets the dot and the display face, never orange text. */
  money?: boolean;
}

/** One labelled number in a strip. Money is the loud one, as it is everywhere else in the product. */
export const Figure = ({ label, value, note, money = false }: FigureProps) => (
  <div className="flex flex-col gap-1 bg-canvas p-6">
    <p className="text-caption text-muted">{label}</p>
    <p className="flex items-center gap-2 text-ink">
      {money ? <span aria-hidden className="size-2.5 rounded-full bg-accent" /> : null}
      <span className={`tabular-nums ${money ? 'font-display text-display-lg' : 'text-title-lg'}`}>{value}</span>
    </p>
    {note ? <p className="text-body-sm text-muted">{note}</p> : null}
  </div>
);
