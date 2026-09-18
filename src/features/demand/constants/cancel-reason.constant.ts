export const CANCEL_REASONS = ['PLANS_CHANGED', 'FOUND_SOMETHING_ELSE', 'WEATHER', 'OTHER'] as const;
export type CancelReason = (typeof CANCEL_REASONS)[number];

export const CANCEL_REASON_LABEL: Record<CancelReason, string> = {
  PLANS_CHANGED: 'My plans changed',
  FOUND_SOMETHING_ELSE: 'I found something else',
  WEATHER: 'The weather',
  OTHER: 'Something else',
};
