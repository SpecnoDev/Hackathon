import { SearchForm, TravellerScreen } from '@/features/demand/components';
import { COPY_EXPLORE, SEARCH_FORM_ID, TRAVELLER_ROUTES } from '@/features/demand/constants';
import { exploreQueryFromParams } from '@/features/demand/utils';
import { Button } from '@/shared/components';

type RawParams = Record<string, string | string[] | undefined>;

export const metadata = { title: 'Search' };

/** Screen 2: the full-screen search the pill opens. Reopened from results it starts from that search, so the key remounts the form on a new URL. */
export default async function SearchPage({ searchParams }: { searchParams: Promise<RawParams> }) {
  const params = await searchParams;
  const initial = exploreQueryFromParams(params);

  return (
    <TravellerScreen
      barTitle={COPY_EXPLORE.search.title}
      backHref={TRAVELLER_ROUTES.home}
      width="column"
      footer={
        <Button size="md" icon="search" type="submit" form={SEARCH_FORM_ID}>
          {COPY_EXPLORE.search.submit}
        </Button>
      }
    >
      <SearchForm key={JSON.stringify(initial)} initial={initial} />
    </TravellerScreen>
  );
}
