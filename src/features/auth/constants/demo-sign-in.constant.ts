/** The seeded traveller a demo signs in as. Her @example.com inbox does not exist, so a code could never reach her. */
export const DEMO_TRAVELLER_EMAILS = ['jess@example.com'] as const;

export const DEMO_SIGN_IN_PATH = '/api/v1/auth/demo/session';
export const DEMO_SIGN_IN_FIELD = 'email';
/** Supabase's own name for the link type asked for. */
export const DEMO_LINK_TYPE = 'magiclink';
