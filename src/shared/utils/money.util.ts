/** Formats integer cents as "R1 250" — space thousands separator, no decimals, per DESIGN.md. */
export const formatRands = (cents: number): string => {
  const rands = Math.round(cents / 100);
  return `R${rands.toLocaleString('en-ZA').replace(/,/g, ' ')}`;
};
