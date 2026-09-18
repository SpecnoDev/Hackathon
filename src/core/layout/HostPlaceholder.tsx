/** The stub every host tab renders until its owner builds it. Deliberately plain. */
export function HostPlaceholder({ title, note }: { title: string; note: string }) {
  return (
    <section className="flex flex-col gap-3">
      <h1 className="font-display text-display-lg text-ink">{title}</h1>
      <p className="text-body-host text-muted">{note}</p>
      <p className="rounded-md border border-dashed border-border-strong px-4 py-3 text-caption text-muted">
        Not built yet. Marlon owns this screen.
      </p>
    </section>
  );
}
