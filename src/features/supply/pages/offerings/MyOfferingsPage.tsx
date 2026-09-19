'use client';

import { Banner, Button, EmptyState } from '@/shared/components';
import { HostScreen, NextStepsCard, OfferingCard } from '../../components';
import { HOST_COPY, HOST_ROUTES, NEW_DRAFT_KEY } from '../../constants';
import { useDraft, useHostApp } from '../../hooks';
import type { HostAppState, VerificationTier } from '../../interfaces';
import { selectHost, selectOfferings } from '../../services';

const copy = HOST_COPY.offerings;
const selectTier = (state: HostAppState): VerificationTier => selectHost(state).tier;

export const MyOfferingsPage = () => {
  const offerings = useHostApp(selectOfferings);
  const tier = useHostApp(selectTier);
  const unfinished = useDraft(NEW_DRAFT_KEY);
  const isEmpty = offerings.length === 0;
  const withoutPhotos = offerings.find((offering) => offering.photos.length === 0);

  // First-run guidance is inline, never a tutorial.
  const nextSteps = (
    <NextStepsCard
      verified={tier !== 'REGISTERED'}
      hasOffering={!isEmpty}
      hasPhotos={offerings.some((offering) => offering.photos.length > 0)}
      photosHref={withoutPhotos ? HOST_ROUTES.offerings.editField(withoutPhotos.id, 'photos') : HOST_ROUTES.create.category}
    />
  );

  return (
    <HostScreen
      pageTitle={copy.title}
      showNav
      footer={
        isEmpty ? null : (
          <Button icon="plus" href={HOST_ROUTES.create.category}>
            {copy.add}
          </Button>
        )
      }
    >
      <div className="flex flex-col gap-8">
        {/* With nothing listed yet the invitation leads and the checklist follows; after that the checklist is the reminder on top. */}
        {isEmpty ? (
          <EmptyState
            illustration="offerings"
            title={copy.emptyTitle}
            message={copy.empty}
            action={
              <Button icon="mic" href={HOST_ROUTES.create.category}>
                {copy.emptyCta}
              </Button>
            }
          />
        ) : (
          nextSteps
        )}
        {unfinished ? (
          <Banner tone="info" icon="pencil">
            <p>{copy.resumePrompt}</p>
            <Button variant="tertiary" href={unfinished.drafted ? HOST_ROUTES.create.draft : HOST_ROUTES.create.voice}>
              {copy.resumeCta}
            </Button>
          </Banner>
        ) : null}
        {isEmpty ? (
          nextSteps
        ) : (
          <ul className="grid grid-cols-1 gap-8 tablet:grid-cols-2 desktop:grid-cols-3">
            {offerings.map((offering) => (
              <li key={offering.id}>
                <OfferingCard offering={offering} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </HostScreen>
  );
};
