export interface WhatsAppTextBody {
  body: string;
}

export interface WhatsAppInteractiveReply {
  id: string;
  title: string;
}

export interface WhatsAppInteractive {
  type: 'button_reply' | 'list_reply';
  button_reply?: WhatsAppInteractiveReply;
  list_reply?: WhatsAppInteractiveReply;
}

export interface WhatsAppMediaRef {
  id: string;
  mime_type: string;
  sha256?: string;
}

export interface WhatsAppInboundMessage {
  id: string;
  from: string;
  timestamp: string;
  type: 'text' | 'interactive' | 'image' | 'audio' | 'document' | string;
  text?: WhatsAppTextBody;
  interactive?: WhatsAppInteractive;
  image?: WhatsAppMediaRef;
  audio?: WhatsAppMediaRef;
}

export interface WhatsAppContact {
  wa_id: string;
  profile?: { name?: string };
}

export interface WhatsAppChangeValue {
  messaging_product: string;
  contacts?: WhatsAppContact[];
  messages?: WhatsAppInboundMessage[];
}

export interface WhatsAppWebhookPayload {
  object: string;
  entry?: Array<{ id: string; changes?: Array<{ field: string; value: WhatsAppChangeValue }> }>;
}

export interface ReplyOption {
  id: string;
  title: string;
  description?: string;
}
