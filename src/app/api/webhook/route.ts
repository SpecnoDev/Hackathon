import { NextRequest, NextResponse, after } from 'next/server';
import { ENV_KEYS, SIGNATURE_HEADER, WEBHOOK_MODE_SUBSCRIBE, optionalEnv, requireEnv } from '@/core/constants';
import { WhatsAppWebhookPayload } from '@/core/interfaces';
import { conversationStore } from '@/core/services';
import { isValidWebhookSignature } from '@/core/utils';
import { onboardingFlow } from '@/features/onboarding/services';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Meta's subscription handshake — echo the challenge back when the token matches. */
export function GET(request: NextRequest): NextResponse {
  const params = request.nextUrl.searchParams;

  const verified =
    params.get('hub.mode') === WEBHOOK_MODE_SUBSCRIBE &&
    params.get('hub.verify_token') === requireEnv(ENV_KEYS.verifyToken);

  return verified
    ? new NextResponse(params.get('hub.challenge'))
    : new NextResponse(null, { status: 403 });
}

/**
 * Meta retries any webhook it does not see acknowledged within seconds, so this
 * acknowledges immediately and processes out of band. Messages are claimed before
 * the response is sent, so a retry that overlaps processing is still deduplicated.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const rawBody = await request.text();
  const appSecret = optionalEnv(ENV_KEYS.appSecret);

  if (!appSecret) {
    console.warn(`[webhook] ${ENV_KEYS.appSecret} unset — skipping signature verification`);
  } else if (!isValidWebhookSignature(rawBody, request.headers.get(SIGNATURE_HEADER), appSecret)) {
    return new NextResponse(null, { status: 403 });
  }

  const payload = JSON.parse(rawBody) as WhatsAppWebhookPayload;
  const inbound = (payload.entry ?? [])
    .flatMap((entry) => entry.changes ?? [])
    .flatMap(({ value }) =>
      (value.messages ?? []).map((message) => ({ message, displayName: value.contacts?.[0]?.profile?.name })),
    );

  const claims = await Promise.all(inbound.map(({ message }) => conversationStore.claimMessage(message.id)));

  after(
    Promise.all(
      inbound
        .filter((_, index) => claims[index])
        .map(({ message, displayName }) =>
          onboardingFlow.handle(message, displayName).catch((error) => console.error('[webhook] handler failed', error)),
        ),
    ),
  );

  return new NextResponse(null, { status: 200 });
}
