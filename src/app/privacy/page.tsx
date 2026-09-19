export const metadata = { title: 'Privacy' };

const CONTACT_EMAIL = 'henry.javangwe@specno.com';

const SECTIONS = [
  {
    title: 'What this is',
    body: 'Hosted is a prototype built at Builders Table 2026. It lets local hosts list experiences by WhatsApp and lets travellers book them. It is not yet a commercial service.',
  },
  {
    title: 'What we collect',
    body: 'From hosts: your WhatsApp number, the name you give us, the area you host in, the type of document you hold, any photo you choose to send, and what you tell us you offer. From travellers: your email address and your bookings.',
  },
  {
    title: 'How we use it',
    body: 'To create your listing, to let travellers find and book you, to sign you in, and to pay you. Messages you send the bot are processed to build your listing and are not used for anything else.',
  },
  {
    title: 'Who else sees it',
    body: 'WhatsApp messages pass through Meta, which processes message content and holds media for about thirty days. Listing text is drafted with an AI service. Payments are mocked in this prototype and no card details are collected.',
  },
  {
    title: 'Identity documents',
    body: 'We store only a one-way hash of an ID number, never the number itself. Document photos are kept in private storage and are never shown to travellers. Please use test details only while this is a prototype.',
  },
  {
    title: 'Deleting your data',
    body: `To delete everything we hold about you, send the word DELETE to the WhatsApp number you registered with, or email ${CONTACT_EMAIL} from the address you signed in with. We remove your account, listings and messages within seven days and confirm when it is done.`,
  },
] as const;

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-host flex-col px-6 py-12">
      <h1 className="font-display text-display-lg text-ink">Privacy and your data</h1>
      <p className="mt-2 text-body-md text-muted">Plain language. Last updated 19 September 2026.</p>

      <div className="mt-8 flex flex-col gap-6">
        {SECTIONS.map(({ title, body }) => (
          <section key={title} id={title === 'Deleting your data' ? 'delete' : undefined}>
            <h2 className="text-title-md text-ink">{title}</h2>
            <p className="mt-2 text-body-md text-body">{body}</p>
          </section>
        ))}
      </div>

      <p className="mt-10 text-caption text-muted">
        Questions: <a href={`mailto:${CONTACT_EMAIL}`} className="text-link text-primary-text underline">{CONTACT_EMAIL}</a>
      </p>
    </main>
  );
}
