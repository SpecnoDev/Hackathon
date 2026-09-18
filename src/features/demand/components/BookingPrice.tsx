'use client';

import { PriceSummary } from '@/shared/components';
import { formatRand } from '@/shared/utils';
import { COPY_BOOK, COPY_COMMON } from '../constants';
import { useTravellerApp } from '../hooks';
import type { Listing, TravellerAppState, TravellerProfile } from '../interfaces';
import { priceBooking } from '../services/client';
import { formatApprox } from '../utils';

const copy = COPY_BOOK.price;
const selectProfile = (state: TravellerAppState): TravellerProfile => state.profile;

/** What a booking costs, line by line. One block for every step that shows a price, so the total never differs between steps. */
export const BookingPrice = ({ listing, guests }: { listing: Listing; guests: number }) => {
  const profile = useTravellerApp(selectProfile);
  const price = priceBooking(listing, guests);

  return (
    <PriceSummary
      lines={[
        {
          label: listing.priceUnit === 'PER_PERSON' ? copy.perPerson(formatRand(listing.priceCents), COPY_COMMON.guests(guests)) : copy.perTrip,
          value: formatRand(price.subtotalCents),
        },
        { label: copy.serviceFee, value: formatRand(price.serviceFeeCents) },
      ]}
      totalLabel={copy.total}
      total={formatRand(price.totalCents)}
      note={profile.showApproxCurrency ? copy.approx(COPY_COMMON.approx(formatApprox(price.totalCents, profile.approxCurrency))) : undefined}
    />
  );
};
