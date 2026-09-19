import Link from 'next/link';
import { ROUTES } from '@/core/constants';
import { Icon } from '@/shared/components';
import { COPY_COMMON, COPY_EXPLORE, TRAVELLER_ROUTES } from '../constants';
import { SearchPillLink } from './SearchPillLink';

/** DESIGN.md dark-hero: the wordmark, one display headline, one line, and the search pill. One of only two dark surfaces. */
export const ExploreHero = () => (
  <header className="bg-surface-dark">
    <div className="mx-auto flex max-w-page flex-col gap-6 px-4 pb-8 pt-8 tablet:px-6 tablet:pb-12 tablet:pt-12">
      {/* text-primary, not the top-bar recipe's text-primary-text: #00703A fails contrast on surface-dark (~2.8:1), text-primary passes (~5:1), matching how the wordmark below already uses the brighter green on this surface. */}
      <Link href={ROUTES.home} className="inline-flex w-fit items-center gap-1 text-link text-primary underline">
        <Icon name="chevron-left" />
        {COPY_COMMON.back}
      </Link>
      <p className="font-display text-display-md text-primary">{COPY_EXPLORE.wordmark}</p>
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-display-xl text-on-dark">{COPY_EXPLORE.headline}</h1>
        <p className="max-w-xl text-body-md text-on-dark/70">{COPY_EXPLORE.sub}</p>
      </div>
      <div className="max-w-xl">
        <SearchPillLink href={TRAVELLER_ROUTES.search} label={COPY_EXPLORE.searchPill} />
      </div>
    </div>
  </header>
);
