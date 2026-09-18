'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Banner, Button, Skeleton, VoiceNotePlayer, VoiceRecordButton, formatClock } from '@/shared/components';
import { HostScreen } from '../../components';
import { CREATE_FLOW_STEPS, HOST_COPY, HOST_ROUTES, LANGUAGES, NEW_DRAFT_KEY, VOICE_NOTE_MAX_SECONDS, VOICE_NOTE_MIN_SECONDS } from '../../constants';
import { useBlobUrl, useHostApp, useOnline, useRequireDraft, useVoiceRecorder } from '../../hooks';
import type { HostAppState, LanguageCode } from '../../interfaces';
import { hostAppStore, selectHost, transcribeVoiceNote, waitForDraftedListing } from '../../services';

const copy = HOST_COPY.create.voice;
const selectLanguage = (state: HostAppState): LanguageCode => selectHost(state).language;

export const VoiceNotePage = () => {
  const router = useRouter();
  const online = useOnline();
  const recorder = useVoiceRecorder();
  const language = useHostApp(selectLanguage);
  const draft = useRequireDraft(NEW_DRAFT_KEY, HOST_ROUTES.create.category);
  const [busy, setBusy] = useState<'listening' | 'drafting'>();
  const [tooShort, setTooShort] = useState(false);

  const kind = draft?.fields.kind;
  const transcript = draft?.fields.transcript;
  const hasNote = Boolean(draft?.fields.voiceNoteKey);
  const noteUrl = useBlobUrl(draft?.fields.voiceNoteKey);
  const recording = recorder.status === 'recording';

  // Runs as soon as there is a voice note and signal, which also covers a note recorded offline.
  useEffect(() => {
    if (!kind || !hasNote || transcript || !online) return undefined;
    let cancelled = false;
    setBusy('listening');
    void transcribeVoiceNote(kind, language).then((text) => {
      if (cancelled) return;
      hostAppStore.patchDraftFields(NEW_DRAFT_KEY, { transcript: text });
      setBusy(undefined);
    });
    return () => {
      cancelled = true;
      setBusy(undefined);
    };
  }, [kind, hasNote, transcript, online, language]);

  const finish = async (): Promise<void> => {
    const result = await recorder.stop();
    if (!result) return;
    setTooShort(result.seconds < VOICE_NOTE_MIN_SECONDS);
    if (result.seconds >= VOICE_NOTE_MIN_SECONDS) await hostAppStore.saveVoiceNote(NEW_DRAFT_KEY, result.audio, result.seconds);
  };

  useEffect(() => {
    if (recording && recorder.seconds >= VOICE_NOTE_MAX_SECONDS) void finish();
    // finish is recreated every render; the seconds tick is the only trigger that matters here.
  }, [recording, recorder.seconds]);

  const recordAgain = (): void => hostAppStore.patchDraftFields(NEW_DRAFT_KEY, { transcript: undefined, voiceNoteKey: undefined, voiceNoteSeconds: undefined });

  const accept = async (): Promise<void> => {
    setBusy('drafting');
    await waitForDraftedListing();
    hostAppStore.applyDraftedListing(NEW_DRAFT_KEY);
    hostAppStore.patchDraft(NEW_DRAFT_KEY, { source: 'voice' });
    router.push(HOST_ROUTES.create.draft);
  };

  const typeInstead = (
    <Button variant="tertiary" href={HOST_ROUTES.create.form(1)}>
      {copy.type}
    </Button>
  );

  return (
    <HostScreen
      barTitle={HOST_COPY.create.flowTitle}
      backHref={HOST_ROUTES.create.category}
      step={{ current: 2, total: CREATE_FLOW_STEPS }}
      heading={copy.title}
      helper={copy.prompt}
      footer={
        transcript ? (
          <>
            <Button onClick={() => void accept()} disabled={busy === 'drafting'}>
              {busy === 'drafting' ? copy.drafting : copy.right}
            </Button>
            <Button variant="secondary" icon="retake" onClick={recordAgain} disabled={busy === 'drafting'}>
              {copy.again}
            </Button>
          </>
        ) : (
          typeInstead
        )
      }
    >
      {transcript ? (
        <div className="flex flex-col gap-4">
          <h2 className="text-title-md text-ink">{copy.heard}</h2>
          <p lang={LANGUAGES.find((item) => item.code === language)?.htmlLang} className="rounded-lg bg-surface-soft p-5 text-body-host text-ink">
            {transcript}
          </p>
          {noteUrl ? (
            <VoiceNotePlayer src={noteUrl} seconds={draft?.fields.voiceNoteSeconds ?? 0} playLabel={HOST_COPY.common.voice.play} pauseLabel={HOST_COPY.common.voice.pause} />
          ) : null}
        </div>
      ) : busy === 'listening' ? (
        <div role="status" className="flex flex-col gap-3">
          <p className="text-body-host text-ink">{copy.listening}</p>
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-2/3" />
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <VoiceRecordButton
            recording={recording}
            label={copy.hold}
            disabled={hasNote}
            onStart={() => {
              setTooShort(false);
              void recorder.start();
            }}
            onStop={() => void finish()}
          />
          <p className="text-body-host text-ink">{recording ? HOST_COPY.common.voice.recording : copy.hold}</p>
          {recording ? (
            <p aria-live="off" className="text-caption text-ink">{`${formatClock(recorder.seconds)} / ${formatClock(VOICE_NOTE_MAX_SECONDS)}`}</p>
          ) : null}
          {recorder.status === 'blocked' ? <Banner tone="error">{HOST_COPY.common.voice.blocked}</Banner> : null}
          {tooShort ? <Banner tone="error">{HOST_COPY.common.voice.tooShort}</Banner> : null}
          {hasNote && !online ? <Banner tone="warning">{copy.savedOffline}</Banner> : null}
        </div>
      )}
    </HostScreen>
  );
};
