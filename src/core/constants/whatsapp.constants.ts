export const GRAPH_BASE_URL = 'https://graph.facebook.com';
export const SIGNATURE_HEADER = 'x-hub-signature-256';
export const SIGNATURE_PREFIX = 'sha256=';

export const WEBHOOK_MODE_SUBSCRIBE = 'subscribe';

export const INTERACTIVE_BODY_MAX = 1024;
export const BUTTON_TITLE_MAX = 20;
export const MAX_REPLY_BUTTONS = 3;

/** WhatsApp's own list limits, used for any question with more answers than there are buttons. */
export const MAX_LIST_ROWS = 10;
export const LIST_TITLE_MAX = 24;
export const LIST_DESCRIPTION_MAX = 72;

export const PROCESSED_MESSAGE_TTL_MS = 60 * 60 * 1000;
export const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
