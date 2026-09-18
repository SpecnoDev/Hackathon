import { ADMIN_COPY, ALL_STATUSES_FILTER, STATUS_FILTER_PARAM } from '../constants';
import type { StatusFilterOption } from '../components';

/** A query string promises nothing: anything the schema does not know reads as no filter at all. */
export const statusFromQuery = <T extends string>(
  raw: string | string[] | undefined,
  values: readonly T[],
): T | undefined => values.find((value) => value === raw);

export const statusHref = (basePath: string, status: string): string =>
  `${basePath}?${STATUS_FILTER_PARAM}=${status}`;

export const statusFilterOptions = <T extends string>(
  values: readonly T[],
  labels: Record<T, string>,
): StatusFilterOption[] => [
  { value: ALL_STATUSES_FILTER, label: ADMIN_COPY.filterAll },
  ...values.map((value) => ({ value, label: labels[value] })),
];
