'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, TextInput } from '@/shared/components';
import { ListingSummary, StarInput, TravellerScreen, TripNotice } from '../../components';
import { COPY_TRIPS, REVIEW_TEXT_MAX, TRAVELLER_ROUTES } from '../../constants';
import { useTravellerApp } from '../../hooks';
import type { TravellerAppState } from '../../interfaces';
import { hostOf, selectTrip, travellerAppStore } from '../../services/client';
import { formatDayAndTime } from '../../utils';

const PHOTO_ACCEPT = 'image/*';
const copy = COPY_TRIPS.review;

/** Screen 17: the stars are the only thing asked for. The words, the photo and the note to the host are all optional. */
export const RateTripPage = ({ tripId }: { tripId: string }) => {
  const router = useRouter();
  const found = useTravellerApp(useCallback((state: TravellerAppState) => selectTrip(state, tripId), [tripId]));
  const photoInput = useRef<HTMLInputElement>(null);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [privateNote, setPrivateNote] = useState('');
  const [photoName, setPhotoName] = useState<string>();
  // The store marks the trip reviewed before the router has left, and that must not flash the "already reviewed" notice.
  const [sent, setSent] = useState(false);
  const tripHref = TRAVELLER_ROUTES.trips.detail(tripId);

  if (!found) {
    return <TripNotice barTitle={copy.barTitle} message={COPY_TRIPS.detail.notFound} backHref={TRAVELLER_ROUTES.trips.list} backLabel={COPY_TRIPS.backToTrips} />;
  }

  const { trip, listing } = found;
  const blocked = trip.status !== 'COMPLETED' ? copy.notYet : trip.reviewed && !sent ? copy.already : undefined;

  if (blocked) return <TripNotice barTitle={copy.barTitle} title={blocked.title} message={blocked.message} backHref={tripHref} backLabel={COPY_TRIPS.backToTrip} />;

  const host = hostOf(listing);

  const submit = (): void => {
    setSent(true);
    travellerAppStore.submitReview(trip.id, { rating, text, privateNote, photoName });
    router.replace(TRAVELLER_ROUTES.trips.reviewThanks(trip.id));
  };

  return (
    <TravellerScreen
      barTitle={copy.barTitle}
      backHref={tripHref}
      heading={copy.heading}
      helper={copy.helper(host.firstName)}
      width="column"
      footer={
        <Button size="md" onClick={submit} disabled={!rating || sent}>
          {copy.submit}
        </Button>
      }
    >
      <div className="flex flex-col gap-8">
        <ListingSummary listing={listing}>
          <p className="text-body-sm text-ink">{formatDayAndTime(trip.date, trip.time)}</p>
        </ListingSummary>

        <StarInput label={copy.heading} value={rating} onChange={setRating} />

        <TextInput label={copy.text} value={text} onChange={setText} helper={copy.textHelper} maxLength={REVIEW_TEXT_MAX} />

        <div className="flex flex-col gap-2">
          <Button size="md" variant="secondary" icon="camera" onClick={() => photoInput.current?.click()}>
            {photoName ? copy.photoChange : copy.photo}
          </Button>
          {photoName ? (
            <p role="status" className="text-caption text-muted">
              {copy.photoChosen(photoName)}
            </p>
          ) : null}
          {/* TODO: nothing is uploaded yet. Only the file name is kept, until reviews have somewhere to store a photo. */}
          <input
            ref={photoInput}
            type="file"
            accept={PHOTO_ACCEPT}
            onChange={(event) => setPhotoName(event.target.files?.[0]?.name)}
            className="sr-only"
            tabIndex={-1}
            aria-hidden
          />
        </div>

        <TextInput
          label={copy.privateNote(host.firstName)}
          value={privateNote}
          onChange={setPrivateNote}
          helper={copy.privateHelper(host.firstName)}
          maxLength={REVIEW_TEXT_MAX}
          multiline
        />
      </div>
    </TravellerScreen>
  );
};
