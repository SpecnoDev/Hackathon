'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, OptionTile } from '@/shared/components';
import { ChoiceList, HostScreen } from '../../components';
import { CREATE_FLOW_STEPS, HOST_COPY, HOST_ROUTES, NEW_DRAFT_KEY, OFFERING_KINDS } from '../../constants';
import { useDraft } from '../../hooks';
import type { OfferingKind } from '../../interfaces';
import { hostAppStore } from '../../services';

const copy = HOST_COPY.create.category;

export const OfferingCategoryPage = () => {
  const router = useRouter();
  const draft = useDraft(NEW_DRAFT_KEY);
  const [picked, setPicked] = useState<OfferingKind>();
  const kind = picked ?? draft?.fields.kind;

  const next = (): void => {
    if (!kind) return;
    hostAppStore.startDraft(kind);
    router.push(HOST_ROUTES.create.voice);
  };

  return (
    <HostScreen
      barTitle={HOST_COPY.create.flowTitle}
      backHref={HOST_ROUTES.offerings.list}
      step={{ current: 1, total: CREATE_FLOW_STEPS }}
      heading={copy.title}
      footer={
        <Button onClick={next} disabled={!kind}>
          {HOST_COPY.common.continue}
        </Button>
      }
    >
      <ChoiceList label={copy.title}>
        {OFFERING_KINDS.map((option) => (
          <OptionTile
            key={option.kind}
            icon={option.icon}
            title={copy.kinds[option.kind].title}
            description={copy.kinds[option.kind].description}
            unavailable={!option.available}
            selected={kind === option.kind}
            onSelect={() => setPicked(option.kind)}
          />
        ))}
      </ChoiceList>
    </HostScreen>
  );
};
