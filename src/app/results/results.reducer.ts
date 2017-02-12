import {ResultsState, RoundState, PollOutcome} from "./results.models";
import {Action} from "@ngrx/store";
import {PollOption} from "../core/poll/poll.models";
import {Vote} from "../core/vote/vote.models";
import {computeRounds} from "./results.functions";


export const ResultsActions = {
  INITIALIZE: '[Results] initialize',
  NEXT_ROUND: '[Results] nextRound',
  PREV_ROUND: '[Results] prevRound',
  RESTART: '[Results] restart',
  BAR_HOVERED: '[Results] barHovered',
  SEGMENT_HOVERED: '[Results] segmentHovered',
  OPTION_REMOVED: '[Results] optionRemoved',
  OPTION_UNREMOVED: '[Results] optionUnremoved',
  NEW_VOTES_RECEIVED: '[Results] newVotesReceived',
  NEW_VOTES_DISMISSED: '[Results] newVotesDismissed',
};

export class InitializeResultsAction implements Action {
  type = ResultsActions.INITIALIZE;
  public readonly payload: { options: PollOption[], votes: Vote[] };

  constructor(options: PollOption[], votes: Vote[]) { this.payload = { options, votes };}
}

export class NextRoundAction implements Action {
  type = ResultsActions.NEXT_ROUND;
}

export class PrevRoundAction implements Action {
  type = ResultsActions.PREV_ROUND;
}

export class BarHoveredAction implements Action {
  type = ResultsActions.BAR_HOVERED;
  payload: { barId: string; value: boolean };

  constructor(barId: string, value: boolean) {
    this.payload = { barId, value }
  }
}

export class SegmentHoveredAction implements Action {
  type = ResultsActions.SEGMENT_HOVERED;
  payload: { barId: string; segmentId: string, value: boolean };

  constructor(barId: string, segmentId: string, value: boolean) {
    this.payload = { barId, segmentId, value }
  }
}

export class RemoveOptionAction implements Action {
  type = ResultsActions.OPTION_REMOVED;
  payload: { remove: string, options: PollOption[], votes: Vote[] };

  constructor(remove: string, options: PollOption[], votes: Vote[]) {
    this.payload = { remove, options, votes };
  }
}

export class UnremoveOptionAction implements Action {
  type = ResultsActions.OPTION_UNREMOVED;
  payload: { unremove: string, options: PollOption[], votes: Vote[] };

  constructor(unremove: string, options: PollOption[], votes: Vote[]) {
    this.payload = { unremove, options, votes };
  }
}

export class RestartAction implements Action {
  type = ResultsActions.RESTART;
}

export class NewVotesReceivedAction implements Action {
  type = ResultsActions.NEW_VOTES_RECEIVED;
}

export class NewVotesDismissedAction implements Action {
  type = ResultsActions.NEW_VOTES_DISMISSED;
}


export function results(state: ResultsState, action: Action): ResultsState {

  switch (action.type) {
    case ResultsActions.INITIALIZE:
      let data = (action as InitializeResultsAction).payload;
      let rounds: RoundState[] = computeRounds(data.options, data.votes, []);
      let outcome: PollOutcome;
      if (rounds[ rounds.length - 1 ].outcome == false) {
        debugger;
        throw '';
      } else {
        outcome = rounds[ rounds.length - 1 ].outcome as PollOutcome
      }

      return {
        currRound: 0,
        rounds,
        outcome,
        removed: [],
        hovered: {},
        newVotesPending: false
      };

    case ResultsActions.NEXT_ROUND:
      let nextRd = Math.min(state.rounds.length - 1, state.currRound + 1);
      return Object.assign({}, state, { currRound: nextRd });

    case ResultsActions.PREV_ROUND:
      let prevRd = Math.max(0, state.currRound - 1);
      return Object.assign({}, state, { currRound: prevRd });

    case ResultsActions.BAR_HOVERED:
      let barHoverInfo = (action as BarHoveredAction).payload;
      if (barHoverInfo.value == true) {
        return Object.assign({}, state, { hovered: { bar: barHoverInfo.barId } })
      } else {
        return Object.assign({}, state, { hovered: {} })
      }

    case ResultsActions.SEGMENT_HOVERED:
      let segHoverInfo = (action as SegmentHoveredAction).payload;

      if (segHoverInfo.value == true) {
        return Object.assign({}, state, { hovered: { bar: segHoverInfo.barId, segment: segHoverInfo.segmentId } })
      } else {
        return Object.assign({}, state, { hovered: { bar: state.hovered.bar } })
      }

    case ResultsActions.OPTION_REMOVED:
      let toRemove = (action as RemoveOptionAction).payload.remove,
        options = (action as InitializeResultsAction).payload.options,
        votes = (action as InitializeResultsAction).payload.votes,
        newRounds = computeRounds(options, votes, [ ...state.removed, toRemove ]),
        newOutcome = newRounds[ newRounds.length - 1 ].outcome as PollOutcome;

      if (!newOutcome) {
        debugger;
      }

      return {
        currRound: 0,
        rounds: newRounds,
        outcome: newOutcome,
        removed: [ ...state.removed, toRemove ],
        hovered: {},
        newVotesPending: false
      };

    case ResultsActions.OPTION_UNREMOVED:
      let toUnremove = (action as UnremoveOptionAction).payload.unremove,
        nowRemoved = state.removed.filter(it => it !== toUnremove);
      options = (action as InitializeResultsAction).payload.options,
        votes = (action as InitializeResultsAction).payload.votes,
        newRounds = computeRounds(options, votes, nowRemoved),
        newOutcome = newRounds[ newRounds.length - 1 ].outcome as PollOutcome;

      return {
        currRound: 0,
        rounds: newRounds,
        outcome: newOutcome,
        removed: nowRemoved,
        hovered: {},
        newVotesPending: false
      };

    case ResultsActions.RESTART:
      return Object.assign({}, state, { currRound: 0 });

    case ResultsActions.NEW_VOTES_RECEIVED:
      return Object.assign({}, state, { newVotesPending: true });

    case ResultsActions.NEW_VOTES_DISMISSED:
      return Object.assign({}, state, { newVotesPending: false });


    default:
      return state;

  }


}
