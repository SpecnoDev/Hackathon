import { ZA_DIALLING_CODE, ZA_NATIONAL_NUMBER_LENGTH } from '@/core/constants';

const NON_DIGITS = /\D/g;
const LOCAL_TRUNK_PREFIX = '0';
/** SA mobile numbers: nine digits after the country code, starting 6, 7 or 8. */
const SA_MOBILE_NATIONAL = /^[6-8]\d{8}$/;
const VISIBLE_TAIL_DIGITS = 4;
const AREA_DIGITS = 2;
const MASK = '***';
/** A number must never wrap in the middle, so its groups are joined with non-breaking spaces. */
const GROUP_GAP = '\u00A0';

/** Accepts "082 123 4471", "0821234471", "821234471", "27821234471" or "+27821234471" and returns the national digits. */
export const toNationalDigits = (input: string): string => {
  const digits = input.replace(NON_DIGITS, '');
  if (digits.startsWith(ZA_DIALLING_CODE) && digits.length > ZA_NATIONAL_NUMBER_LENGTH) return digits.slice(ZA_DIALLING_CODE.length);
  return digits.startsWith(LOCAL_TRUNK_PREFIX) ? digits.slice(LOCAL_TRUNK_PREFIX.length) : digits;
};

export const isSaMobile = (input: string): boolean => SA_MOBILE_NATIONAL.test(toNationalDigits(input));

/** Hosts reach us as a wa_id (27…), a local 0… number or a pasted +27 — all of it is one identity. */
export const toE164 = (value: string): string | null => {
  const national = toNationalDigits(value);
  return national.length === ZA_NATIONAL_NUMBER_LENGTH ? `+${ZA_DIALLING_CODE}${national}` : null;
};

export const toWaId = (e164: string): string => e164.replace(/^\+/, '');

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
  const base = `https://wa.me/${ZA_DIALLING_CODE}${toNationalDigits(input)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};
