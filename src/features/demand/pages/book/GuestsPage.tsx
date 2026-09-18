'use client';

import { Button, Stepper } from '@/shared/components';
import { BookingPrice, TravellerScreen, TripNotice } from '../../components';
import { BOOK_FLOW_STEPS, COPY_BOOK, COPY_COMMON, TRAVELLER_ROUTES } from '../../constants';
import { useBookingDraft } from '../../hooks';
import { travellerAppStore } from '../../services/client';

const GUESTS_STEP = 2;
const copy = COPY_BOOK.guests;

/** Screen 9. How many are coming, inside what the host can take, with the price moving as the number does. */
export const GuestsPage = ({ listingId }: { listingId: string }) => {
  const { listing, draft } = useBookingDraft(listingId);

  if (!listing) return <TripNotice barTitle={COPY_BOOK.flowTitle} {...COPY_BOOK.notice.listing} backHref={TRAVELLER_ROUTES.home} />;
  if (!draft) return <TravellerScreen barTitle={COPY_BOOK.flowTitle} width="column">{null}</TravellerScreen>;

  return (
    <TravellerScreen
      barTitle={COPY_BOOK.flowTitle}
      backHref={TRAVELLER_ROUTES.book.date(listing.id)}
      step={{ current: GUESTS_STEP, total: BOOK_FLOW_STEPS }}
      heading={copy.title}
      helper={copy.limits(COPY_COMMON.group(listing.groupMin, listing.groupMax))}
      width="column"
      footer={
        <Button size="md" href={TRAVELLER_ROUTES.book.review(listing.id)}>
          {COPY_COMMON.continue}
        </Button>
      }
    >
      <div className="flex flex-col gap-6">
        <Stepper
          label={copy.label}
          value={draft.guests}
          min={listing.groupMin}
          max={listing.groupMax}
          decreaseLabel={copy.fewer}
          increaseLabel={copy.more}
          onChange={(guests) => travellerAppStore.patchBooking({ guests })}
        />
        <div aria-live="polite">
          <BookingPrice listing={listing} guests={draft.guests} />
        </div>
        {listing.priceUnit === 'PER_TRIP' ? <p className="text-body-md text-body">{copy.flatPrice}</p> : null}
      </div>
    </TravellerScreen>
  );
};
