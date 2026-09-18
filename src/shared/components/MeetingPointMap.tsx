'use client';

import dynamic from 'next/dynamic';

const MeetingPointMapImpl = dynamic(() => import('./MeetingPointMapImpl'), { ssr: false });

export function MeetingPointMap({ lat, lng }: { lat: number; lng: number }) {
  return <MeetingPointMapImpl lat={lat} lng={lng} />;
}
