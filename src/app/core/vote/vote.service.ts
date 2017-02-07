import {Injectable} from "@angular/core";
import {createSelector} from "reselect";
import {AngularFireDatabase} from "angularfire2";
import {Store} from "@ngrx/store";
import {AppState, getVotesState, getVoteEntities} from "../../state";
import {Observable} from "rxjs";
import {VotesState} from "./votes.state";
import {Vote} from "./vote.models";

@Injectable()
export class VoteService {

  private state$: Observable<VotesState>;

  constructor(private db: AngularFireDatabase, private store: Store<AppState>) {
    this.state$ = store.select(getVotesState);
  }


  public loadSingleVote(pollId: string, voteId: string): Observable<Vote> {


    let selector = createSelector(getVoteEntities, (votes) => votes[ voteId ]);

    return this.store.select(selector);
  }


}
