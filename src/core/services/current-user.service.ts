import { Host, Traveller } from '@prisma/client';
import { USER_ROLES } from '../constants';
import { prisma } from './prisma.service';
import { readHostSession } from './session.service';
import { createSupabaseServerClient } from './supabase-server.service';

export type CurrentUser =
  | { role: typeof USER_ROLES.host; host: Host }
  | { role: typeof USER_ROLES.traveller; traveller: Traveller }
  | null;

/**
 * The one place a request is resolved to a role, so every page and route group
 * branches on the same answer. The host cookie is checked first because it costs
 * no network call — only a signature check — and a host never needs Supabase.
 */
export const getCurrentUser = async (): Promise<CurrentUser> => {
  const hostId = await readHostSession();

  if (hostId) {
    const host = await prisma.host.findUnique({ where: { id: hostId } });
    if (host) return { role: USER_ROLES.host, host };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const traveller = await prisma.traveller.findUnique({ where: { authUserId: user.id } });

  return traveller ? { role: USER_ROLES.traveller, traveller } : null;
};
