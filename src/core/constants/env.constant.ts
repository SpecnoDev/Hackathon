export const ENV_KEYS = {
  databaseUrl: 'DATABASE_URL',
  phoneNumberId: 'WHATSAPP_PHONE_NUMBER_ID',
  accessToken: 'WHATSAPP_ACCESS_TOKEN',
  appSecret: 'WHATSAPP_APP_SECRET',
  verifyToken: 'WHATSAPP_VERIFY_TOKEN',
  graphVersion: 'WHATSAPP_GRAPH_VERSION',
  profileApiUrl: 'PROFILE_API_URL',
  profileApiToken: 'PROFILE_API_TOKEN',
  sessionSecret: 'SESSION_SECRET',
  internalApiToken: 'INTERNAL_API_TOKEN',
  idHashSalt: 'ID_HASH_SALT',
  supabaseUrl: 'NEXT_PUBLIC_SUPABASE_URL',
  supabasePublishableKey: 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  supabaseSecretKey: 'SUPABASE_SECRET_KEY',
  adminEmails: 'ADMIN_EMAILS',
  appUrl: 'NEXT_PUBLIC_APP_URL',
  allowMockAuth: 'ALLOW_MOCK_AUTH',
  allowDemoBypass: 'ALLOW_DEMO_BYPASS',
} as const;

export const DEFAULT_GRAPH_VERSION = 'v21.0';

export const isProduction = (): boolean => process.env.NODE_ENV === 'production';

/** Read lazily at call time — a missing value must fail the request, not the build. */
export const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

export const optionalEnv = (key: string): string | undefined => process.env[key] || undefined;
