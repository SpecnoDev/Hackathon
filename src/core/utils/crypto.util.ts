import { timingSafeEqual } from 'node:crypto';

export const isEqualSecret = (received: string, expected: string): boolean => {
  const [a, b] = [Buffer.from(received), Buffer.from(expected)];
  return a.length === b.length && timingSafeEqual(a, b);
};
