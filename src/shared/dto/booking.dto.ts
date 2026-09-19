import { z } from 'zod';

/** The only transitions a host can make from the UI — REQUESTED -> CONFIRMED/DECLINED. */
export const hostBookingPatchSchema = z.object({ status: z.enum(['CONFIRMED', 'DECLINED']) }).strict();

export type HostBookingPatchDto = z.infer<typeof hostBookingPatchSchema>;
