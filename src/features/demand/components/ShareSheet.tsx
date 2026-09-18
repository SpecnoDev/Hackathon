'use client';

import { Button, Sheet, useToast } from '@/shared/components';
import { COPY_COMMON } from '../constants';

const WHATSAPP_SHARE = 'https://wa.me/?text=';

interface ShareSheetProps {
  /** The path to share, e.g. a listing, a trip or a plan. */
  path: string;
  /** What the message says before the link. */
  message: string;
  onClose: () => void;
}

/** The PRD's growth loop: every listing, trip and plan can leave the app as a link. */
export const ShareSheet = ({ path, message, onClose }: ShareSheetProps) => {
  const toast = useToast();
  const url = `${window.location.origin}${path}`;

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(url);
      toast(COPY_COMMON.share.copied);
      onClose();
    } catch {
      toast(COPY_COMMON.share.failed);
    }
  };

  return (
    <Sheet
      title={COPY_COMMON.share.title}
      closeLabel={COPY_COMMON.close}
      onClose={onClose}
      actions={
        <>
          <Button size="md" icon="link" onClick={() => void copy()}>
            {COPY_COMMON.share.copy}
          </Button>
          <Button size="md" variant="secondary" icon="message" href={`${WHATSAPP_SHARE}${encodeURIComponent(`${message} ${url}`)}`}>
            {COPY_COMMON.share.whatsApp}
          </Button>
        </>
      }
    >
      <p className="text-body-md text-body">{COPY_COMMON.share.body}</p>
      <p className="mt-3 break-all rounded-md bg-surface-soft p-3 text-body-sm text-ink">{url}</p>
    </Sheet>
  );
};
