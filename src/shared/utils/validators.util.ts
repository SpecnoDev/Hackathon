import { SA_ID_LENGTH } from '@/core/constants';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const isValidEmail = (value: string): boolean => EMAIL_PATTERN.test(value);

const passesLuhn = (digits: string): boolean => {
  const total = [...digits].reverse().reduce((sum, char, index) => {
    const digit = Number(char);
    if (index % 2 === 0) return sum + digit;
    const doubled = digit * 2;
    return sum + (doubled > 9 ? doubled - 9 : doubled);
  }, 0);
  return total % 10 === 0;
};

/** Derives YYYY-MM-DD from an SA ID, pivoting the 2-digit year on the current century. */
export const dateOfBirthFromSaId = (id: string): string | null => {
  const [year, month, day] = [id.slice(0, 2), id.slice(2, 4), id.slice(4, 6)].map(Number);
  const currentYear = new Date().getFullYear() % 100;
  const century = year <= currentYear ? 2000 : 1900;
  const candidate = new Date(Date.UTC(century + year, month - 1, day));

  const isRealDate =
    candidate.getUTCMonth() === month - 1 && candidate.getUTCDate() === day && month >= 1 && month <= 12;

  return isRealDate ? candidate.toISOString().slice(0, 10) : null;
};

export const isValidSaId = (value: string): boolean =>
  new RegExp(`^\\d{${SA_ID_LENGTH}}$`).test(value) &&
  dateOfBirthFromSaId(value) !== null &&
  passesLuhn(value);

export const normalise = (value: string): string => value.trim().replace(/\s+/g, ' ');
