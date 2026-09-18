/** DESIGN.md dark-hero: wordmark, one headline, one line. One of only two dark surfaces on the traveller side. */
export const ExploreHero = () => (
  <header className="bg-surface-dark">
    <div className="mx-auto flex max-w-page flex-col gap-4 px-4 pb-8 pt-8 tablet:px-6 tablet:pb-12 tablet:pt-12">
      <p className="font-display text-display-md text-primary">Hosted</p>
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-display-xl text-on-dark">Real places, real people</h1>
        <p className="max-w-xl text-body-md text-on-dark/70">Meals, walks, lifts and guides from the people who live there.</p>
      </div>
    </div>
  </header>
);
