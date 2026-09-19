import { ADMIN_COPY } from '../constants';
import { statusHref } from '../utils';
import { FilterChips } from './FilterChips';

export interface StatusFilterOption {
  value: string;
  label: string;
}

interface StatusFilterProps {
  basePath: string;
  options: readonly StatusFilterOption[];
  active: string;
}

export const StatusFilter = ({ basePath, options, active }: StatusFilterProps) => (
  <FilterChips
    label={ADMIN_COPY.filterLabel}
    chips={options.map(({ value, label }) => ({ href: statusHref(basePath, value), label, selected: value === active }))}
  />
);
