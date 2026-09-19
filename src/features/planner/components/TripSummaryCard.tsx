import Link from 'next/link';
import { ROUTES } from '@/core/constants';
import { Icon } from '@/shared/components';
import { PLANNER_COPY } from '../constants';
import type { PlannerTripSummary } from '../interfaces';
import { formatDateRange } from '../utils';

export const TripSummaryCard = ({ trip }: { trip: PlannerTripSummary }) => (
  <Link href={`${ROUTES.plan}/${trip.id}`} className="flex items-center gap-4 rounded-lg border border-hairline bg-canvas p-4 text-ink no-underline active:bg-surface-soft">
    <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary-text">
      <Icon name="route" />
    </span>
    <span className="min-w-0 flex-1">
      <span className="block truncate text-title-sm">{trip.name}</span>
      <span className="block text-body-sm text-muted">
        {formatDateRange(trip.startDate, trip.endDate)} · {PLANNER_COPY.board.travellers(trip.memberCount, null)} · {PLANNER_COPY.create.experiences(trip.blockCount)}
      </span>
    </span>
    <Icon name="chevron-right" className="shrink-0 text-muted" />
  </Link>
);
