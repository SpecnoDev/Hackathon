/** Static on purpose: DESIGN.md keeps shimmer off the host side because animation costs battery and attention. */
export const Skeleton = ({ className }: { className: string }) => (
  <div aria-hidden className={`rounded-md bg-surface-strong ${className}`} />
);
