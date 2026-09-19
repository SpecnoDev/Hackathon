import { HostedLogo, Icon } from '@/shared/components';
import { DECK_COPY, DECK_FIGURES, DECK_SOURCES } from '../../constants';
import { Donut } from '../Donut';
import { GrowthBars } from '../GrowthBars';
import { Reveal, Slide } from '../Slide';

const copy = DECK_COPY;
const figures = DECK_FIGURES;

/** The pivot of the deck: the one place the whole slide turns green. */
export const OneLinerSlide = () => (
  <Slide tone="brand">
    <div className="flex flex-1 flex-col justify-center gap-8">
      <Reveal>
        <span className="inline-flex rounded-sm bg-canvas px-4 py-2">
          <HostedLogo name={copy.appName} size="sm" />
        </span>
      </Reveal>
      <div className="flex max-w-4xl flex-col gap-5">
        <Reveal order={2}>
          <h2 className="font-display text-earnings-display text-ink">{copy.oneLiner.lead}</h2>
        </Reveal>
        <Reveal order={5} className="border-l-2 border-ink/25 pl-5">
          <p className="max-w-3xl text-title-lg text-ink/80">{copy.oneLiner.statement}</p>
        </Reveal>
      </div>
      <Reveal order={12}>
        <p className="text-body-md text-ink/70">{copy.oneLiner.tagline}</p>
      </Reveal>
    </div>
  </Slide>
);

export const TrendOneSlide = () => (
  <Slide tone="light" eyebrow={copy.trendOne.eyebrow} headline={copy.trendOne.headline} source={DECK_SOURCES.market}>
    <div className="grid flex-1 grid-cols-[1.5fr_1fr] items-center gap-10">
      <div className="flex flex-col gap-6">
        <Reveal order={2}>
          <p className="max-w-lg text-body-md text-muted">{copy.trendOne.body(figures.market.growthPercent)}</p>
        </Reveal>
        <GrowthBars
          bars={[
            { label: String(figures.market.fromYear), value: figures.market.fromTrillion, display: copy.trendOne.trillion(figures.market.fromTrillion) },
            { label: String(figures.market.toYear), value: figures.market.toTrillion, display: copy.trendOne.trillion(figures.market.toTrillion), highlight: true },
          ]}
        />
        <Reveal order={8}>
          <p className="text-caption text-muted">{copy.trendOne.caption}</p>
        </Reveal>
      </div>
      <Reveal order={4} className="flex flex-col items-center gap-4 rounded-lg bg-surface-soft p-6 text-center">
        <Donut percent={figures.adventureSharePercent} label={`${figures.adventureSharePercent}% ${copy.trendOne.share}`}>
          <span className="font-display text-display-lg text-primary-text">{`${figures.adventureSharePercent}%`}</span>
        </Donut>
        <p className="text-body-md text-body">{copy.trendOne.share}</p>
        <p className="text-caption text-muted">{copy.trendOne.shareNote}</p>
      </Reveal>
    </div>
  </Slide>
);

export const TrendTwoSlide = () => (
  <Slide tone="light" eyebrow={copy.trendTwo.eyebrow} headline={copy.trendTwo.headline} source={DECK_SOURCES.luxury}>
    <div className="flex flex-1 flex-col gap-6">
      <Reveal order={2}>
        <p className="max-w-3xl text-body-md text-muted">{copy.trendTwo.body}</p>
      </Reveal>
      <div className="grid flex-1 grid-cols-[1fr_auto_1fr] items-stretch gap-5">
        <Reveal order={3} className="flex flex-col gap-4 rounded-lg bg-surface-soft p-6">
          <p className="text-badge uppercase tracking-[0.22em] text-muted">{copy.trendTwo.was.label}</p>
          <ul className="flex flex-col gap-3">
            {copy.trendTwo.was.items.map((item) => (
              <li key={item} className="text-title-md text-muted-soft line-through decoration-muted-soft/60 decoration-1">
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal order={5} className="flex items-center">
          <span className="flex size-10 items-center justify-center text-muted-soft">
            <Icon name="chevron-right" />
          </span>
        </Reveal>
        <div className="flex flex-col gap-4 rounded-lg bg-primary-tint p-6">
          <Reveal order={6}>
            <p className="text-badge uppercase tracking-[0.22em] text-primary-text">{copy.trendTwo.is.label}</p>
          </Reveal>
          <ul className="flex flex-col gap-3">
            {copy.trendTwo.is.items.map((item, index) => (
              <li key={item}>
                <Reveal order={7 + index * 2} className="flex items-center gap-3 text-title-md text-ink">
                  <Icon name="check" size={20} className="shrink-0 text-primary-text" />
                  {item}
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </Slide>
);
