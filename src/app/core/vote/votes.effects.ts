import {Injectable} from "@angular/core";
import {Effect, Actions, toPayload} from "@ngrx/effects";
import {Observable} from "rxjs";
import {CoreActions} from "../state";
import {AngularFireDatabase} from "angularfire2";
import {
  PollVotesLoadedAction,
  VotesActions,
  VoteCastSuccessAction,
  LoadPollVotesAction,
  CastVoteAction
} from "./votes.state";
import {VoteService} from "./vote.service";

@Injectable()
export class VoteEffects {

  @Effect()
  loadActivatedPollVotes: Observable<LoadPollVotesAction> =
    this.actions.ofType(CoreActions.ACTIVATE_POLL)
      .map(toPayload)
      .map(pollId => new LoadPollVotesAction(pollId));

  @Effect()
  loadPollVotesEffects: Observable<PollVotesLoadedAction> =
    this.actions.ofType(VotesActions.LOAD_POLL_VOTES)
      .map(toPayload)
      .map(payload => payload as string)
      .do(id => console.info(`initiating observePollVotes(${id})`))
      .flatMap(id => this.voteService.observePollVotes(id)
        .map(votes => new PollVotesLoadedAction(id, votes))
      );

  @Effect()
  doCastVotesEffect: Observable<VoteCastSuccessAction> =
    this.actions.ofType(VotesActions.CAST_VOTE)
      .map(action => action as CastVoteAction)
      .map(toPayload)
      .flatMap(info =>
        this.voteService.doCastVote(info.vote, info.pollId)
          .map(vote => new VoteCastSuccessAction(info.pollId, vote))
      );


  constructor(private actions: Actions, private voteService: VoteService, private db: AngularFireDatabase) {}


}
