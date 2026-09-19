import { HostedLogo, PatternField } from '@/shared/components';
import { COPY_EXPLORE, TRAVELLER_ROUTES } from '../constants';
import { SearchPillLink } from './SearchPillLink';

/** DESIGN.md dark-hero: the wordmark, one display headline, one line, and the search pill. One of only two dark surfaces. */
export const ExploreHero = () => (
  <header className="relative overflow-hidden rounded-b-lg bg-primary-deep">
    <PatternField />
    <div className="relative mx-auto flex max-w-page flex-col gap-6 px-4 pb-8 pt-8 tablet:px-6 tablet:pb-12 tablet:pt-12">
      <HostedLogo name={COPY_EXPLORE.wordmark} onDark />
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-display-xl text-on-dark">{COPY_EXPLORE.headline}</h1>
        <p className="max-w-xl text-body-md text-on-dark/70">{COPY_EXPLORE.sub}</p>
      </div>
      <div className="max-w-xl">
        <SearchPillLink href={TRAVELLER_ROUTES.search} label={COPY_EXPLORE.searchPill} onDark />
      </div>
    </div>
  </header>
);
