'use client';

import { useState } from 'react';
import { Banner, Button, OptionTile, TextInput } from '@/shared/components';
import { ChoiceList, HostScreen } from '../../components';
import { COMMUNITY_PROOFS, HOST_COPY, HOST_ROUTES } from '../../constants';
import { communityProofSchema, firstIssue } from '../../dto';
import { useHostApp } from '../../hooks';
import type { CommunityProofType, Host, HostAppState } from '../../interfaces';
import { hostAppStore, selectHost } from '../../services';

const copy = HOST_COPY.verify.community;
const selectCurrentHost = (state: HostAppState): Host => selectHost(state);

/** Phase 2 in the PRD. The entry point and the submission exist; the checking itself does not. */
export const CommunityVerificationPage = () => {
  const host = useHostApp(selectCurrentHost);
  const [type, setType] = useState<CommunityProofType>();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string>();
  const waiting = Boolean(host.communityProof) && host.tier !== 'COMMUNITY';

  const submit = (): void => {
    if (!type) return;
    const issue = firstIssue(communityProofSchema, value);
    setError(issue);
    if (!issue) hostAppStore.submitCommunityProof(type, value);
  };

  if (host.tier === 'COMMUNITY' || waiting) {
    return (
      <HostScreen
        barTitle={HOST_COPY.verify.flowTitle}
        backHref={HOST_ROUTES.profile.home}
        heading={copy.title}
        footer={<Button href={HOST_ROUTES.profile.home}>{HOST_COPY.common.continue}</Button>}
      >
        <Banner tone={waiting ? 'warning' : 'success'} icon={waiting ? 'clock' : undefined}>
          {waiting ? copy.pending : copy.done}
        </Banner>
      </HostScreen>
    );
  }

  return (
    <HostScreen
      barTitle={HOST_COPY.verify.flowTitle}
      backHref={HOST_ROUTES.verify.why}
      heading={copy.title}
      helper={copy.helper}
      footer={
        <Button onClick={submit} disabled={!type}>
          {copy.submit}
        </Button>
      }
    >
      <div className="flex flex-col gap-6">
        <ChoiceList label={copy.title}>
          {COMMUNITY_PROOFS.map((option) => (
            <OptionTile
              key={option.type}
              icon={option.icon}
              title={copy.options[option.type].title}
              description={copy.options[option.type].description}
              selected={type === option.type}
              onSelect={() => {
                setType(option.type);
                setError(undefined);
              }}
            />
          ))}
        </ChoiceList>
        {type ? <TextInput label={copy.options[type].label} value={value} onChange={setValue} error={error} /> : null}
      </div>
    </HostScreen>
  );
};
