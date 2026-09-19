import { HostedLogo, HostedMark, Icon } from '@/shared/components';
import { DECK_COPY, DECK_FIGURES, DECK_SOURCES } from '../../constants';
import { GrowthBars } from '../GrowthBars';
import { ShareGrid } from '../ShareGrid';
import { Reveal, Slide } from '../Slide';
import { StatCount } from '../StatCount';

const copy = DECK_COPY;
const figures = DECK_FIGURES;
const SQUARES = figures.staysPer100.of / figures.staysPer100.stays;
const LOCK_ICON_PX = 16;
const FULL_PERCENT = 100;

export const TitleSlide = () => (
  <Slide tone="green">
    <div className="relative flex items-center justify-between">
      <HostedLogo name={copy.appName} onDark size="sm" />
      <p className="text-caption text-on-dark/60">{copy.event}</p>
    </div>
    <div className="relative flex flex-1 items-center justify-between gap-10">
      <div className="flex max-w-xl flex-col gap-5">
        <Reveal order={1}>
          <h1 className="font-display text-earnings-display text-on-dark">
            {copy.title.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <span className="block text-sand/90">{copy.title.turn}</span>
          </h1>
        </Reveal>
        <Reveal order={4}>
          <p className="max-w-md text-body-md text-on-dark/70">{copy.title.sub}</p>
        </Reveal>
      </div>
      <div className="flex shrink-0 flex-col items-center gap-5">
        <HostedMark size={200} onDark animated />
        <Reveal order={9}>
          <p className="text-center text-caption text-on-dark/60">
            {copy.title.mark.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </Reveal>
      </div>
    </div>
  </Slide>
);

export const ProblemSlide = () => (
  <Slide tone="dark" eyebrow={copy.problem.eyebrow}>
    <div className="flex flex-1 flex-col justify-center gap-8">
      <Reveal order={1}>
        <h2 className="max-w-3xl font-display text-earnings-display text-on-dark">{copy.problem.headline}</h2>
      </Reveal>
      <Reveal order={3}>
        <p className="max-w-2xl text-body-host text-on-dark/70">{copy.problem.body}</p>
      </Reveal>
      <div className="flex flex-col gap-3">
        <Reveal order={5}>
          <p className="text-badge uppercase tracking-[0.22em] text-on-dark/50">{copy.problem.peopleLabel}</p>
        </Reveal>
        <ul className="flex flex-wrap gap-6">
          {copy.problem.people.map((person, index) => (
            <li key={person.role}>
              <Reveal order={6 + index} className="flex items-center gap-3">
                {/* Plain files on Unsplash, the same faces the app seeds; next/image would only add a loader here.
                    Each photo brings its own backdrop, so the edge is dissolved into the slide and only the face is left. */}
                <img src={person.portrait} alt="" className="size-16 rounded-full object-cover [mask-image:radial-gradient(circle,#000_52%,transparent_76%)]" />
                <span className="text-button-sm text-on-dark">{person.role}</span>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </Slide>
);

export const NumbersSlide = () => (
  <Slide
    tone="dark"
    eyebrow={copy.numbers.eyebrow}
    source={DECK_SOURCES.sa}
    headline={
      <>
        {copy.numbers.headline} <span className="text-accent">{copy.numbers.turn}</span>
      </>
    }
  >
    <div className="grid flex-1 grid-cols-[1.25fr_1fr] items-center gap-12">
      <Reveal order={2} className="flex flex-col gap-5 rounded-lg border border-on-dark/10 bg-on-dark/5 p-6">
        <StatCount value={figures.arrivals.value} decimals={2} suffix={figures.arrivals.unit} label={copy.numbers.arrivals} note={`${figures.arrivals.period}, ${copy.numbers.arrivalsGrowth(figures.arrivals.growthPercent)}`} />
        <GrowthBars
          onDark
          bars={[
            { label: figures.arrivalsPriorYear.period, note: copy.numbers.derived, value: figures.arrivalsPriorYear.value, display: `${figures.arrivalsPriorYear.value}${figures.arrivalsPriorYear.unit}` },
            { label: figures.arrivals.period, value: figures.arrivals.value, display: `${figures.arrivals.value}${figures.arrivals.unit}`, highlight: true },
          ]}
        />
      </Reveal>
      <div className="flex flex-col gap-6">
        <Reveal order={4}>
          <StatCount size="md" value={figures.jobs.value} decimals={1} prefix="~" suffix={figures.jobs.unit} label={copy.numbers.jobs} note={copy.numbers.jobsNote(figures.jobs.gdpPercent)} delayMs={300} />
        </Reveal>
        <Reveal order={5}>
          <StatCount
            value={figures.unemployment.percent}
            decimals={1}
            suffix="%"
            label={copy.numbers.unemployment}
            note={copy.numbers.unemploymentNote(figures.unemployment.expandedPercent, figures.unemployment.quarter)}
            accent
          />
        </Reveal>
        <Reveal order={6}>
          <StatCount size="md" value={figures.cashBusinesses.value} decimals={1} suffix={figures.cashBusinesses.unit} label={copy.numbers.cash} note={copy.numbers.cashNote} delayMs={600} />
        </Reveal>
      </div>
    </div>
  </Slide>
);

export const MoneySlide = () => (
  <Slide tone="dark" eyebrow={copy.money.eyebrow} headline={copy.money.headline} source={DECK_SOURCES.money}>
    <div className="grid flex-1 grid-cols-2 items-center gap-14">
      <div className="flex flex-col gap-6">
        <ShareGrid total={SQUARES} lit={1} label={`${copy.money.stays(figures.staysPer100.stays, figures.staysPer100.of)} ${copy.money.staysBody}`} />
        <Reveal order={12}>
          <p className="text-body-host text-on-dark/80">
            <span className="font-display text-display-xl text-accent">{copy.money.stays(figures.staysPer100.stays, figures.staysPer100.of)}</span> {copy.money.staysBody}
          </p>
        </Reveal>
      </div>
      <Reveal order={14} className="flex flex-col gap-5 rounded-lg border border-on-dark/10 bg-on-dark/5 p-6">
        <p className="font-display text-earnings-display text-on-dark">{copy.money.leaks(figures.leakage.fromPercent, figures.leakage.toPercent)}</p>
        <p className="text-body-md text-on-dark/70">{copy.money.leaksBody}</p>
        <div className="flex flex-col gap-2">
          <div className="relative h-4 overflow-hidden rounded-full bg-primary">
            {/* The solid part is the floor of the estimate; the lighter part is the range above it. */}
            <span className="absolute inset-y-0 right-0 origin-right animate-deck-grow-x bg-accent motion-reduce:animate-none" style={{ width: `${figures.leakage.fromPercent}%`, animationDelay: '1700ms' }} />
            <span
              className="absolute inset-y-0 origin-right animate-deck-grow-x bg-accent/50 motion-reduce:animate-none"
              style={{ right: `${figures.leakage.fromPercent}%`, width: `${figures.leakage.toPercent - figures.leakage.fromPercent}%`, animationDelay: '2100ms' }}
            />
          </div>
          <div className="flex justify-between text-caption text-on-dark/70">
            <span>{`${copy.money.stayLabel} ${FULL_PERCENT - figures.leakage.toPercent} to ${FULL_PERCENT - figures.leakage.fromPercent}%`}</span>
            <span>{`${copy.money.leaveLabel} ${copy.money.leaks(figures.leakage.fromPercent, figures.leakage.toPercent)}`}</span>
          </div>
        </div>
      </Reveal>
    </div>
  </Slide>
);

export const DoorsSlide = () => (
  <Slide tone="light" eyebrow={copy.doors.eyebrow} headline={copy.doors.headline}>
    <div className="flex flex-1 flex-col gap-3">
      <Reveal order={2}>
        <p className="text-body-md text-muted">{copy.doors.sub}</p>
      </Reveal>
      <ul className="grid flex-1 grid-cols-3 gap-4">
        {copy.doors.supply.items.map((item, index) => (
          <li key={item.title}>
            <Reveal order={3 + index} className="flex h-full flex-col gap-3 rounded-lg bg-surface-soft p-6">
              <span className="flex size-12 items-center justify-center rounded-sm bg-canvas text-ink">
                <Icon name={item.icon} />
              </span>
              <p className="flex items-center gap-2 text-badge uppercase tracking-[0.22em] text-muted">
                <Icon name="lock" size={LOCK_ICON_PX} />
                {item.title}
              </p>
              <p className="text-body-md text-body">{item.body}</p>
            </Reveal>
          </li>
        ))}
      </ul>
      <Reveal order={7}>
        <p className="font-display text-display-md text-primary-text">{copy.doors.close}</p>
      </Reveal>
    </div>
  </Slide>
);
