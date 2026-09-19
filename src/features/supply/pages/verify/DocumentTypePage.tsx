'use client';

import { useEffect } from 'react';
import { Button, OptionTile } from '@/shared/components';
import { ChoiceList, HostScreen } from '../../components';
import { DEMO_DOCUMENT_TYPE, DOCUMENT_TYPES, HOST_COPY, HOST_ROUTES, VERIFY_FLOW_STEPS, isDemoMode } from '../../constants';
import { useHostApp } from '../../hooks';
import type { DocumentType, HostAppState } from '../../interfaces';
import { hostAppStore } from '../../services';

const copy = HOST_COPY.verify.document;
const selectDocumentType = (state: HostAppState): DocumentType | undefined => state.verification.documentType;

export const DocumentTypePage = () => {
  const chosen = useHostApp(selectDocumentType);

  useEffect(() => {
    if (isDemoMode() && !chosen) hostAppStore.setVerification({ documentType: DEMO_DOCUMENT_TYPE });
  }, [chosen]);

  return (
    <HostScreen
      barTitle={HOST_COPY.verify.flowTitle}
      backHref={HOST_ROUTES.verify.why}
      step={{ current: 1, total: VERIFY_FLOW_STEPS }}
      heading={copy.title}
      helper={copy.helper}
      footer={
        <Button href={HOST_ROUTES.verify.documentPhoto} disabled={!chosen}>
          {HOST_COPY.common.continue}
        </Button>
      }
    >
      <ChoiceList label={copy.title}>
        {DOCUMENT_TYPES.map((option) => (
          <OptionTile
            key={option.type}
            icon={option.icon}
            title={copy.options[option.type].title}
            description={copy.options[option.type].description}
            selected={chosen === option.type}
            onSelect={() => hostAppStore.setVerification({ documentType: option.type })}
          />
        ))}
      </ChoiceList>
    </HostScreen>
  );
};
