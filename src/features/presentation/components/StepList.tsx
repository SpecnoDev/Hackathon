import { Reveal } from './Slide';

interface Step {
  title: string;
  body: string;
}

/** DESIGN.md steps-timeline, at deck size: numbered circles joined by a line. */
export const StepList = ({ steps, startOrder = 2 }: { steps: readonly Step[]; startOrder?: number }) => (
  <ol className="flex flex-col">
    {steps.map((step, index) => (
      <li key={step.title} className="relative pb-5 last:pb-0">
        {index < steps.length - 1 ? <span aria-hidden className="absolute bottom-0 left-5 top-10 w-px bg-hairline" /> : null}
        <Reveal order={startOrder + index} className="flex gap-4">
          <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-primary text-title-sm text-on-primary">
            {index + 1}
          </span>
          <p className="pt-1.5 text-body-md">
            <span className="text-title-sm">{step.title}</span> {step.body}
          </p>
        </Reveal>
      </li>
    ))}
  </ol>
);
