import {Injectable} from "@angular/core";
import {Effect, Actions, toPayload} from "@ngrx/effects";
import {Observable} from "rxjs";
import {WidgetActions} from "../../widget/widget.state";
import {AngularFireDatabase} from "angularfire2";
import {PollVotesLoadedAction, VotesActions} from "./votes.state";
import {VoteService} from "./vote.service";
import {Vote, VoteEntity} from "./vote.models";
import {voteForEntity} from "./vote.functions";

@Injectable()
export class VoteEffects {

  @Effect()
  loadPollVotesEffects: Observable<PollVotesLoadedAction> =
    Observable.merge(
      this.actions.ofType(VotesActions.LOAD_POLL_VOTES),
      this.actions.ofType(WidgetActions.ACTIVATE_POLL)
    ).map(toPayload)
      .map(payload => payload as string)
      .do(id => console.info(`initiating observePollVotes(${id})`))
      .flatMap(id => this.observePollVotes(id)
        .map(votes => new PollVotesLoadedAction(id, votes))
      );


  constructor(private actions: Actions, private pollService: VoteService, private db: AngularFireDatabase) {}

  private observePollVotes(id: string): Observable<Vote[]> {
    return this.db.list(`/votes/${id}`).map(votes => votes.map((it: VoteEntity) => voteForEntity(it)));
  }


}
