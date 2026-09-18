import { SA_LOCALE } from '@/core/constants';

const MONTH_YEAR = new Intl.DateTimeFormat(SA_LOCALE, { month: 'long', year: 'numeric' });

/** "September 2026" — a review is dated to the month, which is as precise as a traveller needs. */
export const formatMonthYear = (iso: string): string => MONTH_YEAR.format(new Date(iso));
