import { ZA_DIALLING_CODE, ZA_NATIONAL_NUMBER_LENGTH } from '@/core/constants';

/** Hosts reach us as a wa_id (27…), a local 0… number or a pasted +27 — all of it is one identity. */
export const toE164 = (value: string): string | null => {
  const digits = value.replace(/\D/g, '');
  const national = digits.startsWith(ZA_DIALLING_CODE)
    ? digits.slice(ZA_DIALLING_CODE.length)
    : digits.replace(/^0/, '');

  return national.length === ZA_NATIONAL_NUMBER_LENGTH ? `+${ZA_DIALLING_CODE}${national}` : null;
};

export const toWaId = (e164: string): string => e164.replace(/^\+/, '');
