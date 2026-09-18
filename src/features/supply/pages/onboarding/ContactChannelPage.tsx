'use client';

import { useRouter } from 'next/navigation';
import { Button, OptionTile } from '@/shared/components';
import { ChoiceList, HostScreen } from '../../components';
import { CONTACT_CHANNELS, HOST_COPY, HOST_ROUTES, REGISTER_FLOW_STEPS } from '../../constants';
import { useHostApp } from '../../hooks';
import type { ContactChannel, HostAppState } from '../../interfaces';
import { hostAppStore } from '../../services';

const copy = HOST_COPY.register.contact;
/** WhatsApp is preselected: the PRD's hosts trust it most and open it daily. */
const DEFAULT_CHANNEL: ContactChannel = 'WHATSAPP';
const selectChannel = (state: HostAppState): ContactChannel => state.registration.contactChannel ?? DEFAULT_CHANNEL;

export const ContactChannelPage = () => {
  const router = useRouter();
  const channel = useHostApp(selectChannel);

  const finish = (): void => {
    hostAppStore.completeRegistration(channel);
    router.push(HOST_ROUTES.register.done);
  };

  return (
    <HostScreen
      barTitle={HOST_COPY.register.flowTitle}
      backHref={HOST_ROUTES.register.name}
      step={{ current: REGISTER_FLOW_STEPS, total: REGISTER_FLOW_STEPS }}
      heading={copy.title}
      helper={copy.helper}
      footer={<Button onClick={finish}>{HOST_COPY.common.continue}</Button>}
    >
      <ChoiceList label={copy.title}>
        {CONTACT_CHANNELS.map((option) => (
          <OptionTile
            key={option.channel}
            icon={option.icon}
            title={copy.options[option.channel].title}
            description={copy.options[option.channel].description}
            selected={channel === option.channel}
            onSelect={() => hostAppStore.answerRegistration({ contactChannel: option.channel })}
          />
        ))}
      </ChoiceList>
    </HostScreen>
  );
};
