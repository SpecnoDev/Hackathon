export const TRIPS_PATH = '/api/v1/trips';
export const tripBlocksPath = (tripId: string): string => `${TRIPS_PATH}/${tripId}/blocks`;
