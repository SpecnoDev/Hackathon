import type { MetadataRoute } from 'next';
import {
  APP_ICONS,
  PWA_BACKGROUND_COLOR,
  PWA_DESCRIPTION,
  PWA_NAME,
  PWA_SHORT_NAME,
  PWA_THEME_COLOR,
  ROUTES,
} from '@/core/constants';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: PWA_NAME,
    short_name: PWA_SHORT_NAME,
    description: PWA_DESCRIPTION,
    // The role matrix in middleware.ts sends each role on from here, so one start_url serves both shells.
    start_url: ROUTES.home,
    scope: ROUTES.home,
    display: 'standalone',
    orientation: 'portrait',
    theme_color: PWA_THEME_COLOR,
    background_color: PWA_BACKGROUND_COLOR,
    icons: [
      { src: APP_ICONS.any192, sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: APP_ICONS.any512, sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: APP_ICONS.maskable512, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
