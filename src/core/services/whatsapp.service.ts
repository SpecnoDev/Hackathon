import {
  BUTTON_TITLE_MAX,
  DEFAULT_GRAPH_VERSION,
  ENV_KEYS,
  GRAPH_BASE_URL,
  INTERACTIVE_BODY_MAX,
  LIST_DESCRIPTION_MAX,
  LIST_TITLE_MAX,
  MAX_LIST_ROWS,
  MAX_REPLY_BUTTONS,
  optionalEnv,
  requireEnv,
} from '../constants';
import { ReplyOption } from '../interfaces';

export class WhatsAppService {
  private get graphVersion(): string {
    return optionalEnv(ENV_KEYS.graphVersion) ?? DEFAULT_GRAPH_VERSION;
  }

  private get messagesUrl(): string {
    return `${GRAPH_BASE_URL}/${this.graphVersion}/${requireEnv(ENV_KEYS.phoneNumberId)}/messages`;
  }

  private get authHeader(): string {
    return `Bearer ${requireEnv(ENV_KEYS.accessToken)}`;
  }

  sendText(to: string, body: string): Promise<void> {
    return this.send({ to, type: 'text', text: { preview_url: false, body } });
  }

  sendButtons(to: string, body: string, options: ReplyOption[]): Promise<void> {
    return this.send({
      to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { text: body.slice(0, INTERACTIVE_BODY_MAX) },
        action: {
          buttons: options.slice(0, MAX_REPLY_BUTTONS).map(({ id, title }) => ({
            type: 'reply',
            reply: { id, title: title.slice(0, BUTTON_TITLE_MAX) },
          })),
        },
      },
    });
  }

  /** WhatsApp caps reply buttons at three, so anything longer is asked as a list. */
  sendList(to: string, body: string, prompt: string, options: ReplyOption[]): Promise<void> {
    return this.send({
      to,
      type: 'interactive',
      interactive: {
        type: 'list',
        body: { text: body.slice(0, INTERACTIVE_BODY_MAX) },
        action: {
          button: prompt.slice(0, BUTTON_TITLE_MAX),
          sections: [
            {
              rows: options.slice(0, MAX_LIST_ROWS).map(({ id, title, description }) => ({
                id,
                title: title.slice(0, LIST_TITLE_MAX),
                ...(description ? { description: description.slice(0, LIST_DESCRIPTION_MAX) } : {}),
              })),
            },
          ],
        },
      },
    });
  }

  async downloadMedia(mediaId: string): Promise<Buffer> {
    const lookup = await fetch(`${GRAPH_BASE_URL}/${this.graphVersion}/${mediaId}`, {
      headers: { Authorization: this.authHeader },
    });
    if (!lookup.ok) throw new Error(`Media lookup failed: ${lookup.status}`);

    const { url } = (await lookup.json()) as { url: string };
    const binary = await fetch(url, { headers: { Authorization: this.authHeader } });
    if (!binary.ok) throw new Error(`Media download failed: ${binary.status}`);

    return Buffer.from(await binary.arrayBuffer());
  }

  private async send(payload: Record<string, unknown>): Promise<void> {
    const response = await fetch(this.messagesUrl, {
      method: 'POST',
      headers: { Authorization: this.authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({ messaging_product: 'whatsapp', ...payload }),
    });

    if (!response.ok) {
      console.error(`[whatsapp] send failed ${response.status}: ${await response.text()}`);
    }
  }
}
