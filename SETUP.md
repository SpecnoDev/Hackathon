# WhatsApp onboarding bot — setup

A WhatsApp bot that walks a service provider through KYC, captures what they do in
their own words, structures it with Claude, and posts the profile to a registry API.

## "Don't we need a registered business for this?"

No. Not to build it, and not to test it with the team.

Meta provisions a **free test phone number** with every WhatsApp app. It needs no SIM
card, no business verification, no BSP contract, and no company registration — you get
it minutes after creating a developer app. You allowlist up to **5 recipient numbers**
and those people message the bot from their normal WhatsApp.

Business verification only becomes relevant when you exceed **250 unique recipients per
24 hours** or want your own branded number in production. Neither applies to a hackathon
demo.

What *is* real, and worth saying in the pitch:

- **24-hour service window** — you may only send free-form replies within 24h of the
  user's last message. Outside that you need pre-approved templates. This bot is
  entirely user-initiated, so it never hits the limit.
- **Per-message pricing** — from 1 October 2026 replies inside that 24h window become
  billable. Free during the event, a cost line on the roadmap.
- **POPIA** — ID numbers and documents are personal information. This prototype is
  built for **synthetic data only** and says so in its first message. Note that Cloud
  API means Meta processes message content, and uploaded media sits on Meta's servers
  for about 30 days.

## One-time Meta setup (~20 min)

1. Create a Meta Business Portfolio at business.facebook.com.
2. At developers.facebook.com create an app of type **Business**, then add the
   **WhatsApp** product.
3. From **WhatsApp → API Setup**, copy the **Phone number ID**.
4. Under **To**, add each teammate's WhatsApp number and have them confirm the code
   Meta sends. Maximum of five.
5. **Generate a permanent token.** The token shown on the API Setup page expires in 24
   hours and will break the demo tomorrow morning. Instead go to
   **Business Settings → System Users**, create an admin system user, **Generate token**,
   select your app, and tick `whatsapp_business_messaging` and
   `whatsapp_business_management`.
6. Copy the **App Secret** from **App Settings → Basic**.

## Run it

```bash
cp .env.example .env    # then fill in the six values
npm install
npm run start:dev
```

In a second terminal, expose the webhook:

```bash
npx cloudflared tunnel --url http://localhost:3000
```

Take the `https://…trycloudflare.com` URL it prints and in the Meta app dashboard go to
**WhatsApp → Configuration → Edit** and set:

- **Callback URL:** `https://<your-tunnel>/webhook`
- **Verify token:** the same string you put in `WHATSAPP_VERIFY_TOKEN`

Click **Verify and save**, then **Manage** and subscribe to the **messages** field.

> The tunnel URL changes every restart. If the bot goes quiet, re-run the tunnel and
> re-save the callback URL.

## Test script

Message the test number from an allowlisted phone:

| You send | Bot does |
|---|---|
| anything | Greets you, shows the synthetic-data notice, offers **Get started** |
| tap Get started | Asks for full name |
| `Henry Javangwe` | Asks for ID number |
| `123` | Rejects it — not 13 digits |
| `9001015800088` | Accepts (valid synthetic ID), derives DOB, asks for email |
| `henry@example.com` | Asks for service area |
| `Woodstock, Cape Town` | Asks for an ID photo |
| `SKIP` (or any image) | Reads the KYC details back for confirmation |
| tap Yes | Asks what services you offer |
| `I do plumbing and geyser installs around the southern suburbs, R450 an hour, and I quote separately on bathroom renovations.` | Claude splits that into structured offerings with categories and rates, shows them |
| tap Yes | Posts the profile and returns a reference |

Send `restart` at any point to start over.

Check what was captured:

```bash
curl -s http://localhost:3000/mock-registry/providers | python3 -m json.tool
```

## Architecture

```
src/
  core/         WhatsApp Cloud API client, conversation store, HMAC guard, shared types
  features/
    whatsapp/   webhook controller — verification, signature check, dedupe
    onboarding/ KYC state machine, Claude extraction, profile submission, registry stub
  shared/       SA ID / email validators
```

The KYC questions are a declarative table in
`src/features/onboarding/constants/kyc-steps.constant.ts` — add or reorder a question by
editing that array; the engine needs no changes.

## Known limits

- **Sessions are in-memory.** Restarting the server drops every in-progress
  conversation. Swap `ConversationStore` for Redis before this is more than a demo.
- **`MockRegistryController` is a stand-in** for the real registry. Point
  `PROFILE_API_URL` at the real endpoint and delete it.
- **ID documents are not downloaded** — only the Meta media ID is stored.
  `WhatsAppService.downloadMedia()` exists for when they need to be.
- Signature verification is **skipped** when `WHATSAPP_APP_SECRET` is unset, and logs a
  warning when it does. Set it.
