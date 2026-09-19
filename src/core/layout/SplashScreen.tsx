import { APP_NAME } from '@/core/constants';
import { HostedMark, PatternField } from '@/shared/components';

const MARK_PX = 96;
/** The wordmark waits for the line to finish drawing itself before it fades up under the mark. */
const WORDMARK_AFTER_MS = 1500;
const TAGLINE_AFTER_MS = 1800;

const COPY = {
  tagline: 'Real places, real people',
  loading: `Loading ${APP_NAME}`,
};

/**
 * The first thing the app shows while a screen is on its way: the green ground, the brand pattern and the mark
 * drawing itself. It is a `loading.tsx` in every route group, so a slow connection gets the brand rather than a blank page.
 */
export const SplashScreen = () => (
  <div role="status" aria-label={COPY.loading} className="relative flex min-h-dvh flex-col items-center justify-center gap-6 overflow-hidden bg-primary-deep px-6 text-center">
    <PatternField />
    <HostedMark size={MARK_PX} onDark animated className="relative" />
    <div className="relative flex flex-col gap-2">
      <p className="animate-mark-fade font-display text-display-lg text-on-dark motion-reduce:animate-none" style={{ animationDelay: `${WORDMARK_AFTER_MS}ms` }}>
        {APP_NAME}
      </p>
      <p className="animate-mark-fade text-body-md text-on-dark/70 motion-reduce:animate-none" style={{ animationDelay: `${TAGLINE_AFTER_MS}ms` }}>
        {COPY.tagline}
      </p>
    </div>
  </div>
);
