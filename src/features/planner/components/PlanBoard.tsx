'use client';

import { Fragment, useOptimistic, useState, useTransition } from 'react';
import { Banner, Button, Icon } from '@/shared/components';
import { addBlockAction, planWithAiAction, removeBlockAction, setBlockTimeAction, voteAction } from '../actions';
import { PLANNER_COPY, PLANNER_ERRORS } from '../constants';
import type { VoteDto } from '../dto';
import type { CandidateOffering, PlannerActionState, PlannerBlock, PlannerTrip } from '../interfaces';
import { formatDateRange } from '../utils';
import { BlockModal } from './BlockModal';
import { ExperiencesPanel } from './ExperiencesPanel';
import { InviteButton } from './InviteButton';
import { SaveBar } from './SaveBar';
import { Timeline } from './Timeline';

const META_ICON_PX = 16;
const MAX_AVATARS = 5;

const initial = (name: string): string => name.trim().charAt(0).toUpperCase();

/** An action that never resolves to a state (a lost session, a network drop) becomes a banner, not a crashed page. */
const safely = (work: Promise<PlannerActionState>): Promise<PlannerActionState> => work.catch(() => ({ error: PLANNER_ERRORS.generic }));

/** Mirrors the server's vote upsert so the arrows answer the tap before the round trip lands. */
const applyVote = (blocks: PlannerBlock[], { blockId, up }: VoteDto): PlannerBlock[] =>
  blocks.map((block) =>
    block.id !== blockId
      ? block
      : {
          ...block,
          upVotes: block.upVotes - Number(block.myVote === true) + Number(up === true),
          downVotes: block.downVotes - Number(block.myVote === false) + Number(up === false),
          myVote: up,
        },
  );

const PANEL_CLOSED = 'hidden';
const PANEL_OPEN = 'fixed inset-x-0 bottom-0 z-40 flex h-5/6 flex-col overflow-hidden rounded-t-xl shadow-lift';
/*
 * A column container, so the panel's section is stretched to the panel's width instead of sizing to its
 * own content: the nowrap listing titles would otherwise push it past the border. The height leaves room
 * for the top bar above and the save bar below while the panel stays pinned during a long scroll.
 */
const PANEL_DESKTOP =
  'bg-canvas desktop:sticky desktop:inset-x-auto desktop:bottom-auto desktop:top-20 desktop:flex desktop:h-auto desktop:max-h-[calc(100dvh-11rem)] desktop:w-96 desktop:shrink-0 desktop:flex-col desktop:overflow-hidden desktop:rounded-lg desktop:border desktop:border-hairline desktop:shadow-none';

interface PlanBoardProps {
  trip: PlannerTrip;
  candidates: CandidateOffering[];
}

