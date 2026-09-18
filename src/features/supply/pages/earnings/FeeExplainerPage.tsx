import { Banner, Icon } from '@/shared/components';
import { formatRand, hostReceivesCents, platformFeeCents, platformFeePercent } from '@/shared/utils';
import { HostScreen } from '../../components';
import { HOST_COPY, HOST_ROUTES } from '../../constants';

/** The PRD's own worked example: a R600 booking. */
const EXAMPLE_PRICE_CENTS = 60_000;
const copy = HOST_COPY.earnings.fees;

/** Screen 31. Reached from the price row of a listing and from Earnings. */
export const FeeExplainerPage = () => (
  <HostScreen barTitle={HOST_COPY.earnings.title} backHref={HOST_ROUTES.earnings.home} heading={copy.title} helper={copy.lead(platformFeePercent())}>
    <div className="flex flex-col gap-6">
      <div className="rounded-lg bg-accent-tint p-5 text-body-host text-ink">
        {copy.example(formatRand(EXAMPLE_PRICE_CENTS), formatRand(platformFeeCents(EXAMPLE_PRICE_CENTS)), formatRand(hostReceivesCents(EXAMPLE_PRICE_CENTS)))}
      </div>
      <section className="flex flex-col gap-3">
        <h2 className="text-title-lg text-ink">{copy.whyTitle}</h2>
        <ul className="flex flex-col gap-3">
          {copy.why.map((reason) => (
            <li key={reason} className="flex items-start gap-3 text-body-host text-ink">
              <Icon name="check" className="mt-0.5 shrink-0 text-primary-text" />
              {reason}
            </li>
          ))}
        </ul>
      </section>
      <Banner tone="info">{copy.promise}</Banner>
    </div>
  </HostScreen>
);
