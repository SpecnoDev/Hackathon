import { Button, HostedLogo, HostedMark, Icon } from '@/shared/components';
import { DECK_COPY, DECK_FIGURES, DECK_SCREENS, DECK_SOURCES } from '../../constants';
import { BudgetBars } from '../BudgetBars';
import { PhoneFrame } from '../PhoneFrame';
import { Reveal, Slide } from '../Slide';

const copy = DECK_COPY;
const figures = DECK_FIGURES;
const SMALL_PHONE_PX = 330;
const TIER_BASE_PX = 26;
const TIER_STEP_PX = 14;
const TIER_DELAY_MS = 900;
const TIER_STAGGER_MS = 180;

export const PrinciplesSlide = () => (
  <Slide tone="dark" eyebrow={copy.principles.eyebrow} headline={copy.principles.headline} source={DECK_SOURCES.build}>
    <div className="grid flex-1 grid-cols-[1.3fr_1fr] items-center gap-10">
      <ul className="grid grid-cols-2 gap-3">
        {copy.principles.items.map((item, index) => (
          <li key={item.title}>
            <Reveal order={2 + index} className="flex h-full flex-col gap-1.5 rounded-lg border border-on-dark/10 bg-on-dark/5 p-4">
              <Icon name={item.icon} className="text-accent" />
              <p className="text-title-sm text-on-dark">{item.title}</p>
              <p className="text-body-sm text-on-dark/70">{item.body}</p>
            </Reveal>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-5">
        <Reveal order={6} className="flex flex-col gap-3">
          <p className="text-title-sm text-on-dark">{copy.principles.budgetTitle}</p>
          <BudgetBars
            bars={[
              { label: copy.principles.budget, value: figures.firstLoad.budgetKb, display: copy.principles.kb(figures.firstLoad.budgetKb), isBudget: true },
              { label: copy.principles.host, value: figures.firstLoad.hostKb, display: copy.principles.kb(figures.firstLoad.hostKb) },
              { label: copy.principles.traveller, value: figures.firstLoad.travellerKb, display: copy.principles.kb(figures.firstLoad.travellerKb) },
            ]}
          />
        </Reveal>
        <div className="flex flex-col gap-2">
          <Reveal order={8}>
            <p className="text-title-sm text-on-dark">{copy.principles.tiersTitle}</p>
          </Reveal>
          <ol className="flex items-end gap-2">
            {copy.principles.tiers.map((tier, index) => (
              <li key={tier} className="flex-1">
                {/* Each step stands taller than the last: trust is climbed, not granted. */}
                <span
                  className="flex origin-bottom animate-deck-grow-y items-end rounded-t-md bg-primary px-2 pb-1.5 text-badge text-on-primary motion-reduce:animate-none"
                  style={{ height: `${TIER_BASE_PX + index * TIER_STEP_PX}px`, animationDelay: `${TIER_DELAY_MS + index * TIER_STAGGER_MS}ms` }}
                >
                  {tier}
                </span>
              </li>
            ))}
          </ol>
          <Reveal order={12}>
            <p className="text-[0.6875rem] leading-snug text-on-dark/70">{copy.principles.tiersNote}</p>
          </Reveal>
        </div>
      </div>
    </div>
  </Slide>
);

export const BuiltSlide = () => (
  <Slide tone="light" eyebrow={copy.built.eyebrow} headline={copy.built.headline}>
    <div className="grid flex-1 grid-cols-[1fr_auto] items-center gap-10">
      <ul className="flex flex-col gap-4">
        {copy.built.items.map((item, index) => (
          <li key={item}>
            <Reveal order={2 + index} className="flex items-start gap-3 text-body-md text-body">
              <Icon name="check" size={20} className="mt-0.5 shrink-0 text-primary-text" />
              {item}
            </Reveal>
          </li>
        ))}
      </ul>
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-end gap-4">
          <PhoneFrame route={DECK_SCREENS.hostBookings} label={copy.chrome.phoneLabel('host bookings')} height={SMALL_PHONE_PX} />
          <PhoneFrame route={DECK_SCREENS.travellerHome} label={copy.chrome.phoneLabel('traveller home')} height={SMALL_PHONE_PX} />
        </div>
        <p className="text-[0.625rem] text-muted">{copy.chrome.livePhone}</p>
      </div>
    </div>
  </Slide>
);

const FEATURE_PHONE_PX = 380;

/** One slide per feature, in the order the product is used: a host lists, a host is paid, a traveller browses, a group plans. */
export const FeatureSlides = copy.features.items.map((feature) => {
  const FeatureSlide = () => (
    <Slide tone="light" eyebrow={copy.features.eyebrow} headline={feature.title}>
      <div className="grid flex-1 grid-cols-[1.1fr_auto] items-center gap-12">
        <div className="flex flex-col gap-5">
          <Reveal order={1}>
            <p className="text-body-host text-body">{feature.body}</p>
          </Reveal>
          <ul className="flex flex-col gap-3">
            {feature.points.map((point, index) => (
              <li key={point}>
                <Reveal order={3 + index} className="flex items-start gap-3 text-body-md text-body">
                  <Icon name="check" size={20} className="mt-0.5 shrink-0 text-primary-text" />
                  {point}
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-center gap-2">
          <PhoneFrame route={'route' in feature ? feature.route : ''} image={'image' in feature ? feature.image : undefined} label={copy.chrome.phoneLabel(feature.title)} height={FEATURE_PHONE_PX} />
          <p className="text-[0.625rem] text-muted">{'image' in feature ? copy.features.shot : copy.features.tap}</p>
        </div>
      </div>
    </Slide>
  );
  FeatureSlide.displayName = `FeatureSlide(${feature.title})`;
  return FeatureSlide;
});

export const MeasureSlide = () => (
  <Slide tone="dark" eyebrow={copy.built.measureTitle}>
    <div className="flex flex-1 flex-col justify-center gap-10">
      <ul className="grid grid-cols-3 gap-4">
        {copy.built.measures.map((measure, index) => (
          <li key={measure.value}>
            <Reveal order={1 + index * 2} className="flex h-full flex-col gap-3 rounded-lg border border-on-dark/10 bg-on-dark/5 p-6">
              <p className={`font-display text-display-xl ${index === 0 ? 'text-accent' : 'text-on-dark'}`}>{measure.value}</p>
              <p className="text-body-md text-on-dark/70">{measure.label}</p>
            </Reveal>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-3">
        <Reveal order={7}>
          <p className="text-badge uppercase tracking-[0.22em] text-accent">{copy.next.eyebrow}</p>
        </Reveal>
        <ul className="flex flex-wrap gap-2">
          {copy.next.items.map((item, index) => (
            <li key={item}>
              <Reveal order={8 + index}>
                <span className="flex h-10 items-center rounded-sm border border-on-dark/20 px-4 text-button-sm text-on-dark">{item}</span>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </Slide>
);

export const CloseSlide = () => (
  <Slide tone="dark">
    <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
      <HostedMark size={120} animated />
      <Reveal order={8}>
        <h2 className="max-w-3xl font-display text-earnings-display text-on-dark">{copy.next.close}</h2>
      </Reveal>
      <Reveal order={11}>
        <Button href={DECK_SCREENS.landing} size="md" fullWidth={false}>
          {copy.next.openApp}
        </Button>
      </Reveal>
      <Reveal order={13} className="flex flex-col items-center gap-3">
        <HostedLogo name={copy.appName} onDark size="sm" />
        <p className="text-caption text-on-dark/60">{copy.repo}</p>
      </Reveal>
    </div>
  </Slide>
);
