import { providerRegistryStore } from '@/features/onboarding/services';

export const dynamic = 'force-dynamic';

export default function Home() {
  const profiles = providerRegistryStore.list();

  return (
    <main>
      <h1>Providers onboarded via WhatsApp</h1>
      {profiles.length === 0 ? (
        <p>None yet — message the bot to register one.</p>
      ) : (
        profiles.map(({ reference, kyc, offerings }) => (
          <section key={reference}>
            <h2>
              {kyc.fullName} <small>{reference}</small>
            </h2>
            <p>
              {kyc.email} · {kyc.serviceArea}
            </p>
            <ul>
              {offerings.map((offering) => (
                <li key={offering.title}>
                  <strong>{offering.title}</strong> ({offering.category}) —{' '}
                  {offering.rateAmount === null
                    ? 'quoted per job'
                    : `${offering.currency} ${offering.rateAmount}${offering.pricingModel === 'hourly' ? '/hour' : ' fixed'}`}
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </main>
  );
}
