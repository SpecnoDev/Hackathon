'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Chip, Sheet, ToggleRow } from '@/shared/components';
import { LANGUAGE_CODES, OFFERING_SORTS, type OfferingListQuery, type OfferingSummary } from '@/shared/dto';
import { formatRand } from '@/shared/utils';
import { COPY_COMMON, COPY_EXPLORE, DEFAULT_SORT, DURATION_FILTER_STEPS_MIN, PRICE_FILTER_STEPS_CENTS } from '../constants';
import { formatDuration, resultsHref, withoutFilters } from '../utils';

const copy = COPY_EXPLORE.results.filter;

const Group = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <fieldset className="flex flex-col gap-3">
    <legend className="mb-3 text-title-sm text-ink">{title}</legend>
    <div className="flex flex-wrap gap-2">{children}</div>
  </fieldset>
);

/** Filters are tried against the real list as they are tapped, so "Show 7 places" is always true. Applying writes them to the URL. */
export const FilterSheet = ({ query, closeHref }: { query: OfferingListQuery; closeHref: string }) => {
  const router = useRouter();
  const [draft, setDraft] = useState(query);
  const [count, setCount] = useState<number>();

  useEffect(() => {
    const controller = new AbortController();
    const params = resultsHref(draft).split('?')[1] ?? '';
    fetch(`/api/v1/offerings?${params}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((body: { data?: OfferingSummary[] }) => setCount(body.data?.length))
      .catch(() => undefined);
    return () => controller.abort();
  }, [draft]);

  const patch = (change: Partial<OfferingListQuery>): void => setDraft((current) => ({ ...current, ...change }));
  const close = (): void => router.push(closeHref);

  return (
    <Sheet
      title={copy.title}
      closeLabel={COPY_COMMON.close}
      onClose={close}
      actions={
        <>
          <Button size="md" onClick={() => router.push(resultsHref(draft))}>
            {copy.apply(count)}
          </Button>
          <Button size="md" variant="secondary" onClick={() => router.push(resultsHref(withoutFilters(draft)))}>
            {COPY_EXPLORE.results.clear}
          </Button>
        </>
      }
    >
      <div className="flex max-h-[50dvh] flex-col gap-6 overflow-y-auto text-body-md">
        <Group title={copy.price}>
          {PRICE_FILTER_STEPS_CENTS.map((cents) => (
            <Chip key={cents} label={formatRand(cents)} selected={draft.maxPriceCents === cents} onToggle={() => patch({ maxPriceCents: draft.maxPriceCents === cents ? undefined : cents })} />
          ))}
        </Group>
        <Group title={copy.duration}>
          {DURATION_FILTER_STEPS_MIN.map((minutes) => (
            <Chip key={minutes} label={formatDuration(minutes) ?? ''} selected={draft.maxDurationMin === minutes} onToggle={() => patch({ maxDurationMin: draft.maxDurationMin === minutes ? undefined : minutes })} />
          ))}
        </Group>
        <Group title={copy.language}>
          {LANGUAGE_CODES.map((code) => (
            <Chip key={code} label={COPY_COMMON.languageName[code]} selected={draft.lang === code} onToggle={() => patch({ lang: draft.lang === code ? undefined : code })} />
          ))}
        </Group>
        <Group title={copy.sort}>
          {OFFERING_SORTS.map((sort) => (
            <Chip key={sort} label={COPY_EXPLORE.results.sort[sort]} selected={(draft.sort ?? DEFAULT_SORT) === sort} onToggle={() => patch({ sort: sort === DEFAULT_SORT ? undefined : sort })} />
          ))}
        </Group>
        <ToggleRow icon="shield-check" label={copy.verifiedOnly} checked={Boolean(draft.verifiedOnly)} onLabel={COPY_COMMON.on} offLabel={COPY_COMMON.off} onChange={(verifiedOnly) => patch({ verifiedOnly: verifiedOnly || undefined })} />
      </div>
    </Sheet>
  );
};
