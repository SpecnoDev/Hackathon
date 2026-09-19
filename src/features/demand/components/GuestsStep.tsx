'use client';

import { Button, Stepper } from '@/shared/components';
import type { OfferingDetail } from '@/shared/dto';
import { BOOK_FLOW_STEPS, BOOK_STEP, COPY_BOOK, COPY_COMMON, GUESTS_MAX, TRAVELLER_ROUTES } from '../constants';
import { useBookingDraft } from '../hooks';
import { BookingPrice } from './BookingPrice';
import { TravellerScreen } from './TravellerScreen';

const copy = COPY_BOOK.guests;

/** Screen 9. How many are coming, inside what the host can take, with the price moving as the number does. */
export const GuestsStep = ({ offering }: { offering: OfferingDetail }) => {
  const { draft, patch, ready } = useBookingDraft(offering.id, offering.groupMin);
  const max = offering.groupMax ?? GUESTS_MAX;

  return (
    <TravellerScreen
      barTitle={COPY_BOOK.flowTitle}
      backHref={TRAVELLER_ROUTES.book.date(offering.id)}
      step={{ current: BOOK_STEP.guests, total: BOOK_FLOW_STEPS }}
      heading={copy.title}
      helper={copy.limits(COPY_COMMON.group(offering.groupMin, offering.groupMax))}
      width="column"
      footer={
        <Button size="md" href={TRAVELLER_ROUTES.book.review(offering.id)} disabled={!ready}>
          {COPY_COMMON.continue}
        </Button>
      }
    >
      {ready ? (
        <div className="flex flex-col gap-6">
          <Stepper label={copy.label} value={draft.guests} min={offering.groupMin} max={max} decreaseLabel={copy.fewer} increaseLabel={copy.more} onChange={(guests) => patch({ guests })} />
          <div aria-live="polite">
            <BookingPrice offering={offering} guests={draft.guests} />
          </div>
          {offering.priceUnit === 'PER_TRIP' ? <p className="text-body-md text-body">{copy.flatPrice}</p> : null}
        </div>
      ) : null}
    </TravellerScreen>
  );
};
