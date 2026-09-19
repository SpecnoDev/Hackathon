import type { ReactNode } from 'react';

interface ChoiceListProps {
  /** Read out as the group name; usually the screen's question. */
  label: string;
  multiple?: boolean;
  children: ReactNode;
}

/** The stack of option tiles that answers a question. Tiles sit 12px apart, per DESIGN.md. */
export const ChoiceList = ({ label, multiple = false, children }: ChoiceListProps) => (
  <div role={multiple ? 'group' : 'radiogroup'} aria-label={label} className="flex w-full flex-col gap-3 tablet:max-w-form">
    {children}
  </div>
);
