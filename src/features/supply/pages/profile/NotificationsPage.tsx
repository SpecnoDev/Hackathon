'use client';

import { useState } from 'react';
import { Banner, ToggleRow } from '@/shared/components';
import { HostScreen } from '../../components';
import { CONTACT_CHANNELS, HOST_COPY, HOST_ROUTES } from '../../constants';
import { useHostApp } from '../../hooks';
import type { ContactChannel, Host, HostAppState } from '../../interfaces';
import { hostAppStore, selectHost } from '../../services';

const copy = HOST_COPY.profile.notificationsScreen;
const selectNotifications = (state: HostAppState): Host['notifications'] => selectHost(state).notifications;

export const NotificationsPage = () => {
  const notifications = useHostApp(selectNotifications);
  const [blockedLastOff, setBlockedLastOff] = useState(false);

  const toggle = (channel: ContactChannel, on: boolean): void => {
    const othersOn = CONTACT_CHANNELS.some((option) => option.channel !== channel && notifications[option.channel]);
    // A host with every channel off would never hear about a booking.
    setBlockedLastOff(!on && !othersOn);
    if (on || othersOn) hostAppStore.setNotification(channel, on);
  };

  return (
    <HostScreen barTitle={HOST_COPY.profile.title} backHref={HOST_ROUTES.profile.home} heading={copy.title} helper={copy.helper}>
      <div className="flex flex-col gap-3">
        {CONTACT_CHANNELS.map((option) => (
          <ToggleRow
            key={option.channel}
            icon={option.icon}
            label={copy.channels[option.channel]}
            checked={notifications[option.channel]}
            onLabel={copy.on}
            offLabel={copy.off}
            onChange={(on) => toggle(option.channel, on)}
          />
        ))}
        {blockedLastOff ? <Banner tone="warning">{copy.keepOne}</Banner> : null}
      </div>
    </HostScreen>
  );
};
