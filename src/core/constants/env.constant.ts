export const ENV_KEYS = {
  phoneNumberId: 'WHATSAPP_PHONE_NUMBER_ID',
  accessToken: 'WHATSAPP_ACCESS_TOKEN',
  appSecret: 'WHATSAPP_APP_SECRET',
  verifyToken: 'WHATSAPP_VERIFY_TOKEN',
  graphVersion: 'WHATSAPP_GRAPH_VERSION',
  profileApiUrl: 'PROFILE_API_URL',
  profileApiToken: 'PROFILE_API_TOKEN',
} as const;

export const DEFAULT_GRAPH_VERSION = 'v21.0';

/** Read lazily at call time — a missing value must fail the request, not the build. */
export const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

export const optionalEnv = (key: string): string | undefined => process.env[key] || undefined;
