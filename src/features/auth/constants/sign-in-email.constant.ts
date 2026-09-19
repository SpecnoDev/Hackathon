import type { EmailOtpType } from '@supabase/supabase-js';
import { DEMO_LINK_TYPE } from './demo-sign-in.constant';

export const SIGN_IN_LINK_TYPE = DEMO_LINK_TYPE;
export const SIGN_IN_LINK_TOKEN_PARAM = 'token_hash';
export const SIGN_IN_LINK_TYPE_PARAM = 'type';
/** A magic link for an address with no auth user yet is minted as a signup token; both verify the same way. */
export const SIGN_IN_LINK_TYPES: readonly EmailOtpType[] = ['magiclink', 'signup'];

/* Email clients read inline styles and hex only, so the tokens are repeated here by value. */
export const SIGN_IN_EMAIL_COPY = {
  subject: 'Your Hosted sign-in code',
  invalid: 'That does not look like an email address.',
  failed: 'We could not send the email. Try again in a moment.',
  text: (code: string, link: string) =>
    `Your Hosted code is ${code}. Type it into the sign-in screen, or open this link to sign in: ${link}\n\nIf you did not ask for this, ignore it.`,
  html: (code: string, link: string) =>
    `<div style="font-family:Montserrat,Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#050505">` +
    `<p style="font-size:14px;color:#5f574b;margin:0 0 8px">Hosted</p>` +
    `<h1 style="font-size:24px;margin:0 0 16px">Your sign-in code</h1>` +
    `<p style="font-size:40px;letter-spacing:8px;font-weight:600;margin:0 0 16px">${code}</p>` +
    `<p style="font-size:16px;line-height:1.5;margin:0 0 24px">Type it into the sign-in screen, or tap the button.</p>` +
    `<a href="${link}" style="display:inline-block;background:#7fbb53;color:#050505;text-decoration:none;font-weight:600;padding:14px 24px;border-radius:12px">Sign in to Hosted</a>` +
    `<p style="font-size:14px;color:#5f574b;margin:24px 0 0">If you did not ask for this, ignore it.</p>` +
    `</div>`,
} as const;
