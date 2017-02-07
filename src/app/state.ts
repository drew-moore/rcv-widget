import * as fromWidget from "./widget/widget.state";
import {WidgetState, widget} from "./widget/widget.state";
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
import {PollEffects} from "./core/poll/polls.effects";
import {EffectsModule} from "@ngrx/effects";
import {VoteEffects} from "./core/vote/votes.effects";
import {ResultsState} from "./results/results.models";
import {results} from "./results/results.reducer";
import {AuthState, auth} from "./auth/auth.state";

export interface AppState {
  auth: AuthState,
  polls: PollsState,
  votes: VotesState,
  widget: WidgetState,
  results: ResultsState
}

export const reducers = {
  auth: auth,
  polls: polls,
  votes: votes,
  widget: widget,
  results: results
};


export const getWidgetState = (state: AppState) => state.widget;

export const getPollsState = (state: AppState) => state.polls;

export const getVotesState = (state: AppState) => state.votes;

export const getResultsState = (state: AppState) => state.results;

export const getAuthState = (state: AppState) => state.auth;


const getActivePollId = createSelector(getWidgetState, fromWidget.getActivePollId);

const getPollIds = createSelector(getPollsState, fromPolls.getPollIds);

const getPollEntities = createSelector(getPollsState, fromPolls.getPollEntities);

const getVoteIds = createSelector(getVotesState, fromVotes.getVoteIds);

const getVotes = createSelector(getVotesState, fromVotes.getVotes);

const getPollIndexedVotes = createSelector(getVotesState, fromVotes.getVotesIndexedByPollId);


export const getActivePoll = createSelector(getActivePollId, getPollEntities, (id, entities) => {
  console.log(entities);
  if (id == undefined) {
    return undefined
  } else {
    return entities[ id ];
  }
});

export const getVotesForActivePoll = createSelector(getActivePollId, getPollIndexedVotes, getVotes, (activePollId, votesByPoll, votes) => {
  if (!activePollId || !votesByPoll[ activePollId ]) {
    return [];
  } else {
    return votesByPoll[ activePollId ].map(id => votes[ id ]);
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
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    EffectsModule.run(PollEffects),
    EffectsModule.run(VoteEffects)
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
