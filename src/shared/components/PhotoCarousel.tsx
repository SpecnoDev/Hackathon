'use client';

import { useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';

interface PhotoCarouselProps {
  photos: string[];
  alt: (position: number) => string;
  /** "2 of 5", so the count is read out and not only drawn. */
  countLabel: (position: number, total: number) => string;
  /** Back, share and save, laid over the top of the photo. */
  overlay?: ReactNode;
}

/** Swipeable photos with a counter. Native scroll snapping, so there is no gesture code to get wrong on a cheap phone. */
export const PhotoCarousel = ({ photos, alt, countLabel, overlay }: PhotoCarouselProps) => {
  const track = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(1);

  const onScroll = (): void => {
    const element = track.current;
    if (element) setPosition(Math.round(element.scrollLeft / element.clientWidth) + 1);
  };

  return (
    <div className="relative bg-surface-soft">
      <div ref={track} onScroll={onScroll} className="flex aspect-4/3 snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] tablet:aspect-video desktop:aspect-21/9 [&::-webkit-scrollbar]:hidden">
        {photos.map((photo, index) => (
          <div key={photo} className="relative size-full shrink-0 snap-center">
            <Image src={photo} alt={alt(index + 1)} fill priority={index === 0} className="object-cover" sizes="(min-width: 1128px) 1200px, 100vw" />
          </div>
        ))}
      </div>
      {overlay ? <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-3 *:pointer-events-auto">{overlay}</div> : null}
      {photos.length > 1 ? (
        <p aria-live="polite" className="absolute bottom-3 right-3 rounded-xs bg-scrim/70 px-3 py-1 text-badge text-on-dark">
          {countLabel(position, photos.length)}
        </p>
      ) : null}
    </div>
  );
};
