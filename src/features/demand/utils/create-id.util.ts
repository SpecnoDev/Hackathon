/** Ids are made on the phone so a booking made offline can be replayed safely: the API upserts by this id. */
export const createId = (): string => crypto.randomUUID();
