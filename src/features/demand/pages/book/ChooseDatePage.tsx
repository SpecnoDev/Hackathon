'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/shared/components';
import { CalendarMonth, TimeSlots, TravellerScreen, TripNotice } from '../../components';
import { BOOK_FLOW_STEPS, COPY_BOOK, COPY_COMMON, TRAVELLER_ROUTES } from '../../constants';
import { useBookingDraft } from '../../hooks';
import { isBookableDay, openTimes, travellerAppStore } from '../../services/client';

const DATE_STEP = 1;
const copy = COPY_BOOK.date;

/** Screen 8. The day first, then a start time when the host has set some. */
export const ChooseDatePage = ({ listingId }: { listingId: string }) => {
  const router = useRouter();
  const { listing, draft } = useBookingDraft(listingId);

  if (!listing) return <TripNotice barTitle={COPY_BOOK.flowTitle} {...COPY_BOOK.notice.listing} backHref={TRAVELLER_ROUTES.home} />;
  if (!draft) return <TravellerScreen barTitle={COPY_BOOK.flowTitle} width="column">{null}</TravellerScreen>;

  const { weekdays, times } = listing.availability;
  const now = new Date();
  // The draft starts with the day the traveller searched for, which this host may not run on.
  const date = draft.date && isBookableDay(weekdays, draft.date, now) ? draft.date : undefined;
  const timePicked = draft.time != null && openTimes(times, date, now).includes(draft.time);
  const missing = !date ? copy.needDay : times.length > 0 && !timePicked ? copy.needTime : undefined;

  const next = (): void => {
    if (times.length === 0) travellerAppStore.patchBooking({ time: null });
    router.push(TRAVELLER_ROUTES.book.guests(listing.id));
  };

  return (
    <TravellerScreen
      barTitle={COPY_BOOK.flowTitle}
      backHref={TRAVELLER_ROUTES.listing(listing.id)}
      step={{ current: DATE_STEP, total: BOOK_FLOW_STEPS }}
      heading={copy.title}
      helper={times.length === 0 ? copy.helperAnyTime : copy.helper}
      width="column"
      footer={
        <>
          {missing ? <p className="text-center text-caption text-muted">{missing}</p> : null}
          <Button size="md" disabled={Boolean(missing)} onClick={next}>
            {COPY_COMMON.continue}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <CalendarMonth weekdays={weekdays} selected={date} onSelect={(picked) => travellerAppStore.patchBooking({ date: picked })} />
          <p className="text-caption text-muted">{copy.legend}</p>
        </div>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-md text-ink">{copy.timeTitle}</h2>
          <TimeSlots times={times} date={date} selected={draft.time} onSelect={(time) => travellerAppStore.patchBooking({ time })} />
        </section>
      </div>
    </TravellerScreen>
  );
};
