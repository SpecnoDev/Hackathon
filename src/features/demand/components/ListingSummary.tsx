import type { ReactNode } from 'react';
import Image from 'next/image';

interface ListingSummaryProps {
  title: string;
  photo?: string;
  /** "Hosted by Nomsa · Langa" — whatever one line places the listing. */
  meta: string;
  children?: ReactNode;
}

/** A listing in one line: thumbnail, title, host. Used wherever a booking, a trip or a review page names what it is for. */
export const ListingSummary = ({ title, photo, meta, children }: ListingSummaryProps) => (
  <div className="flex items-start gap-4">
    <span className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-md bg-surface-soft">
      {photo ? <Image src={photo} alt="" fill className="object-cover" sizes="80px" /> : null}
    </span>
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <p className="text-title-sm text-ink">{title}</p>
      <p className="text-body-sm text-muted">{meta}</p>
      {children}
    </div>
  </div>
);
