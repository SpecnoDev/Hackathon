import { PriceSummary } from '@/shared/components';
import type { OfferingDetail } from '@/shared/dto';
import { formatRand } from '@/shared/utils';
import { COPY_BOOK, COPY_COMMON } from '../constants';
import { priceBooking } from '../utils';

/** What a booking costs, line by line. One block for every step that shows a price, so the total never differs between steps. */
export const BookingPrice = ({ offering, guests }: { offering: Pick<OfferingDetail, 'priceCents' | 'priceUnit'>; guests: number }) => {
  const price = priceBooking(offering, guests);
  return (
    <PriceSummary
      lines={[
        {
          label: offering.priceUnit === 'PER_PERSON' ? COPY_BOOK.price.perPerson(formatRand(offering.priceCents), COPY_COMMON.guests(guests)) : COPY_BOOK.price.perTrip,
          value: formatRand(price.subtotalCents),
        },
        { label: COPY_BOOK.price.serviceFee, value: formatRand(price.serviceFeeCents) },
      ]}
      totalLabel={COPY_BOOK.price.total}
      total={formatRand(price.totalCents)}
    />
  );
};
