import {Vote, PartialVote} from "./vote.models";
import {Action} from "@ngrx/store";

export interface VotesState {
  voteIds: string[];
  votes: { [id: string]: Vote };

  //index of each poll id to arrays of the ids of votes cast in
  pollIds: string[]
  pollVotes: { [pollId: string]: string[] }; //SORTED array of vote ids that belong to each poll

}


export const VotesActions = {
  LOAD_POLL_VOTES: '[Votes]: loadPollVotes',
  POLL_VOTES_LOADED: '[Votes] pollVotesLoaded',
  CAST_VOTE: '[Votes] castVote',
  VOTE_CAST_SUCCESS: '[Votes] voteCastSuccess'
};


export class LoadPollVotesAction implements Action {
  public readonly type = VotesActions.LOAD_POLL_VOTES;

  constructor(public readonly payload: string) {}
}

export class PollVotesLoadedAction implements Action {
  public readonly type = VotesActions.POLL_VOTES_LOADED;
  public readonly payload: { pollId: string, votes: Vote[] };

  constructor(pollId: string, votes: Vote[]) {
    this.payload = { pollId, votes };
  }
}

export class CastVoteAction implements Action {
  public readonly type = VotesActions.CAST_VOTE;

  constructor(public readonly payload: PartialVote) {}
}

export class VoteCastSuccessAction implements Action {
  public readonly type = VotesActions.VOTE_CAST_SUCCESS;
  public readonly payload: { pollId: string, vote: Vote };

  constructor(pollId: string, vote: Vote) {
    this.payload = { pollId, vote };
  }
}


export const getVoteIds = (state: VotesState) => state.voteIds;

export const getVotes = (state: VotesState) => state.votes;

export const getPollsWithVotesLoadedIds = (state: VotesState) => state.pollIds;

export const getVotesIndexedByPollId = (state: VotesState) => state.pollVotes;

