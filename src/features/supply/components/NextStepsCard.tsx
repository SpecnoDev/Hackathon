import Link from 'next/link';
import { Icon } from '@/shared/components';
import { HOST_COPY, HOST_ROUTES } from '../constants';

const copy = HOST_COPY.offerings.nextSteps;

interface NextStep {
  key: 'verify' | 'offering' | 'photos';
  href: string;
  done: boolean;
}

interface NextStepsCardProps {
  verified: boolean;
  hasOffering: boolean;
  hasPhotos: boolean;
  /** Where "Add photos" goes: the first offering that has none. */
  photosHref: string;
}

/**
 * First-run guidance, inline rather than a tutorial: the few things between a new host and their first
 * booking, ticked off as they happen. It removes itself once every step is done.
 */
export const NextStepsCard = ({ verified, hasOffering, hasPhotos, photosHref }: NextStepsCardProps) => {
  const steps: NextStep[] = [
    { key: 'verify', href: HOST_ROUTES.verify.why, done: verified },
    { key: 'offering', href: HOST_ROUTES.create.category, done: hasOffering },
    { key: 'photos', href: photosHref, done: hasPhotos },
  ];
  const doneCount = steps.filter((step) => step.done).length;
  if (doneCount === steps.length) return null;

  return (
    <section className="flex flex-col gap-2 rounded-lg border border-hairline bg-canvas p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-title-lg text-ink">{copy.title}</h2>
        <p className="text-caption text-muted">{copy.progress(doneCount, steps.length)}</p>
      </div>
      <div aria-hidden className="flex gap-1 pb-2">
        {/* Fills from the left by count: it shows how far along the host is, not which step happens to be done. */}
        {steps.map((step, index) => (
          <span key={step.key} className={`h-1 flex-1 rounded-full ${index < doneCount ? 'bg-primary' : 'bg-hairline'}`} />
        ))}
      </div>
      <ol className="flex flex-col">
        {steps.map((step, index) => {
          const body = (
            <>
              <span
                className={`flex size-10 shrink-0 items-center justify-center rounded-full text-title-sm ${step.done ? 'bg-primary-tint text-primary-text' : 'border border-ink text-ink'}`}
              >
                {step.done ? <Icon name="check" size={20} /> : index + 1}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className={`text-title-md ${step.done ? 'text-muted' : 'text-ink'}`}>{copy[step.key].title}</span>
                <span className="text-caption text-muted">{step.done ? copy.done : copy[step.key].body}</span>
              </span>
              {step.done ? null : <Icon name="chevron-right" className="shrink-0 text-muted" />}
            </>
          );
          const row = 'flex min-h-16 items-center gap-4 border-t border-hairline-soft py-3';
          return (
            <li key={step.key}>
              {step.done ? (
                <div className={row}>{body}</div>
              ) : (
                <Link href={step.href} className={`${row} active:bg-surface-soft`}>
                  {body}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
};
