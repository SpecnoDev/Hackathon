'use client';

import { Button, Icon, OptionTile } from '@/shared/components';
import { HostScreen } from '../../components';
import { HOST_COPY, HOST_ROUTES } from '../../constants';
import { useHostApp } from '../../hooks';
import type { HostAppState } from '../../interfaces';
import { selectHost } from '../../services';

const copy = HOST_COPY.register.done;
const selectFirstName = (state: HostAppState): string => selectHost(state).firstName;
const goThere = <Icon name="chevron-right" className="shrink-0 text-muted" />;

export const RegisteredPage = () => {
  const firstName = useHostApp(selectFirstName);

  return (
    <HostScreen
      heading={copy.title(firstName)}
      helper={copy.body}
      footer={
        <Button variant="tertiary" href={HOST_ROUTES.offerings.list}>
          {copy.skip}
        </Button>
      }
    >
      <div className="flex flex-col gap-3">
        <OptionTile icon="shield-check" title={copy.verifyTitle} description={copy.verifyBody} href={HOST_ROUTES.verify.why} trailing={goThere} />
        <OptionTile icon="mic" title={copy.offerTitle} description={copy.offerBody} href={HOST_ROUTES.create.category} trailing={goThere} />
      </div>
    </HostScreen>
  );
};
