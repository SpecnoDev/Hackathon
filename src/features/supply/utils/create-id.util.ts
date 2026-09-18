const ID_BYTES = 16;
const HEX_RADIX = 16;
const HEX_PAD = 2;

/**
 * docs/TECH_STACK.md: rows created offline get a client-generated id. crypto.randomUUID only exists
 * on HTTPS or localhost, and a host may be testing over plain HTTP on a LAN address, so fall back.
 */
export const createId = (): string => {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return Array.from(crypto.getRandomValues(new Uint8Array(ID_BYTES)), (byte) => byte.toString(HEX_RADIX).padStart(HEX_PAD, '0')).join('');
};
