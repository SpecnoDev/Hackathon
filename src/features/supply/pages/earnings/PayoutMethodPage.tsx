'use client';

import { OptionTile } from '@/shared/components';
import { ChoiceList, HostScreen } from '../../components';
import { HOST_COPY, HOST_ROUTES, PAYOUT_CHANNELS } from '../../constants';
import { useHostApp } from '../../hooks';
import type { HostAppState, PayoutChannel } from '../../interfaces';
import { selectHost } from '../../services';

const copy = HOST_COPY.earnings.method;
const selectChannel = (state: HostAppState): PayoutChannel => selectHost(state).payoutChannel;

/** Screen 29. Cash send is first and preselected: it is the path that needs no bank account. */
export const PayoutMethodPage = () => {
  const current = useHostApp(selectChannel);

  return (
    <HostScreen barTitle={HOST_COPY.earnings.title} backHref={HOST_ROUTES.earnings.home} heading={copy.title} helper={copy.helper}>
      <ChoiceList label={copy.title}>
        {PAYOUT_CHANNELS.map((option) => (
          <OptionTile
            key={option.channel}
            icon={option.icon}
            title={copy.options[option.channel].title}
            description={copy.options[option.channel].description}
            selected={current === option.channel}
            href={HOST_ROUTES.earnings.payoutDetails(option.channel)}
          />
        ))}
      </ChoiceList>
    </HostScreen>
  );
};
