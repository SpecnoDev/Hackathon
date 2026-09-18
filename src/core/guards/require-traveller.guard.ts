import { API_ERROR_CODES, HTTP_STATUS } from '../constants';
import { createSupabaseServerClient, prisma } from '../services';
import { ApiError } from '../utils';

export const requireTraveller = async (): Promise<string> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const traveller = user && (await prisma.traveller.findUnique({ where: { authUserId: user.id }, select: { id: true } }));
  if (!traveller) throw new ApiError(API_ERROR_CODES.unauthorized, HTTP_STATUS.unauthorized, 'Sign in to continue');

  return traveller.id;
};
