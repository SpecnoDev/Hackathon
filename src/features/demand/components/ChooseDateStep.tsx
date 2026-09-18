'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/components';
import type { OfferingDetail } from '@/shared/dto';
import { BOOK_FLOW_STEPS, BOOK_STEP, COPY_BOOK, COPY_COMMON, TRAVELLER_ROUTES } from '../constants';
import { useBookingDraft } from '../hooks';
import { isBookableDay, openTimes, readAvailability } from '../utils';
import { CalendarMonth } from './CalendarMonth';
import { TimeSlots } from './TimeSlots';
import { TravellerScreen } from './TravellerScreen';

const copy = COPY_BOOK.date;

interface ChooseDateStepProps {
  offering: OfferingDetail;
  /** From a trip plan: the stop being booked and the day the group put it on. */
  block?: { id: string; day: string };
}

/** Screen 8. The day first, then a start time when the host has set some. */
export const ChooseDateStep = ({ offering, block }: ChooseDateStepProps) => {
  const router = useRouter();
  const { draft, patch, ready } = useBookingDraft(offering.id, offering.groupMin);

  useEffect(() => {
    if (ready && block && draft.blockId !== block.id) patch({ blockId: block.id, date: block.day, time: undefined });
  }, [ready, block, draft.blockId, patch]);

  const { weekdays, times } = readAvailability(offering.availability);
  const now = new Date();
  // The draft may hold a day this host does not run on any more.
  const date = draft.date && isBookableDay(weekdays, draft.date, now) ? draft.date : undefined;
  const timePicked = draft.time != null && openTimes(times, date, now).includes(draft.time);
  const missing = !date ? copy.needDay : times.length > 0 && !timePicked ? copy.needTime : undefined;

  const next = (): void => {
    if (times.length === 0) patch({ time: null });
    router.push(TRAVELLER_ROUTES.book.guests(offering.id));
  };

  return (
    <TravellerScreen
      barTitle={COPY_BOOK.flowTitle}
      backHref={TRAVELLER_ROUTES.listing(offering.id)}
      step={{ current: BOOK_STEP.date, total: BOOK_FLOW_STEPS }}
      heading={copy.title}
      helper={times.length === 0 ? copy.helperAnyTime : copy.helper}
      width="column"
      footer={
        <>
          {missing ? <p className="text-center text-caption text-muted">{missing}</p> : null}
          <Button size="md" disabled={!ready || Boolean(missing)} onClick={next}>
            {COPY_COMMON.continue}
          </Button>
        </>
      }
    >
      {ready ? (
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <CalendarMonth weekdays={weekdays} selected={date} onSelect={(picked) => patch({ date: picked })} />
            <p className="text-caption text-muted">{copy.legend}</p>
          </div>
          <section className="flex flex-col gap-3">
            <h2 className="text-title-md text-ink">{copy.timeTitle}</h2>
            <TimeSlots times={times} date={date} selected={draft.time} onSelect={(time) => patch({ time })} />
          </section>
        </div>
      ) : null}
    </TravellerScreen>
  );
};
