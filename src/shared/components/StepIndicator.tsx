interface StepIndicatorProps {
  current: number;
  total: number;
  /** e.g. "Step 2 of 5". Passed in so it can be translated. */
  label: string;
}

export const StepIndicator = ({ current, total, label }: StepIndicatorProps) => (
  <div className="flex items-center gap-3 bg-canvas px-6 py-3">
    <div className="flex flex-1 gap-1" aria-hidden>
      {Array.from({ length: total }, (_, index) => (
        <span key={index} className={`h-1 flex-1 rounded-full ${index < current ? 'bg-primary' : 'bg-hairline'}`} />
      ))}
    </div>
    <p className="shrink-0 text-caption text-muted">{label}</p>
  </div>
);
