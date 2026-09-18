import { Host, Traveller } from '@prisma/client';
import { ENV_KEYS, USER_ROLES, adminEmails, isAccountActive, optionalEnv } from '../constants';
import { prisma } from './prisma.service';
import { readHostSession } from './session.service';
import { createSupabaseServerClient } from './supabase-server.service';

export type CurrentUser =
  | { role: typeof USER_ROLES.admin; email: string }
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
    // Status is read on every request, not stamped into the cookie: a suspension has to bite on
    // the next page load rather than when the session finally expires.
    if (host && isAccountActive(host.status)) return { role: USER_ROLES.host, host };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const email = user.email?.toLowerCase();
  if (email && adminEmails(optionalEnv(ENV_KEYS.adminEmails)).includes(email))
    return { role: USER_ROLES.admin, email };

  const traveller = await ensureTravellerForAuthUser(user.id, user.email);

  return traveller && isAccountActive(traveller.status) ? { role: USER_ROLES.traveller, traveller } : null;
};

/** A Supabase sign-up only creates an auth user, so the first visit is what makes them a traveller. */
const ensureTravellerForAuthUser = async (
  authUserId: string,
  email: string | undefined,
): Promise<Traveller | null> => {
  const existing = await prisma.traveller.findUnique({ where: { authUserId } });
  if (existing || !email) return existing;

  return prisma.traveller.create({
    data: { authUserId, email, name: email.split('@')[0] },
  });
};
