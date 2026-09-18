'use client';

import { Button, Sheet } from '@/shared/components';

const WHATSAPP_SHARE = 'https://wa.me/?text=';

interface ShareSheetProps {
  path: string;
  message: string;
  onClose: () => void;
}

/** The PRD's growth loop: a listing can leave the app as a link, copied or sent straight to WhatsApp. */
export const ShareSheet = ({ path, message, onClose }: ShareSheetProps) => {
  const url = typeof window === 'undefined' ? path : `${window.location.origin}${path}`;

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(url);
    } finally {
      onClose();
    }
  };

  return (
    <Sheet
      title="Share this"
      closeLabel="Close"
      onClose={onClose}
      actions={
        <>
          <Button size="md" icon="link" onClick={() => void copy()}>
            Copy the link
          </Button>
          <Button size="md" variant="secondary" icon="message" href={`${WHATSAPP_SHARE}${encodeURIComponent(`${message} ${url}`)}`}>
            Send on WhatsApp
          </Button>
        </>
      }
    >
      <p className="text-body-md text-body">Anyone with the link can see it. They do not need an account.</p>
      <p className="mt-3 break-all rounded-md bg-surface-soft p-3 text-body-sm text-ink">{url}</p>
    </Sheet>
  );
};
