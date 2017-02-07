import {Injectable} from "@angular/core";
import {Effect, Actions, toPayload} from "@ngrx/effects";
import {Observable} from "rxjs";
import {PollLoadedAction, PollsActions, PollCreatedAction} from "./polls.state";
import {WidgetActions} from "../../widget/widget.state";
import {Poll, PollEntity, PartialPoll} from "./poll.models";
import {AngularFireDatabase} from "angularfire2";
import {forEntity} from "./poll.functions";
import {PollService} from "./poll.service";

@Injectable()
export class PollEffects {

  @Effect()
  loadPollEffects: Observable<PollLoadedAction> =
    Observable.merge(
      this.actions.ofType(PollsActions.LOAD_POLL),
      this.actions.ofType(WidgetActions.ACTIVATE_POLL)
    ).map(toPayload)
      .map(payload => payload as string)
      .do(id => console.info(`initiating observePoll(${id})`))
      .flatMap(id => this.observePoll(id))
      .map(poll => new PollLoadedAction(poll));

  @Effect()
  createPollEffects: Observable<PollCreatedAction> =
    this.actions.ofType(PollsActions.CREATE_POLL)
      .map(toPayload)
      .flatMap((it: PartialPoll) => this.pollService.createPoll(it))
      .map(poll => new PollCreatedAction(poll));


  constructor(private actions: Actions, private pollService: PollService, private db: AngularFireDatabase) {}


  observePoll(id: string): Observable<Poll> {

    return this.db.object(`/polls/${id}`).map(it => it as PollEntity).map(ent => forEntity(ent)).filter(it => !!it);

  }


}
