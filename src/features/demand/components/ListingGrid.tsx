import type { Listing } from '../interfaces';
import { ListingCardLink } from './ListingCardLink';

/** One column on a phone, two from 744px, three from 1128px: the same cards, never a different design. */
export const ListingGrid = ({ listings }: { listings: Listing[] }) => (
  <ul className="grid grid-cols-1 gap-x-6 gap-y-10 tablet:grid-cols-2 desktop:grid-cols-3">
    {listings.map((listing, index) => (
      <li key={listing.id}>
        <ListingCardLink listing={listing} priority={index === 0} />
      </li>
    ))}
  </ul>
);
