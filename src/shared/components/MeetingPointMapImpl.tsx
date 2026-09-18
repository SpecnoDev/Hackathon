'use client';

import 'leaflet/dist/leaflet.css';
import { divIcon } from 'leaflet';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

const MARKER_ICON = divIcon({
  className: '',
  html: '<span style="display:block;width:16px;height:16px;border-radius:50%;background:#009a4e;border:2px solid white;box-shadow:0 1px 2px rgba(0,0,0,0.3)"></span>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export default function MeetingPointMapImpl({ lat, lng }: { lat: number; lng: number }) {
  return (
    // isolate: Leaflet's internal panes use raw z-index up to 1000, which otherwise paints
    // over page-level fixed overlays (sticky bars, sheets) that use Tailwind's much lower z-* scale.
    <div className="relative isolate h-full w-full">
      <MapContainer
        center={[lat, lng]}
        zoom={14}
        scrollWheelZoom={false}
        className="h-full w-full"
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]} icon={MARKER_ICON} />
      </MapContainer>
    </div>
  );
}
