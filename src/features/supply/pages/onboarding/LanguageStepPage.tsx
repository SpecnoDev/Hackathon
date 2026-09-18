'use client';

import { Button, OptionTile } from '@/shared/components';
import { ChoiceList, HostScreen } from '../../components';
import { HOST_COPY, HOST_ROUTES, LANGUAGES, REGISTER_FLOW_STEPS } from '../../constants';
import { useHostApp } from '../../hooks';
import type { HostAppState, LanguageCode } from '../../interfaces';
import { hostAppStore } from '../../services';

const copy = HOST_COPY.register.language;
const selectLanguage = (state: HostAppState): LanguageCode | undefined => state.registration.language;

/** PRD: "Choose language first, before anything else." */
export const LanguageStepPage = () => {
  const chosen = useHostApp(selectLanguage);

  return (
    <HostScreen
      barTitle={HOST_COPY.register.flowTitle}
      backHref={HOST_ROUTES.welcome}
      step={{ current: 1, total: REGISTER_FLOW_STEPS }}
      heading={copy.title}
      helper={copy.helper}
      footer={
        <Button href={HOST_ROUTES.register.phone} disabled={!chosen}>
          {HOST_COPY.common.continue}
        </Button>
      }
    >
      <ChoiceList label={copy.title}>
        {LANGUAGES.map((language) => (
          <OptionTile
            key={language.code}
            size="lg"
            title={language.name}
            lang={language.htmlLang}
            selected={chosen === language.code}
            onSelect={() => hostAppStore.answerRegistration({ language: language.code })}
          />
        ))}
      </ChoiceList>
    </HostScreen>
  );
};
