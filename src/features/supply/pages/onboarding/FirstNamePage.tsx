'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, TextInput } from '@/shared/components';
import { HostScreen } from '../../components';
import { DEMO_FIRST_NAME, HOST_COPY, HOST_ROUTES, REGISTER_FLOW_STEPS, isDemoMode } from '../../constants';
import { firstIssue, firstNameSchema } from '../../dto';
import { useHostApp } from '../../hooks';
import type { HostAppState } from '../../interfaces';
import { hostAppStore } from '../../services';

const NAME_STEP = 4;
const copy = HOST_COPY.register.name;
const selectFirstName = (state: HostAppState): string => state.registration.firstName ?? '';

export const FirstNamePage = () => {
  const router = useRouter();
  const firstName = useHostApp(selectFirstName);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (isDemoMode() && !firstName) hostAppStore.answerRegistration({ firstName: DEMO_FIRST_NAME });
  }, [firstName]);

  const next = (): void => {
    const issue = firstIssue(firstNameSchema, firstName);
    setError(issue);
    if (!issue) router.push(HOST_ROUTES.register.contact);
  };

  return (
    <HostScreen
      barTitle={HOST_COPY.register.flowTitle}
      backHref={HOST_ROUTES.register.code}
      step={{ current: NAME_STEP, total: REGISTER_FLOW_STEPS }}
      heading={copy.title}
      footer={<Button onClick={next}>{HOST_COPY.common.continue}</Button>}
    >
      <TextInput
        label={copy.label}
        value={firstName}
        onChange={(value) => hostAppStore.answerRegistration({ firstName: value })}
        helper={copy.helper}
        error={error}
        autoComplete="given-name"
        autoFocus
      />
    </HostScreen>
  );
};
