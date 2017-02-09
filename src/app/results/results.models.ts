import {PollOption} from "../core/poll/poll.models";

export interface InboundVoteTransfer {
  source: PollOption;
  round: number;
  count: number;
}

export interface OutboundVoteTransfer {
  target: PollOption;
  round: number;
  count: number
}

export type VoteTransfer = InboundVoteTransfer|OutboundVoteTransfer;

export interface ResultsState {
  currRound: number;
  rounds: RoundState[];
  outcome: PollOutcome;
  removed: string[];
  hovered: {
    bar?: string,
    segment?: string
  },
  newVotesPending: boolean
}


export type PollOutcome = {
  activeVotes: number;
  places: OptionOutcome[]
}

export type OptionOutcome = {
  id: string;
  place: number;
  score: number;
  outOf: number;
}


export interface OptionStateSnapshot {
  status: 'active'|'eliminated'|'removed';
  votes: {
    count: number;
    outOf: number;
  }
  votesIn?: InboundVoteTransfer;
  votesOut?: OutboundVoteTransfer[];
}


export interface RoundState {
  round: number;
  outcome: PollOutcome|false;
  options: { [id: string]: OptionStateSnapshot };
  eliminated: string[];
  votes: {
    active: number;
    inactive: number;
  }
}
