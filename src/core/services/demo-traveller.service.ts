import { Traveller } from '@prisma/client';
import { DEMO_TRAVELLER_EMAILS } from '@/features/auth/constants';
import { isAccountActive } from '../constants';
import { prisma } from './prisma.service';

/**
 * Hackathon-only: the seeded traveller a demo-bypass page guard resolves to when there is no
 * session at all. Looks up the same email `signInDemoTraveller` mints a real session for, so a
 * bare deep link and "Continue as Jess Cronin" land on the identical row. Removal target: after
 * judging, 2026-09-19.
 */
export const getDemoTraveller = async (): Promise<Traveller | null> => {
  const traveller = await prisma.traveller.findFirst({ where: { email: DEMO_TRAVELLER_EMAILS[0] } });
  return traveller && isAccountActive(traveller.status) ? traveller : null;
};
