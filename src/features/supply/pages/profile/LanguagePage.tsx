'use client';

import { Banner, OptionTile, useToast } from '@/shared/components';
import { ChoiceList, HostScreen } from '../../components';
import { HOST_COPY, HOST_ROUTES, LANGUAGES } from '../../constants';
import { useHostApp } from '../../hooks';
import type { HostAppState, LanguageCode } from '../../interfaces';
import { hostAppStore, selectHost } from '../../services';

const copy = HOST_COPY.profile.languageScreen;
const selectLanguage = (state: HostAppState): LanguageCode => selectHost(state).language;

export const LanguagePage = () => {
  const toast = useToast();
  const current = useHostApp(selectLanguage);

  const choose = (language: LanguageCode): void => {
    hostAppStore.setHostLanguage(language);
    toast(copy.saved);
  };

  return (
    <HostScreen barTitle={HOST_COPY.profile.title} backHref={HOST_ROUTES.profile.home} heading={copy.title}>
      <div className="flex flex-col gap-6">
        <ChoiceList label={copy.title}>
          {LANGUAGES.map((language) => (
            <OptionTile
              key={language.code}
              size="lg"
              title={language.name}
              lang={language.htmlLang}
              selected={current === language.code}
              onSelect={() => choose(language.code)}
            />
          ))}
        </ChoiceList>
        <Banner tone="info">{copy.note}</Banner>
      </div>
    </HostScreen>
  );
};
