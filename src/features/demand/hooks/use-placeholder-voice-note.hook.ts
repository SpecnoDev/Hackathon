'use client';

import { useEffect, useState } from 'react';

const SAMPLE_RATE = 8000;
const HEADER_BYTES = 44;
const BYTES_PER_SAMPLE = 2;
const PCM_FORMAT = 1;
const MONO = 1;
const BITS_PER_SAMPLE = 16;

/**
 * TODO: placeholder. Hosts record real voice notes in the host app, but those live on the host's phone until the
 * upload API exists. This builds a silent clip of the right length so the player behaves like the real thing.
 */
const silentWav = (seconds: number): Blob => {
  const dataBytes = seconds * SAMPLE_RATE * BYTES_PER_SAMPLE;
  const view = new DataView(new ArrayBuffer(HEADER_BYTES + dataBytes));
  const text = (offset: number, value: string): void => [...value].forEach((char, index) => view.setUint8(offset + index, char.charCodeAt(0)));
  text(0, 'RIFF');
  view.setUint32(4, HEADER_BYTES - 8 + dataBytes, true);
  text(8, 'WAVEfmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, PCM_FORMAT, true);
  view.setUint16(22, MONO, true);
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * BYTES_PER_SAMPLE, true);
  view.setUint16(32, BYTES_PER_SAMPLE, true);
  view.setUint16(34, BITS_PER_SAMPLE, true);
  text(36, 'data');
  view.setUint32(40, dataBytes, true);
  return new Blob([view], { type: 'audio/wav' });
};

export const usePlaceholderVoiceNote = (seconds: number): string | undefined => {
  const [src, setSrc] = useState<string>();

  useEffect(() => {
    const url = URL.createObjectURL(silentWav(seconds));
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [seconds]);

  return src;
};
