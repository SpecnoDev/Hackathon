import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { APP_NAME, ROUTES } from '@/core/constants';
import { CATEGORY_ICON, CATEGORY_LABEL, TRAVELLER_ROUTES } from '@/features/demand/constants';
import { listLiveOfferings } from '@/features/demand/services';
import { HOST_COPY, HOST_ROUTES } from '@/features/supply/constants';
import { Button, HostedLogo, Icon, PatternField, type IconName } from '@/shared/components';
import { OFFERING_CATEGORIES } from '@/shared/dto';

const PHOTOS_SHOWN = 8;
/** Enough rows to still fill the strip after the ones sharing a photo are dropped. */
const SHOWCASE_QUERY_TAKE = 24;
const PHOTO_SIZES = '(min-width: 744px) 25vw, 176px';
const BULLET_ICON_PX = 20;
/** A real category and still bookable in Explore, but the front door leads with what people come here for. */
const CATEGORY_OFF_THE_FRONT_DOOR = 'ACCOMMODATION';
const CATEGORIES_SHOWN = OFFERING_CATEGORIES.filter((category) => category !== CATEGORY_OFF_THE_FRONT_DOOR);

const COPY = {
  signIn: 'Sign in',
  hero: {
    title: 'Travel that reaches the people who live here.',
    body: 'Meals, walks, lifts and guides from the people whose place it is. Booked in the app, paid straight to their phone.',
    explore: 'See what is on',
    host: 'Become a host',
  },
  showcase: 'On Hosted right now',
  categories: 'What you can book',
  doors: {
    title: 'Two ways in',
    traveller: {
      title: 'I want to explore',
      body: 'Find someone local, see what they offer, and book it.',
      points: [
        { icon: 'search', title: 'Browse by place', body: 'Cape Town, Soweto, Knysna, the Karoo and the coast.' },
        { icon: 'users', title: 'Choose a person', body: 'Every listing is one host, with their story and their reviews.' },
        { icon: 'credit-card', title: 'Book and pay in rand', body: 'Confirm in the app. No haggling at the door.' },
      ],
      action: 'Start exploring',
    },
    host: {
      title: 'I want to earn',
      body: 'List what you already know how to do, and get paid for it.',
      action: 'Join as a host',
      note: 'A phone and your ID is all you need. No bank account, no website.',
    },
  },
  planner: {
    title: 'Planning with other people?',
    body: 'Build one itinerary together: drag in experiences, vote, let the group decide.',
    action: 'Open the trip planner',
  },
  footer: `${APP_NAME}. Local hosts, real places, across South Africa.`,
  privacy: 'Privacy and data deletion',
};

/* On the green panel the muted greys fall under 4.5:1, so the second line steps up to body ink and so does the icon. */
const Point = ({ icon, title, body, onGreen }: { icon: IconName; title: string; body: string; onGreen: boolean }) => (
  <li className="flex items-start gap-3">
    <Icon name={icon} size={BULLET_ICON_PX} className={`mt-0.5 shrink-0 ${onGreen ? 'text-ink' : 'text-primary-text'}`} />
    <span className="flex flex-col gap-0.5">
      <span className="text-title-sm text-ink">{title}</span>
      <span className={`text-body-sm ${onGreen ? 'text-body' : 'text-muted'}`}>{body}</span>
    </span>
  </li>
);

const Door = ({ title, body, children, action, href, green = false }: { title: string; body: string; children: React.ReactNode; action: string; href: string; green?: boolean }) => (
  <section className={`flex flex-col gap-5 rounded-xl p-6 tablet:p-8 ${green ? 'bg-primary' : 'border border-hairline bg-canvas'}`}>
    <div className="flex flex-col gap-2">
      <h3 className="font-display text-display-md text-ink">{title}</h3>
      <p className={`text-body-md ${green ? 'text-ink' : 'text-body'}`}>{body}</p>
    </div>
    <ul className="flex flex-1 flex-col gap-4">{children}</ul>
    <Button href={href} size="md" variant={green ? 'secondary' : 'primary'} fullWidth={false}>
      {action}
    </Button>
  </section>
);

/**
 * The public front door. It says what the platform is, shows what is actually on it today, and sends you to one of
 * the two apps. Everything it draws comes from the same components and tokens the two sides use.
 *
 * A Supabase sign-in link falls back to the configured Site URL when its redirect is not on the
 * allow-list, dropping the one-time code here instead of on the page that trades it for a
 * session. Forwarding it means a misconfigured dashboard cannot silently swallow a sign-in.
 */
