'use client';

import { OfflineBanner } from '@/shared/components';
import { COPY_COMMON } from '../constants';
import { useOnline } from '../hooks';

/** The only client piece of the traveller frame: the server cannot know whether the phone has signal. */
export const TravellerOfflineBanner = () => (useOnline() ? null : <OfflineBanner message={COPY_COMMON.offline} />);
