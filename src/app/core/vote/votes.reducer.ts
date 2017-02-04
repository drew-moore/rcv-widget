import {VotesState, VotesActions, PollVotesLoadedAction} from "./votes.state";
import {sortBy} from "lodash";
import {Action} from "@ngrx/store";
import {Vote} from "./vote.models";
import {votesEqual} from "./vote.functions";


const initialState: VotesState = {
  voteIds: [],
  votes: {},
  pollIds: [],
  pollVotes: {}
};


export function votes(state: VotesState, action: Action): VotesState {

  switch (action.type) {

    case VotesActions.POLL_VOTES_LOADED:
      let data = (action as PollVotesLoadedAction).payload;
      let newPollIds: string[],
        newPollVotes: { [id: string]: string[] },
        newVoteIds: string[],
        newVotes: { [id: string]: Vote };

      if (state.pollIds.indexOf(data.pollId) < 0) {
        //we can assume we haven't loaded any of the votes
        return {
          voteIds: [ ...state.voteIds, ...data.votes.map(vote => vote.id) ],
          votes: Object.assign({}, state.votes, data.votes.reduce((result, vote) => Object.assign(result, { [vote.id]: vote }), {})),
          pollIds: [ ...state.pollIds, data.pollId ],
          pollVotes: Object.assign({}, state.pollVotes, { [data.pollId]: data.votes.map(vote => vote.id) })
        }
      } else {
        let dataChanged = false;

        if (state.pollVotes[ data.pollId ].length == data.votes.length) {
          //we want to avoid returning a new object if the data hasn't changed - but doing a deep equality check is expensive too...
          let sortedVotes = sortBy(data.votes, 'id');
          let next: Vote;

          for (let i = 0; i < sortedVotes.length; i++) {
            next = sortedVotes[ i ];
            if (!votesEqual(sortedVotes[ i ], next)) {
              dataChanged = true;
              break;
            }
          }
          /*          for(let i = 0; i < sortedVotes.length; i++){
           next = sortedVotes[i];
           if (!votesEqual(sortedVotes[i], next)){
           newVotes[next.id] = Object.assign({}, state.votes[i], next);
           dataChanged = true;
           } else {
           newVotes[next.id] = state.votes[next.id];
           }

           if (!dataChanged){
           return state;
           } else {

           }

           }*/
        } else {
          dataChanged = true;
        }

        if (!dataChanged) {
          return state;
        } else {
          let dataVoteIds = data.votes.map(vote => vote.id),
            dataVoteMap: { [id: string]: Vote } = data.votes.reduce((result, vote) => Object.assign(result, { [vote.id]: vote }), {});

          let newVoteIds = dataVoteIds.filter(id => state.voteIds.indexOf(id) < 0),
            updatedVoteIds = dataVoteIds.filter(id => state.voteIds.indexOf(id) >= 0);

          let newVotesObj = Object.assign({}, state.votes,
            updatedVoteIds.reduce((result, voteId) =>
                //overwrite extant data with new data where they clash
                Object.assign(result, { [voteId]: Object.assign({}, state.votes[ voteId ], dataVoteMap[ voteId ]) }),
              {}),
            newVoteIds.reduce((result, voteId) => Object.assign(result, { [voteId]: dataVoteMap[ voteId ] }))
          );


          return {
            voteIds: [ ...state.voteIds, ...data.votes.map(vote => vote.id) ],
            votes: newVotesObj,
            pollIds: [ ...state.pollIds ], //we already know this one is in there
            pollVotes: Object.assign({}, state.pollVotes, { [data.pollId]: [ ...state.pollVotes[ data.pollId ], ...newVoteIds ] })
          }
        }


      }


    default:
      return state;


  }

}

