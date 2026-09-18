import { formatLocalPhone, isSaMobile } from '@/shared/utils';
import { TRAVELLER_PHONE_PATTERN } from '../constants';

const PHONE_SEPARATORS = /[\s().-]/g;

/** What the traveller typed, without the spaces, brackets, dots and dashes people put in phone numbers. */
export const normalisePhone = (typed: string): string => typed.replace(PHONE_SEPARATORS, '');

export const isTravellerPhone = (typed: string): boolean => TRAVELLER_PHONE_PATTERN.test(normalisePhone(typed));

/** A visitor's number stays as they gave it; only a South African number has a local way of being written. */
export const displayPhone = (phone: string): string => (isSaMobile(phone) ? formatLocalPhone(phone) : phone);
