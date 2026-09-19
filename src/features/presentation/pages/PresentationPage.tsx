'use client';

import type { ComponentType } from 'react';
import {
  BuiltSlide,
  CloseSlide,
  DeckStage,
  DoorsSlide,
  FeatureSlides,
  GroupSlide,
  HostSlide,
  ImpactSlide,
  MoneySlide,
  NextSlide,
  NumbersSlide,
  OneLinerSlide,
  PayoutSlide,
  PrinciplesSlide,
  ProblemSlide,
  TitleSlide,
  TrendOneSlide,
  TrendTwoSlide,
} from '../components';
import { useDeckNavigation } from '../hooks';

/**
 * The order of the pitch: the problem, the numbers that prove it, why nobody can get in, our one line, why now,
 * how it works on each side, what it is built on, what is real, a slide per feature you can tap, what changes if it
 * works, and what comes next.
 */
const SLIDES: ComponentType[] = [
  TitleSlide,
  ProblemSlide,
  NumbersSlide,
  MoneySlide,
  DoorsSlide,
  OneLinerSlide,
  TrendOneSlide,
  TrendTwoSlide,
  HostSlide,
  PayoutSlide,
  GroupSlide,
  PrinciplesSlide,
  BuiltSlide,
  ...FeatureSlides,
  ImpactSlide,
  NextSlide,
  CloseSlide,
];

export const PresentationPage = () => {
  const deck = useDeckNavigation(SLIDES.length);
  const Current = SLIDES[deck.index];

  return (
    <DeckStage
      index={deck.index}
      total={SLIDES.length}
      onNext={deck.next}
      onPrevious={deck.previous}
      onGoTo={deck.goTo}
      isFullScreen={deck.isFullScreen}
      onToggleFullScreen={deck.toggleFullScreen}
    >
      {/* Only the current slide is mounted, so every entrance and every chart plays again each time it is shown. */}
      <Current key={deck.index} />
    </DeckStage>
  );
};
