'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MS_PER_SECOND } from '../constants';

export type RecorderStatus = 'idle' | 'recording' | 'blocked';

export interface VoiceRecording {
  audio: Blob;
  seconds: number;
}

interface VoiceRecorder {
  status: RecorderStatus;
  seconds: number;
  start: () => Promise<void>;
  /** Resolves with the recording, or null when nothing was captured. */
  stop: () => Promise<VoiceRecording | null>;
}

const TICK_MS = 250;

/** MediaRecorder, as docs/TECH_STACK.md specifies. No speech API: transcription happens on the server. */
export const useVoiceRecorder = (): VoiceRecorder => {
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [seconds, setSeconds] = useState(0);
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const startedAt = useRef(0);
  const ticker = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  /** A host can let go before the browser has finished asking for the microphone. */
  const held = useRef(false);

  const release = useCallback((): void => {
    clearInterval(ticker.current);
    recorder.current?.stream.getTracks().forEach((track) => track.stop());
    recorder.current = null;
  }, []);

  useEffect(() => release, [release]);

  const start = useCallback(async (): Promise<void> => {
    if (recorder.current) return;
    held.current = true;
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setStatus('blocked');
      return;
    }
    if (!held.current) {
      stream.getTracks().forEach((track) => track.stop());
      return;
    }
    chunks.current = [];
    const next = new MediaRecorder(stream);
    next.ondataavailable = (event) => chunks.current.push(event.data);
    next.start();
    recorder.current = next;
    startedAt.current = Date.now();
    setSeconds(0);
    setStatus('recording');
    ticker.current = setInterval(() => setSeconds(Math.floor((Date.now() - startedAt.current) / MS_PER_SECOND)), TICK_MS);
  }, []);

  const stop = useCallback((): Promise<VoiceRecording | null> => {
    held.current = false;
    const active = recorder.current;
    if (!active || active.state === 'inactive') return Promise.resolve(null);
    return new Promise((resolve) => {
      active.onstop = () => {
        const recording = { audio: new Blob(chunks.current, { type: active.mimeType }), seconds: (Date.now() - startedAt.current) / MS_PER_SECOND };
        release();
        setStatus('idle');
        resolve(recording);
      };
      active.stop();
    });
  }, [release]);

  return { status, seconds, start, stop };
};
