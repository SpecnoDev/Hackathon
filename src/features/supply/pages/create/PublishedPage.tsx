'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Icon, type IconName } from '@/shared/components';
import { HostScreen } from '../../components';
import { HOST_COPY, HOST_ROUTES } from '../../constants';
import { useHostApp, useHostAppReady } from '../../hooks';
import type { HostAppState, PublishOutcome, PublishResult } from '../../interfaces';

const RESULT_ICON_PX = 48;
const copy = HOST_COPY.create;
const selectLastPublished = (state: HostAppState): PublishResult | undefined => state.lastPublished;

const LOOK: Record<PublishOutcome, { icon: IconName; shell: string; ctaHref?: string }> = {
  LIVE: { icon: 'check', shell: 'bg-primary-tint text-primary-text' },
  WAITING_TO_UPLOAD: { icon: 'cloud-off', shell: 'bg-accent-tint text-ink' },
  NEEDS_ID: { icon: 'shield-check', shell: 'bg-accent-tint text-ink', ctaHref: HOST_ROUTES.verify.why },
  NEEDS_LICENCE: { icon: 'clock', shell: 'bg-accent-tint text-ink', ctaHref: HOST_ROUTES.verify.community },
};

export const PublishedPage = () => {
  const router = useRouter();
  const ready = useHostAppReady();
  const published = useHostApp(selectLastPublished);

  useEffect(() => {
    if (ready && !published) router.replace(HOST_ROUTES.offerings.list);
  }, [ready, published, router]);

  if (!published) return <HostScreen barTitle={copy.flowTitle}>{null}</HostScreen>;

  const result = copy.published[published.outcome];
  const look = LOOK[published.outcome];

  return (
    <HostScreen
      barTitle={copy.flowTitle}
      footer={
        <>
          {result.cta && look.ctaHref ? <Button href={look.ctaHref}>{result.cta}</Button> : null}
          <Button variant={result.cta ? 'secondary' : 'primary'} href={HOST_ROUTES.offerings.list}>
            {copy.publishedList}
          </Button>
          <Button variant="tertiary" href={HOST_ROUTES.create.category}>
            {copy.publishedAnother}
          </Button>
        </>
      }
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <span className={`flex size-24 items-center justify-center rounded-full ${look.shell}`}>
          <Icon name={look.icon} size={RESULT_ICON_PX} />
        </span>
        <h1 className="font-display text-display-lg text-ink">{result.title}</h1>
        <div className="flex flex-col gap-2">
          {result.lines.map((line) => (
            <p key={line} className="text-body-host text-ink">
              {line}
            </p>
          ))}
        </div>
      </div>
    </HostScreen>
  );
};
