'use client';

import { Banner, Button, TierCard } from '@/shared/components';
import { formatRand } from '@/shared/utils';
import { HostScreen, TierBadge } from '../../components';
import { HOST_COPY, HOST_ROUTES, TIER_ONE_BOOKING_CAP_CENTS, TIER_ORDER } from '../../constants';
import { useHostApp } from '../../hooks';
import type { HostAppState, VerificationTier } from '../../interfaces';
import { selectHost } from '../../services';

const copy = HOST_COPY.verify.why;
const selectTier = (state: HostAppState): VerificationTier => selectHost(state).tier;

const unlocks = (tier: VerificationTier): string =>
  tier === 'IDENTITY' ? `${copy.tiers.IDENTITY.unlocks} ${copy.cap(formatRand(TIER_ONE_BOOKING_CAP_CENTS))}` : copy.tiers[tier].unlocks;

export const WhyVerifyPage = () => {
  const tier = useHostApp(selectTier);

  return (
    <HostScreen
      barTitle={HOST_COPY.verify.flowTitle}
      backHref={HOST_ROUTES.profile.home}
      heading={copy.title}
      helper={copy.helper}
      footer={
        <>
          {tier === 'REGISTERED' ? <Button href={HOST_ROUTES.verify.document}>{copy.cta}</Button> : null}
          {tier === 'IDENTITY' ? <Button href={HOST_ROUTES.verify.community}>{copy.ctaDone}</Button> : null}
          <Button variant="secondary" href={HOST_ROUTES.offerings.list}>
            {copy.later}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        {TIER_ORDER.map((item) => (
          <TierCard
            key={item}
            name={copy.tiers[item].name}
            unlocks={unlocks(item)}
            badge={<TierBadge tier={item} />}
            currentLabel={item === tier ? copy.current : undefined}
          />
        ))}
        {tier === 'COMMUNITY' ? <Banner tone="success">{HOST_COPY.verify.community.done}</Banner> : null}
      </div>
    </HostScreen>
  );
};
