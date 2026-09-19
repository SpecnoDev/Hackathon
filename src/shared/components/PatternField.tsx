/** On a coloured panel the marks are white; on the warm canvas they are the accent, which reads as the tan of the drawing. */
export type FieldTone = 'onDark' | 'onLight';

/** The hand-drawn tile is carried as a mask rather than a picture, so the marks take a brand colour and never bring their own. */
const TILE = '/patterns/hosted-field.webp';
const TILE_PX = 420;
const OPACITY: Record<FieldTone, number> = { onDark: 0.03, onLight: 0.1 };
const INK: Record<FieldTone, string> = { onDark: 'bg-on-dark', onLight: 'bg-accent' };
/** On light the field is a header treatment, so it thins out before it reaches what is written under it. */
const FADE = 'linear-gradient(to bottom, #000 0%, #000 45%, transparent 100%)';

const MASK = {
  maskImage: `url(${TILE})`,
  WebkitMaskImage: `url(${TILE})`,
  maskSize: `${TILE_PX}px`,
  WebkitMaskSize: `${TILE_PX}px`,
  maskRepeat: 'repeat',
  WebkitMaskRepeat: 'repeat',
} as const;

/**
 * A tone-on-tone field of the brand pattern behind one coloured surface: a hero, a poster tile, a profile header.
 * It is the only pattern that sits behind type, so it is drawn in a single tone of its own ground and nothing else.
 * Needs a positioned parent.
 */
export const PatternField = ({ tone = 'onDark', className = '' }: { tone?: FieldTone; className?: string }) => (
  <span
    aria-hidden
    className={`pointer-events-none absolute inset-0 ${className}`}
    style={tone === 'onLight' ? { maskImage: FADE, WebkitMaskImage: FADE } : undefined}
  >
    <span className={`absolute inset-0 ${INK[tone]}`} style={{ opacity: OPACITY[tone], ...MASK }} />
  </span>
);
