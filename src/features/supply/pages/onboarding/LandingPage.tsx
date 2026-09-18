'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { APP_NAME } from '@/core/constants';
import { Button, Icon, type IconName } from '@/shared/components';
import { platformFeePercent } from '@/shared/utils';
import { HostScreen } from '../../components';
import { HOST_COPY, HOST_ROUTES } from '../../constants';
import { hostAppStore } from '../../services';

const copy = HOST_COPY.welcome;

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="flex flex-col gap-4 border-t border-hairline-soft pt-8">
    <h2 className="text-title-lg text-ink">{title}</h2>
    {children}
  </section>
);

const TickList = ({ items, icon }: { items: readonly string[]; icon: IconName }) => (
  <ul className="flex flex-col gap-3">
    {items.map((item) => (
      <li key={item} className="flex items-start gap-3 text-body-host text-ink">
        <Icon name={icon} className={`mt-0.5 shrink-0 ${icon === 'check' ? 'text-primary-text' : 'text-muted'}`} />
        {item}
      </li>
    ))}
  </ul>
);

/**
 * Screen 1: a plain website landing page for someone deciding whether to become a host. What it is,
 * how it works, who it is for, what you need, what it costs. Text first, no images, so it opens on a prepaid bundle.
 */
export const LandingPage = () => {
  const router = useRouter();

  const join = (): void => {
    hostAppStore.startRegistration();
    router.push(HOST_ROUTES.register.language);
  };

  return (
    <HostScreen
      footer={
        <>
          <Button onClick={join}>{copy.join}</Button>
          <Button variant="tertiary" href={HOST_ROUTES.offerings.list}>
            {copy.returning}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-8">
        <header className="flex items-center justify-between">
          <p className="font-display text-display-md text-primary">{APP_NAME}</p>
          <Button size="md" fullWidth={false} onClick={join}>
            {copy.joinShort}
          </Button>
        </header>

        <div className="flex flex-col gap-4 py-4">
          <h1 className="font-display text-display-xl text-ink">{copy.hero.title}</h1>
          <p className="text-body-host text-body">{copy.hero.body}</p>
        </div>

        <Section title={copy.how.title}>
          <ol className="flex flex-col gap-5">
            {copy.how.steps.map((step, index) => (
              <li key={step.title} className="flex items-start gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary-text">
                  <Icon name={step.icon} />
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-title-md text-ink">{`${index + 1}. ${step.title}`}</h3>
                  <p className="text-body-host text-body">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section title={copy.who.title}>
          <p className="text-body-host text-body">{copy.who.body}</p>
          <ul className="flex flex-wrap gap-2">
            {copy.who.people.map((person) => (
              <li key={person} className="rounded-full bg-surface-soft px-4 py-2.5 text-button-sm text-ink">
                {person}
              </li>
            ))}
          </ul>
        </Section>

        <Section title={copy.need.title}>
          <TickList items={copy.need.items} icon="check" />
          <h3 className="pt-2 text-title-md text-ink">{copy.need.notTitle}</h3>
          <TickList items={copy.need.notItems} icon="x" />
        </Section>

        <Section title={copy.cost.title}>
          <p className="rounded-lg bg-accent-tint p-5 text-body-host text-ink">{copy.cost.body(platformFeePercent())}</p>
        </Section>
      </div>
    </HostScreen>
  );
};
