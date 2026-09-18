'use client';

import { Icon, type IconName } from '@/shared/components';
import { CATEGORIES, COPY_COMMON } from '../constants';
import type { ListingCategory } from '../interfaces';

const CHIP_ICON_PX = 16;

const StripChip = ({ label, icon, active, onSelect }: { label: string; icon?: IconName; active: boolean; onSelect: () => void }) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onSelect}
    className={`flex h-12 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-5 text-button-sm ${active ? 'bg-ink text-on-dark' : 'bg-surface-soft text-ink'}`}
  >
    {icon ? <Icon name={icon} size={CHIP_ICON_PX} /> : null}
    {label}
  </button>
);

/** DESIGN.md category-chip: ink when active, soft grey at rest. 48px tall here, for thumbs. */
export const CategoryStrip = ({ active, onChange }: { active: ListingCategory | undefined; onChange: (category: ListingCategory | undefined) => void }) => (
  <div role="group" aria-label={COPY_COMMON.categories.all} className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] tablet:-mx-6 tablet:px-6 [&::-webkit-scrollbar]:hidden">
    <StripChip label={COPY_COMMON.categories.all} active={active === undefined} onSelect={() => onChange(undefined)} />
    {CATEGORIES.map(({ category, icon }) => (
      <StripChip key={category} label={COPY_COMMON.categories[category]} icon={icon} active={active === category} onSelect={() => onChange(category)} />
    ))}
  </div>
);
