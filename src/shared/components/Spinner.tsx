interface SpinnerProps {
  /** Read out while the spinner is visible; there is no other text an assistive tech user would hear. */
  label: string;
  className?: string;
}

/** The one deliberate exception to DESIGN.md's host-side motion rule; kept small and respects motion-reduce. */
export const Spinner = ({ label, className = 'size-5' }: SpinnerProps) => (
  <div role="status" aria-label={label} className={`animate-spin rounded-full border-2 border-border-strong border-t-primary motion-reduce:animate-none ${className}`} />
);
