import {Injectable} from "@angular/core";
import {Effect, Actions, toPayload} from "@ngrx/effects";
import {Observable} from "rxjs";
import {PollLoadedAction, PollsActions, PollCreatedAction, LoadPollAction} from "./polls.state";
import {CoreActions} from "../state";
import {Poll, PartialPoll} from "./poll.models";
import * as polls from "./poll.functions";
import {PollService} from "./poll.service";

@Injectable()
export class PollEffects {

  @Effect()
  loadActivatedPolls = this.actions.ofType(CoreActions.ACTIVATE_POLL)
    .map(toPayload)
    .map(id => new LoadPollAction(id));


  @Effect()
  doLoads: Observable<PollLoadedAction> =
    this.actions.ofType(PollsActions.LOAD_POLL)
      .map(toPayload)
      .map(payload => payload as string)
      .do(id => console.info(`initiating observePoll(${id})`))
      .flatMap(id => this.pollService.observePollEntity(id))
      .map(ent => polls.forEntity(ent))
      .filter(ent => !!ent)
      .map(it => it as Poll) //the above filter makes this safe
      .map(poll => new PollLoadedAction(poll));

  @Effect()
  doCreates: Observable<PollCreatedAction> =
    this.actions.ofType(PollsActions.CREATE_POLL)
      .map(toPayload)
      .flatMap((it: PartialPoll) => this.pollService.createPoll(it))
      .map(poll => new PollCreatedAction(poll));


  constructor(private actions: Actions, private pollService: PollService) {}





}
