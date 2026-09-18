import { z } from 'zod';
import { DEFAULT_PAGE_SIZE, FIRST_PAGE, PAGE_PARAM, PAGE_SIZES, PAGE_SIZE_PARAM, type PageSize } from '@/core/constants';

const isPageSize = (value: number): value is PageSize => (PAGE_SIZES as readonly number[]).includes(value);

/**
 * A query string is untrusted input, not an error: a page of "abc" or a size of 7 reads as the
 * default rather than a 500 on a screen somebody opened mid-incident.
 */
export const paginationQuerySchema = z.object({
  [PAGE_PARAM]: z.coerce.number().int().min(FIRST_PAGE).catch(FIRST_PAGE),
  [PAGE_SIZE_PARAM]: z.coerce
    .number()
    .catch(DEFAULT_PAGE_SIZE)
    .transform((value) => (isPageSize(value) ? value : DEFAULT_PAGE_SIZE)),
});

export interface PageQuery {
  page: number;
  size: PageSize;
}

export interface PageRange {
  skip: number;
  take: number;
}

export interface Paged<T> {
  rows: T[];
  total: number;
}

export const readPagination = (raw: unknown): PageQuery => {
  const parsed = paginationQuerySchema.parse(raw ?? {});

  return { page: parsed[PAGE_PARAM], size: parsed[PAGE_SIZE_PARAM] };
};

export const toPageRange = ({ page, size }: PageQuery): PageRange => ({ skip: (page - FIRST_PAGE) * size, take: size });
