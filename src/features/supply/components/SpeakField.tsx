'use client';

import { useState } from 'react';
import { Banner, TextInput, VoiceRecordButton } from '@/shared/components';
import { HOST_COPY, VOICE_NOTE_MIN_SECONDS } from '../constants';
import { useVoiceRecorder } from '../hooks';

const copy = HOST_COPY.create.editor;

interface SpeakFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  example?: string;
  multiline?: boolean;
  error?: string;
  /**
   * TODO: what the mocked transcription returns for this field. Replace with the transcript from
   * POST /api/v1/ai/transcribe once it exists; the recording itself is already real.
   */
  heardAs: string;
}

/** Voice before typing: the speak button comes first and the text box is always there underneath. */
export const SpeakField = ({ label, value, onChange, example, multiline = false, error, heardAs }: SpeakFieldProps) => {
  const recorder = useVoiceRecorder();
  const [notice, setNotice] = useState<'heard' | 'tooShort'>();

  const finish = async (): Promise<void> => {
    const recording = await recorder.stop();
    if (!recording) return;
    if (recording.seconds < VOICE_NOTE_MIN_SECONDS) {
      setNotice('tooShort');
      return;
    }
    onChange(heardAs);
    setNotice('heard');
  };

  return (
    <div className="flex w-full flex-col gap-6 tablet:max-w-form">
      <div className="flex items-center gap-4">
        <VoiceRecordButton
          size="md"
          recording={recorder.status === 'recording'}
          label={copy.speak}
          onStart={() => void recorder.start()}
          onStop={() => void finish()}
        />
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-title-md text-ink">{recorder.status === 'recording' ? HOST_COPY.common.voice.recording : copy.speak}</p>
          <p className="text-caption text-muted">{copy.speakHint}</p>
        </div>
      </div>
      {recorder.status === 'blocked' ? <Banner tone="error">{HOST_COPY.common.voice.blocked}</Banner> : null}
      {notice === 'tooShort' ? <Banner tone="error">{HOST_COPY.common.voice.tooShort}</Banner> : null}
      {notice === 'heard' ? <Banner tone="success">{copy.heard}</Banner> : null}
      <div className="flex flex-col gap-2">
        <p className="text-caption text-muted">{copy.orType}</p>
        <TextInput label={label} value={value} onChange={onChange} helper={example} error={error} multiline={multiline} />
      </div>
    </div>
  );
};
