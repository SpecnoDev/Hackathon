'use client';

import { useState } from 'react';
import { Button, Icon, Sheet, useToast } from '@/shared/components';
import { whatsAppLink } from '@/shared/utils';
import { COPY_COMMON, COPY_TRIPS, EMERGENCY_NUMBERS, SUPPORT_WHATSAPP_NUMBER, TRAVELLER_ROUTES } from '../constants';
import type { Listing, Trip } from '../interfaces';
import { formatDayAndTime } from '../utils';

const TEL_SCHEME = 'tel:';
const copy = COPY_TRIPS.safety;

/** Screen 16, open from every trip state: tell someone where you are, call for help, or tell us what went wrong. */
export const SafetySheet = ({ trip, listing, onClose }: { trip: Trip; listing: Listing; onClose: () => void }) => {
  const toast = useToast();
  const [uncopiedLink, setUncopiedLink] = useState<string>();

  const share = async (): Promise<void> => {
    const url = `${window.location.origin}${TRAVELLER_ROUTES.trips.detail(trip.id)}`;
    try {
      await navigator.clipboard.writeText(url);
      setUncopiedLink(undefined);
      toast(copy.shared);
    } catch {
      // The failure toast tells the traveller to press and hold the link, so the link has to be on the sheet.
      setUncopiedLink(url);
      toast(COPY_COMMON.share.failed);
    }
  };

  return (
    <Sheet
      title={copy.title}
      closeLabel={COPY_COMMON.close}
      onClose={onClose}
      actions={
        <>
          <Button size="md" icon="share" onClick={() => void share()}>
            {copy.share}
          </Button>
          <Button size="md" variant="secondary" icon="flag" href={whatsAppLink(SUPPORT_WHATSAPP_NUMBER, copy.reportMessage(listing.title, formatDayAndTime(trip.date, trip.time)))}>
            {copy.report}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-body-md text-body">{copy.body}</p>
        <ul className="flex flex-col gap-2">
          {EMERGENCY_NUMBERS.map(({ key, number }) => (
            <li key={key}>
              <a
                href={`${TEL_SCHEME}${number}`}
                aria-label={copy.call(copy.numbers[key], number)}
                className="flex min-h-14 items-center gap-4 rounded-lg border border-hairline px-5 text-ink active:bg-surface-soft"
              >
                <Icon name="phone" className="shrink-0" />
                <span className="flex-1 text-title-sm">{copy.numbers[key]}</span>
                <span className="text-title-lg">{number}</span>
              </a>
            </li>
          ))}
        </ul>
        {uncopiedLink ? <p className="break-all rounded-md bg-surface-soft p-3 text-body-sm text-ink">{uncopiedLink}</p> : null}
      </div>
    </Sheet>
  );
};
