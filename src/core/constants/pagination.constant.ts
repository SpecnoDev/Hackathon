export const PAGE_SIZES = [10, 25, 50, 100] as const;
export type PageSize = (typeof PAGE_SIZES)[number];

export const DEFAULT_PAGE_SIZE: PageSize = 10;
export const FIRST_PAGE = 1;

export const PAGE_PARAM = 'page';
export const PAGE_SIZE_PARAM = 'size';
