import type { OfferingSummary } from '@/shared/dto';
import { ListingCardLink } from './ListingCardLink';

/** One column on a phone, two from 744px, three from 1128px: the same cards, never a different design. */
export const ListingGrid = ({ offerings }: { offerings: OfferingSummary[] }) => (
  <ul className="grid grid-cols-1 gap-x-6 gap-y-10 tablet:grid-cols-2 desktop:grid-cols-3">
    {offerings.map((offering, index) => (
      <li key={offering.id}>
        <ListingCardLink offering={offering} priority={index === 0} />
      </li>
    ))}
  </ul>
);
