'use client';

import { useEffect, useId, type ReactNode } from 'react';

interface SheetProps {
  title: string;
  onClose: () => void;
  closeLabel: string;
  children: ReactNode;
  actions: ReactNode;
}

/** Bottom sheet for confirmations. Rendered only while open, so the parent decides when. */
export const Sheet = ({ title, onClose, closeLabel, children, actions }: SheetProps) => {
  const titleId = useId();

  useEffect(() => {
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center">
      <button type="button" aria-label={closeLabel} onClick={onClose} className="absolute inset-0 bg-scrim/50" />
      <div
        role="dialog"
        aria-modal
        aria-labelledby={titleId}
        className="relative flex w-full max-w-host flex-col gap-4 rounded-t-xl bg-canvas p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-lift"
      >
        <h2 id={titleId} className="font-display text-display-md text-ink">
          {title}
        </h2>
        <div className="text-body-host text-ink">{children}</div>
        <div className="flex flex-col gap-3">{actions}</div>
      </div>
    </div>
  );
};
