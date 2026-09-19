import { execFile } from 'node:child_process';
import { createClient } from '@supabase/supabase-js';

/*
 * Dev only: signs a traveller in without an inbox. The seeded travellers use @example.com
 * addresses, so the emailed code never arrives anywhere; this asks Supabase's admin API for
 * the same link it would have mailed. The link lands on /login, where SessionFromUrl reads
 * the tokens out of the fragment and the server resolves the role.
 *
 *   npm run sign-in-link                 # jess@example.com
 *   npm run sign-in-link -- mike@example.com
 *
 * The browser is opened from here rather than by pasting: the link holds `&`, which an
 * unquoted shell reads as "run in background" and Supabase then sees a URL with no `type`.
 */
const DEFAULT_EMAIL = 'jess@example.com';
const DEFAULT_APP_URL = 'http://localhost:3000';
const LOGIN_ROUTE = '/login';
const OPEN_COMMAND: Partial<Record<NodeJS.Platform, string>> = { darwin: 'open', linux: 'xdg-open' };

const email = process.argv[2] ?? DEFAULT_EMAIL;
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? DEFAULT_APP_URL;

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const main = async () => {
  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo: `${appUrl}${LOGIN_ROUTE}` },
  });
  if (error) throw error;

  const link = data.properties.action_link;
  const opener = OPEN_COMMAND[process.platform];

  if (opener) execFile(opener, [link]);
  console.log(
    `Sign-in link for ${email}${opener ? ', opening in your default browser' : ''}.\n` +
      `If you paste it anywhere, quote it — the & signs break an unquoted shell.\n\n${link}\n`,
  );
};

main().catch((error) => {
  console.error(error.message ?? error);
  process.exit(1);
});
