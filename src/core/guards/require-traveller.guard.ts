import { ACTIVE_ACCOUNT_STATUS, API_ERROR_CODES, HTTP_STATUS } from '../constants';
import { createSupabaseServerClient, prisma } from '../services';
import { ApiError } from '../utils';

/** A Supabase session still authenticates a suspended traveller, so the account is the gate, not the token. */
export const requireTraveller = async (): Promise<string> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const traveller =
    user &&
    (await prisma.traveller.findFirst({
      where: { authUserId: user.id, status: ACTIVE_ACCOUNT_STATUS },
      select: { id: true },
    }));
  if (!traveller) throw new ApiError(API_ERROR_CODES.unauthorized, HTTP_STATUS.unauthorized, 'Sign in to continue');

  return traveller.id;
};
