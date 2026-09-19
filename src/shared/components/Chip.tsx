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
    className={`inline-flex min-h-12 items-center gap-2 rounded-sm px-4 text-button-sm ${selected ? 'bg-primary text-on-primary' : 'bg-canvas text-ink ring-1 ring-inset ring-hairline'}`}
  >
    {selected ? <Icon name="check" size={CHIP_ICON_PX} /> : null}
    {label}
  </button>
);
