import { PHONE_HEIGHT, PHONE_WIDTH } from '../constants';

const BEZEL_PX = 10;

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
    <div className="animate-deck-rise rounded-xl bg-ink shadow-lift motion-reduce:animate-none" style={{ padding: BEZEL_PX, animationDelay: '300ms' }}>
      <div className="relative overflow-hidden rounded-lg bg-canvas" style={{ width: screenWidth, height: screenHeight }}>
        {image ? (
          // A screenshot is a plain file in /public; next/image would need its size up front and gains nothing here.
          <img src={image} alt={label} className="size-full object-cover object-top" />
        ) : (
          <iframe
            src={route}
            title={label}
            loading="lazy"
            className="origin-top-left border-0"
            style={{ width: PHONE_WIDTH, height: PHONE_HEIGHT, transform: `scale(${scale})` }}
          />
        )}
      </div>
    </div>
  );
};
