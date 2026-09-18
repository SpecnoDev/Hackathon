'use client';

import { OFFERING_CATEGORIES, type OfferingListQuery } from '@/shared/dto';
import { CATEGORY_LABEL } from '../constants';

export function CategoryChips({
  active,
  onChange,
}: {
  active: OfferingListQuery['category'] | undefined;
  onChange: (category: OfferingListQuery['category'] | undefined) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <Chip active={active === undefined} onClick={() => onChange(undefined)}>
        All
      </Chip>
      {OFFERING_CATEGORIES.map((category) => (
        <Chip key={category} active={active === category} onClick={() => onChange(category)}>
          {CATEGORY_LABEL[category]}
        </Chip>
      ))}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        active
          ? 'flex-shrink-0 whitespace-nowrap rounded-full bg-ink px-4 py-2.5 text-button-sm text-on-dark'
          : 'flex-shrink-0 whitespace-nowrap rounded-full bg-surface-soft px-4 py-2.5 text-button-sm text-ink'
      }
    >
      {children}
    </button>
  );
}
