'use client';

import type { SyntheticEvent } from 'react';
import { PHONE_HEIGHT, PHONE_WIDTH } from '../constants';

const BEZEL_PX = 6;
/** A phone has no scrollbar. The frame is same-origin, so the deck can put this inside it once the screen loads. */
const HIDE_SCROLLBARS = '::-webkit-scrollbar{width:0;height:0}html{scrollbar-width:none}';

const hideScrollbars = (event: SyntheticEvent<HTMLIFrameElement>): void => {
  const doc = event.currentTarget.contentDocument;
  if (!doc) return;
  const style = doc.createElement('style');
  style.textContent = HIDE_SCROLLBARS;
  doc.head.append(style);
};

interface PhoneFrameProps {
  /** A route of the running app, shown live. */
  route: string;
  /** A screenshot to show instead, e.g. "/presentation/earnings.png" in /public. When set, the live screen is not loaded. */
  image?: string;
  label: string;
  /** How tall the phone is on the slide; the screen is scaled to fit. */
  height: number;
}

/**
 * A phone on a slide. By default the screen is the real app in an iframe, so the deck never shows a stale picture
 * and the presenter can tap through it. Hand it an image to freeze a moment instead.
 */
export const PhoneFrame = ({ route, image, label, height }: PhoneFrameProps) => {
  const scale = (height - BEZEL_PX * 2) / PHONE_HEIGHT;
  const screenWidth = PHONE_WIDTH * scale;
  const screenHeight = PHONE_HEIGHT * scale;

  return (
    <div
      className="animate-deck-rise rounded-lg bg-canvas shadow-[0_2px_4px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.18)] ring-1 ring-ink/10 motion-reduce:animate-none"
      style={{ padding: BEZEL_PX, animationDelay: '300ms' }}
    >
      <div className="relative overflow-hidden rounded-sm bg-canvas" style={{ width: screenWidth, height: screenHeight }}>
        {image ? (
          // A screenshot is a plain file in /public; next/image would need its size up front and gains nothing here.
          <img src={image} alt={label} className="size-full object-cover object-top" />
        ) : (
          <iframe
            src={route}
            title={label}
            loading="lazy"
            onLoad={hideScrollbars}
            className="origin-top-left border-0"
            style={{ width: PHONE_WIDTH, height: PHONE_HEIGHT, transform: `scale(${scale})` }}
          />
        )}
      </div>
    </div>
  );
};
