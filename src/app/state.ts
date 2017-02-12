import {activePoll, sessionUser} from "./core/state";
import * as fromPolls from "./core/poll/polls.state";
import {PollsState} from "./core/poll/polls.state";
import {StoreModule, combineReducers, ActionReducer} from "@ngrx/store";
import {NgModule, Optional, SkipSelf} from "@angular/core";
import {createSelector} from "reselect";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {compose} from "@ngrx/core";
import {environment} from "../environments/environment";
import * as fromVotes from "./core/vote/votes.state";
import {VotesState} from "./core/vote/votes.state";
import {polls} from "./core/poll/polls.reducer";
import {votes} from "./core/vote/votes.reducer";
import {ResultsState} from "./results/results.models";
import {results} from "./results/results.reducer";
import * as fromAuth from "./auth/auth.state";
import {AuthState, auth} from "./auth/auth.state";
import * as fromUsers from "./core/user/user.state";
import {UsersState, users} from "./core/user/user.state";
import {BallotState, ballot} from "./ballot/ballot.state";


export interface AppState {
  activePoll: string,
  sessionUser: string,
  auth: AuthState,
  polls: PollsState,
  votes: VotesState,
  users: UsersState,
  ballot: BallotState,
  results: ResultsState
}

export const reducers = {
  activePoll: activePoll,
  sessionUser: sessionUser,
  auth: auth,
  polls: polls,
  votes: votes,
  users: users,
  ballot: ballot,
  results: results
};


export const getActivePollId = (state: AppState) => state.activePoll;

export const getSessionUserId = (state: AppState) => state.sessionUser;

export const getPollsState = (state: AppState) => state.polls;

export const getVotesState = (state: AppState) => state.votes;

export const getBallotState = (state: AppState) => state.ballot;

export const getResultsState = (state: AppState) => state.results;

export const getAuthState = (state: AppState) => state.auth;


export const getAuthUserInfo = createSelector(getAuthState, fromAuth.getAuthInfo);

export const getAuthUserId = createSelector(getAuthUserInfo, (info) => {
  return info.uid;
});



export const getUserState = (state: AppState) => state.users;

export const getUserData = createSelector(getUserState, fromUsers.getLoadedUserData);

export const getSessionUserData = createSelector(getSessionUserId, getUserData, (id, users) => users[ id ]);


const getPollIds = createSelector(getPollsState, fromPolls.getPollIds);

const getPollEntities = createSelector(getPollsState, fromPolls.getPollEntities);

const getVoteIds = createSelector(getVotesState, fromVotes.getVoteIds);

export const getVoteEntities = createSelector(getVotesState, fromVotes.getVotes);

const getPollIndexedVotes = createSelector(getVotesState, fromVotes.getVotesIndexedByPollId);



export const getActivePoll = createSelector(getActivePollId, getPollEntities, (id, entities) => {
  console.log(entities);
  if (id == undefined) {
    return undefined
  } else {
    return entities[ id ];
  }
});

export const getVotesForActivePoll = createSelector(getActivePollId, getPollIndexedVotes, getVoteEntities, (activePollId, votesByPoll, votes) => {
  if (!activePollId || !votesByPoll[ activePollId ]) {
    return [];
  } else {
    let ret = votesByPoll[ activePollId ].map(id => votes[ id ]).filter(it => {
      if (!it) {
        console.log('undefined vote!!');

        debugger;
      }
      return !!it;
    });

    return ret;
  }
});


const devReducer: ActionReducer<AppState> = compose(combineReducers)(reducers);

const productionReducer: ActionReducer<AppState> = combineReducers(reducers);


export function makeReducer(state: any, action: any) {
  return environment.production ? productionReducer(state, action) : devReducer(state, action);
}


@NgModule({
  imports: [
    StoreModule.provideStore(makeReducer),
    StoreDevtoolsModule.instrumentOnlyWithExtension()
  ],
  exports: [
    StoreModule, StoreDevtoolsModule
  ]
})
export class AppStateModule {

  constructor(@Optional() @SkipSelf() parentModule: AppStateModule) {
    if (parentModule) {
      throw new Error(
        'Attempted to load AppStateModule more than once.');
    }
  }

}
