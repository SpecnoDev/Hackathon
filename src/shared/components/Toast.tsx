'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';

/** DESIGN.md: quiet confirmations only, three seconds. A toast that links somewhere stays longer so it can be tapped. */
const TOAST_MS = 3000;
const TOAST_WITH_LINK_MS = 8000;

interface ToastMessage {
  id: number;
  text: string;
  href?: string;
}

type ShowToast = (text: string, href?: string) => void;

const ToastContext = createContext<ShowToast>(() => undefined);

export const useToast = (): ShowToast => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const show = useCallback<ShowToast>((text, href) => setToast({ id: Date.now(), text, href }), []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), toast.href ? TOAST_WITH_LINK_MS : TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const body = useMemo(() => {
    if (!toast) return null;
    const className =
      'pointer-events-auto block w-full max-w-host rounded-md bg-ink px-4 py-3.5 text-body-md text-on-dark shadow-lift animate-toast-in motion-reduce:animate-none';
    return toast.href ? (
      <Link href={toast.href} onClick={() => setToast(null)} className={`${className} underline`}>
        {toast.text}
      </Link>
    ) : (
      <p className={className}>{toast.text}</p>
    );
  }, [toast]);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {/* Under the top bar rather than at the bottom: the bottom of a host screen belongs to the pinned action. */}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 top-16 z-50 flex justify-center px-4">
        {body}
      </div>
    </ToastContext.Provider>
  );
};
