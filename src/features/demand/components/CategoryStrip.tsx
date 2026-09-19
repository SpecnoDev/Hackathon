import Link from 'next/link';
import { OFFERING_CATEGORIES, type OfferingListQuery } from '@/shared/dto';
import { Icon, type IconName } from '@/shared/components';
import { CATEGORY_ICON, CATEGORY_LABEL, COPY_EXPLORE } from '../constants';

const CHIP_ICON_PX = 16;
type Category = NonNullable<OfferingListQuery['category']>;

const StripChip = ({ label, icon, active, href }: { label: string; icon?: IconName; active: boolean; href: string }) => (
  <Link
    href={href}
    aria-current={active ? 'true' : undefined}
    scroll={false}
    className={`flex h-12 shrink-0 items-center gap-2 whitespace-nowrap rounded-sm px-5 text-button-sm ${active ? 'bg-primary text-on-primary' : 'bg-canvas text-ink ring-1 ring-inset ring-hairline'}`}
  >
    {icon ? <Icon name={icon} size={CHIP_ICON_PX} /> : null}
    {label}
  </Link>
);

/** DESIGN.md category-chip: ink when active, soft grey at rest. 48px tall here, for thumbs. Each chip is a link, so the choice lives in the URL. */
export const CategoryStrip = ({ active, hrefFor }: { active: Category | undefined; hrefFor: (category: Category | undefined) => string }) => (
  <div role="group" aria-label={COPY_EXPLORE.allCategories} className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] tablet:-mx-6 tablet:px-6 [&::-webkit-scrollbar]:hidden">
    <StripChip label={COPY_EXPLORE.allCategories} active={active === undefined} href={hrefFor(undefined)} />
    {OFFERING_CATEGORIES.map((category) => (
      <StripChip key={category} label={CATEGORY_LABEL[category]} icon={CATEGORY_ICON[category]} active={active === category} href={hrefFor(category)} />
    ))}
  </div>
);