export default async function LandingPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const { code } = await searchParams;
  if (code) redirect(`${ROUTES.loginComplete}?code=${encodeURIComponent(code)}`);

  /* Several offerings still share a stock photo, and a strip of the same picture four times reads as a bug. */
  const live = await listLiveOfferings({ take: SHOWCASE_QUERY_TAKE, sort: 'top_rated' });
  const seen = new Set<string>();
  const showcase = live
    .filter((offering) => {
      const photo = offering.photos[0];
      if (!photo || seen.has(photo)) return false;
      seen.add(photo);
      return true;
    })
    .slice(0, PHOTOS_SHOWN);

  return (
    <div className="flex min-h-dvh flex-col bg-sand">
      <main className="flex flex-col">
        <section className="relative overflow-hidden rounded-b-lg bg-primary-deep">
          <PatternField />
          <div className="relative mx-auto flex w-full max-w-page flex-col gap-6 px-4 pb-10 pt-4 tablet:px-6 tablet:pb-12 tablet:pt-6">
            <header className="flex items-center justify-between gap-4 py-2">
              <HostedLogo name={APP_NAME} onDark />
              <Link href={ROUTES.login} className="flex min-h-12 items-center text-link text-on-dark underline">
                {COPY.signIn}
              </Link>
            </header>
            <h1 className="max-w-2xl font-display text-display-xl text-on-dark">{COPY.hero.title}</h1>
            <p className="max-w-xl text-body-md text-on-dark/70">{COPY.hero.body}</p>
            <div className="flex flex-col gap-3 tablet:flex-row">
              <Button href={TRAVELLER_ROUTES.home} size="md" fullWidth={false}>
                {COPY.hero.explore}
              </Button>
              <Button href={HOST_ROUTES.welcome} size="md" variant="secondary" fullWidth={false}>
                {COPY.hero.host}
              </Button>
            </div>
          </div>

          {showcase.length > 0 ? (
            <div className="relative mx-auto w-full max-w-page pb-12 tablet:px-6">
              <h2 className="px-4 pb-3 text-caption text-on-dark/70 tablet:px-0">{COPY.showcase}</h2>
              <ul className="flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 [scrollbar-width:none] tablet:grid tablet:grid-cols-4 tablet:px-0 [&::-webkit-scrollbar]:hidden">
                {showcase.map((offering) => (
                  <li key={offering.id} className="w-44 shrink-0 snap-start tablet:w-auto">
                    <Link href={TRAVELLER_ROUTES.listing(offering.id)} className="flex flex-col gap-2 active:opacity-80">
                      <span className="relative aspect-4/3 overflow-hidden rounded-md bg-primary-deep">
                        {offering.photos[0] ? <Image src={offering.photos[0]} alt={offering.title} fill className="object-cover" sizes={PHOTO_SIZES} /> : null}
                      </span>
                      <span className="line-clamp-2 text-body-sm text-on-dark">{offering.title}</span>
                      <span className="text-caption text-on-dark/60">{offering.town}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        <section className="mx-auto flex w-full max-w-page flex-col gap-4 px-4 py-12 tablet:px-6">
          <h2 className="text-title-lg text-ink">{COPY.categories}</h2>
          <ul className="grid grid-cols-2 gap-3 tablet:grid-cols-4">
            {CATEGORIES_SHOWN.map((category) => (
              <li key={category}>
                <Link
                  href={`${TRAVELLER_ROUTES.home}?category=${category}`}
                  className="flex min-h-16 items-center gap-3 rounded-lg border border-hairline bg-canvas px-4 text-ink active:bg-surface-soft"
                >
                  <Icon name={CATEGORY_ICON[category]} className="shrink-0 text-primary-text" />
                  <span className="min-w-0 text-title-sm leading-tight">{CATEGORY_LABEL[category]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto flex w-full max-w-page flex-col gap-4 px-4 pb-16 tablet:px-6">
          <Link
            href={ROUTES.plan}
            className="flex flex-col gap-3 rounded-xl border border-hairline bg-canvas p-6 active:bg-surface-soft tablet:flex-row tablet:items-center tablet:justify-between tablet:p-8"
          >
            <span className="flex flex-col gap-1">
              <span className="text-title-lg text-ink">{COPY.planner.title}</span>
              <span className="text-body-md text-body">{COPY.planner.body}</span>
            </span>
            <span className="flex shrink-0 items-center gap-2 text-link text-primary-text underline">
              {COPY.planner.action}
              <Icon name="chevron-right" size={BULLET_ICON_PX} />
            </span>
          </Link>

          <h2 className="text-title-lg text-ink">{COPY.doors.title}</h2>
          <div className="grid gap-4 desktop:grid-cols-2">
            <Door title={COPY.doors.traveller.title} body={COPY.doors.traveller.body} action={COPY.doors.traveller.action} href={TRAVELLER_ROUTES.home}>
              {COPY.doors.traveller.points.map((point) => (
                <Point key={point.title} icon={point.icon as IconName} title={point.title} body={point.body} onGreen={false} />
              ))}
            </Door>
            <Door title={COPY.doors.host.title} body={COPY.doors.host.body} action={COPY.doors.host.action} href={HOST_ROUTES.welcome} green>
              {HOST_COPY.welcome.how.steps.map((step) => (
                <Point key={step.title} icon={step.icon} title={step.title} body={step.body} onGreen />
              ))}
              <li className="text-body-sm text-body">{COPY.doors.host.note}</li>
            </Door>
          </div>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-page px-4 pb-10 tablet:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline-soft pt-6">
          <p className="text-caption text-muted">{COPY.footer}</p>
          <Link href={ROUTES.privacy} className="text-caption text-muted underline">
            {COPY.privacy}
          </Link>
        </div>
      </footer>
    </div>
  );
}
