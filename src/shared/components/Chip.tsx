import { Icon } from './Icon';

const CHIP_ICON_PX = 16;

interface ChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
}

/** category-chip from DESIGN.md as a toggle. The check glyph carries the selected state alongside the fill. */
export const Chip = ({ label, selected, onToggle }: ChipProps) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={selected}
    onClick={onToggle}
    className={`inline-flex min-h-12 items-center gap-2 rounded-full px-4 text-button-sm ${selected ? 'bg-ink text-on-dark' : 'bg-surface-soft text-ink'}`}
  >
    {selected ? <Icon name="check" size={CHIP_ICON_PX} /> : null}
    {label}
  </button>
);