export const PlanBoard = ({ trip, candidates }: PlanBoardProps) => {
  const [blocks, voteOptimistically] = useOptimistic(trip.blocks, applyVote);
  const [pending, startTransition] = useTransition();
  const [planning, setPlanning] = useState(false);
  const [state, setState] = useState<PlannerActionState>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [targetDay, setTargetDay] = useState<number | null>(null);
  const copy = PLANNER_COPY.board;

  const selected = blocks.find((block) => block.id === selectedId);
  const inPlan = new Set(blocks.map((block) => block.offeringId));
  const places = [trip.departureFrom, trip.destination].filter((place): place is string => Boolean(place));

  const run = (work: () => Promise<PlannerActionState>) => startTransition(async () => setState(await safely(work())));

  const add = (offeringId: string, dayIndex: number) => {
    setTargetDay(null);
    setPanelOpen(false);
    run(() => addBlockAction(trip.id, { id: crypto.randomUUID(), offeringId, dayIndex }));
  };
  const vote = (block: PlannerBlock, up: boolean) => {
    const next = block.myVote === up ? null : up;
    startTransition(async () => {
      voteOptimistically({ blockId: block.id, up: next });
      setState(await safely(voteAction(trip.id, { blockId: block.id, up: next })));
    });
  };
  const remove = (blockId: string) => {
    setSelectedId(null);
    run(() => removeBlockAction(trip.id, blockId));
  };
  const planForMe = () => {
    setPlanning(true);
    startTransition(async () => {
      setState(await safely(planWithAiAction(trip.id)));
      setPlanning(false);
    });
  };
  const openAdd = (dayIndex: number) => {
    setTargetDay(dayIndex);
    setPanelOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-6 desktop:flex-row desktop:items-start desktop:gap-8">
        <section className="flex min-w-0 flex-1 flex-col gap-5 tablet:gap-6">
          <header className="flex flex-col gap-3 tablet:gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-caption text-muted">
                {places.map((place, index) => (
                  <Fragment key={place}>
                    {index ? ` ${copy.to} ` : ''}
                    <span className="capitalize">{place}</span>
                  </Fragment>
                ))}
                {places.length ? ' · ' : ''}
                {formatDateRange(trip.startDate, trip.endDate)}
              </p>
              <h1 className="font-display text-display-md text-ink tablet:text-display-lg">{trip.name}</h1>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-1.5 text-caption text-muted">
                <Icon name="users" size={META_ICON_PX} />
                {copy.travellers(trip.members.length, trip.travellerCount)}
              </span>
              <ul className="flex -space-x-2">
                {trip.members.slice(0, MAX_AVATARS).map((member) => (
                  <li key={member.id} title={member.name} className="flex size-8 items-center justify-center rounded-full bg-surface-strong text-badge text-ink ring-2 ring-canvas">
                    {initial(member.name)}
                  </li>
                ))}
              </ul>
              <span className="ml-auto">
                <InviteButton shareCode={trip.shareCode} />
              </span>
            </div>

            <div className="tablet:w-fit">
              <Button size="md" icon="sparkles" onClick={planForMe} disabled={pending || trip.locked}>
                {planning ? copy.planning : copy.planForMe}
              </Button>
            </div>

            {trip.locked ? (
              <Banner tone="warning" icon="lock">
                {copy.locked}
              </Banner>
            ) : null}
            {state.note ? (
              <Banner tone="success" icon="sparkles">
                {state.note}
              </Banner>
            ) : null}
            {state.error ? <Banner tone="error">{state.error}</Banner> : null}
          </header>

          <div aria-busy={pending} className={`transition-opacity ${pending ? 'opacity-70' : ''}`}>
            <Timeline days={trip.days} blocks={blocks} locked={trip.locked} onDrop={add} onAdd={openAdd} onOpen={(block) => setSelectedId(block.id)} onVote={vote} />
          </div>
        </section>

        {panelOpen ? <button type="button" aria-label={copy.closePanel} onClick={() => setPanelOpen(false)} className="fixed inset-0 z-30 bg-scrim/50 desktop:hidden" /> : null}
        <aside className={`${panelOpen ? PANEL_OPEN : PANEL_CLOSED} ${PANEL_DESKTOP}`}>
          <ExperiencesPanel
            candidates={candidates}
            days={trip.days}
            inPlan={inPlan}
            targetDay={targetDay}
            locked={trip.locked}
            open={panelOpen}
            onAdd={add}
            onClearTarget={() => setTargetDay(null)}
            onClose={() => setPanelOpen(false)}
          />
        </aside>

        {selected ? (
          <BlockModal
            block={selected}
            dayIndex={trip.days.indexOf(selected.day)}
            locked={trip.locked}
            onClose={() => setSelectedId(null)}
            onSetTime={(startTime) => run(() => setBlockTimeAction(trip.id, { blockId: selected.id, startTime }))}
            onRemove={() => remove(selected.id)}
          />
        ) : null}
      </div>

      <SaveBar
        tripId={trip.id}
        blockCount={blocks.length}
        dayCount={trip.days.length}
        status={state.error ? 'failed' : pending ? 'saving' : 'saved'}
        locked={trip.locked}
        onAddExperiences={() => setPanelOpen(true)}
        onError={(error) => setState({ error })}
      />
    </>
  );
};
