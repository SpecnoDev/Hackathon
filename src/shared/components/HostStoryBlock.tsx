import type { ReactNode } from 'react';
import Image from 'next/image';

interface HostStoryBlockProps {
  firstName: string;
  town: string;
  /** Falls back to the initial: the host app has no portraits yet, the traveller side sometimes does. */
  portrait?: string;
  story: string;
  badge?: ReactNode;
  voiceNote?: ReactNode;
}

/** DESIGN.md: "This block is the brand; give it room." Travellers are choosing a person, not a product. */
export const HostStoryBlock = ({ firstName, town, portrait, story, badge, voiceNote }: HostStoryBlockProps) => (
  <section className="flex flex-col gap-4 rounded-lg bg-surface-soft p-6">
    <div className="flex items-center gap-4">
      {portrait ? (
        <span className="relative size-14 shrink-0 overflow-hidden rounded-full bg-surface-strong">
          <Image src={portrait} alt="" fill className="object-cover" sizes="56px" />
        </span>
      ) : (
        <span aria-hidden className="flex size-14 shrink-0 items-center justify-center rounded-full bg-surface-strong font-display text-display-md text-ink">
          {firstName.charAt(0)}
        </span>
      )}
      <div className="flex min-w-0 flex-col gap-1">
        <h2 className="text-title-md text-ink">{`${firstName} · ${town}`}</h2>
        {badge}
      </div>
    </div>
    <p className="text-body-md text-body">{story}</p>
    {voiceNote}
  </section>
);
