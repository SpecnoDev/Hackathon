import { SA_COUNTRY_CODE } from '@/core/constants';

const NON_DIGITS = /\D/g;
const LOCAL_TRUNK_PREFIX = '0';
/** SA mobile numbers: nine digits after the country code, starting 6, 7 or 8. */
const SA_MOBILE_NATIONAL = /^[6-8]\d{8}$/;
const NATIONAL_LENGTH = 9;
const VISIBLE_TAIL_DIGITS = 4;
const AREA_DIGITS = 2;
const MASK = '***';

/** Accepts "082 123 4471", "0821234471", "821234471" or "+27821234471" and returns the nine national digits. */
export const toNationalDigits = (input: string): string => {
  const digits = input.replace(NON_DIGITS, '');
  const countryDigits = SA_COUNTRY_CODE.replace(NON_DIGITS, '');
  if (digits.startsWith(countryDigits) && digits.length > NATIONAL_LENGTH) return digits.slice(countryDigits.length);
  return digits.startsWith(LOCAL_TRUNK_PREFIX) ? digits.slice(LOCAL_TRUNK_PREFIX.length) : digits;
};

export const isSaMobile = (input: string): boolean => SA_MOBILE_NATIONAL.test(toNationalDigits(input));

export const toE164 = (input: string): string => `${SA_COUNTRY_CODE}${toNationalDigits(input)}`;

/** A number must never wrap in the middle, so its groups are joined with non-breaking spaces. */
const GROUP_GAP = ' ';

/** "082 123 4471" */
export const formatLocalPhone = (input: string): string => {
  const national = toNationalDigits(input);
  const head = `${LOCAL_TRUNK_PREFIX}${national.slice(0, AREA_DIGITS)}`;
  return [head, national.slice(AREA_DIGITS, AREA_DIGITS + 3), national.slice(AREA_DIGITS + 3)].filter(Boolean).join(GROUP_GAP);
};

/** "082 *** 4471": enough for a host to recognise their own number, never the whole thing. */
export const maskPhone = (input: string): string => {
  const national = toNationalDigits(input);
  return [`${LOCAL_TRUNK_PREFIX}${national.slice(0, AREA_DIGITS)}`, MASK, national.slice(-VISIBLE_TAIL_DIGITS)].join(GROUP_GAP);
};

export const whatsAppLink = (input: string, message?: string): string => {
  const base = `https://wa.me/${toE164(input).replace(NON_DIGITS, '')}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};
