'use client';

import { useEffect, useState } from 'react';
import { hostAppStorage } from '../services';

/** An object URL for a photo or voice note kept on the phone. Revoked when the key changes or the screen leaves. */
export const useBlobUrl = (key: string | undefined): string | undefined => {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    if (!key) {
      setUrl(undefined);
      return undefined;
    }
    let objectUrl: string | undefined;
    let cancelled = false;
    void hostAppStorage.getBlob(key).then((blob) => {
      if (cancelled || !blob) return;
      objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
    });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [key]);

  return url;
};
