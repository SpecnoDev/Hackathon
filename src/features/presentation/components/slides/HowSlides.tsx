import { Fragment } from 'react';
import { Icon } from '@/shared/components';
import { DECK_COPY, DECK_FIGURES, DECK_SCREENS } from '../../constants';
import { FeeSplit } from '../FeeSplit';
import { PhoneFrame } from '../PhoneFrame';
import { PotMeter } from '../PotMeter';
import { Reveal, Slide } from '../Slide';
import { StepList } from '../StepList';

const copy = DECK_COPY;
const figures = DECK_FIGURES;
const PHONE_ON_SLIDE_PX = 350;

export const HostSlide = () => (
  <Slide tone="light" eyebrow={copy.host.eyebrow} headline={copy.host.headline}>
    <div className="grid flex-1 grid-cols-[1fr_auto] items-center gap-12">
      <div className="flex flex-col gap-6">
        <StepList steps={copy.host.steps} />
        <Reveal order={6} className="flex items-center gap-3 rounded-lg bg-accent-tint p-4">
          <Icon name="banknote" className="shrink-0 text-ink" />
          <p className="text-title-sm text-ink">{copy.host.close}</p>
        </Reveal>
      </div>
      <div className="flex flex-col items-center gap-2">
        <PhoneFrame route={DECK_SCREENS.hostCreate} label={copy.chrome.phoneLabel(copy.host.phone)} height={PHONE_ON_SLIDE_PX} />
        <p className="text-[0.625rem] text-muted">{copy.chrome.livePhone}</p>
      </div>
    </div>
  </Slide>
);

export const PayoutSlide = () => (
  <Slide tone="light" eyebrow={copy.payout.eyebrow} headline={copy.payout.headline}>
    <div className="grid flex-1 grid-cols-[1fr_auto] items-center gap-10">
      <div className="flex flex-col gap-4">
        <ol className="flex items-start">
          {copy.payout.flow.map((step, index) => (
            <Fragment key={step.label}>
              {index > 0 ? <li aria-hidden className="mt-5 h-px flex-1 origin-left animate-deck-grow-x bg-border-strong motion-reduce:animate-none" style={{ animationDelay: `${300 + index * 220}ms` }} /> : null}
              <li className="flex w-20 shrink-0 animate-deck-pop flex-col items-center gap-2 text-center motion-reduce:animate-none" style={{ animationDelay: `${200 + index * 220}ms` }}>
                <span className={`flex size-10 items-center justify-center rounded-sm ${index === copy.payout.flow.length - 1 ? 'bg-accent text-on-accent' : 'bg-surface-soft text-ink'}`}>
                  <Icon name={step.icon} size={20} />
                </span>
                <span className="text-[0.6875rem] leading-tight text-body">{step.label}</span>
              </li>
            </Fragment>
          ))}
        </ol>
        <Reveal order={8}>
          <FeeSplit startCents={figures.booking.totalCents} />
        </Reveal>
        <Reveal order={10}>
          <p className="text-caption text-muted">
            <span className="text-title-sm text-ink">{copy.payout.channelsNote}</span> {copy.payout.channels.join(' · ')}
          </p>
        </Reveal>
      </div>
      <div className="flex flex-col items-center gap-2">
        <PhoneFrame route={DECK_SCREENS.hostEarnings} label={copy.chrome.phoneLabel(copy.payout.phone)} height={PHONE_ON_SLIDE_PX} />
        <p className="text-[0.625rem] text-muted">{copy.chrome.livePhone}</p>
      </div>
    </div>
  </Slide>
);

export const GroupSlide = () => (
  <Slide tone="light" eyebrow={copy.group.eyebrow} headline={copy.group.headline}>
    <div className="grid flex-1 grid-cols-2 items-center gap-12">
      <div className="flex flex-col gap-6">
        <StepList steps={copy.group.steps} />
        <Reveal order={6} className="flex items-center gap-3 rounded-lg bg-primary-tint p-4">
          <Icon name="users" className="shrink-0 text-primary-text" />
          <p className="text-title-sm text-ink">{copy.group.close}</p>
        </Reveal>
      </div>
      <Reveal order={3}>
        <PotMeter totalCents={figures.pot.totalCents} shareCents={figures.pot.shareCents} friends={figures.pot.friends} paidAtStart={figures.pot.paidAtStart} />
      </Reveal>
    </div>
  </Slide>
);
